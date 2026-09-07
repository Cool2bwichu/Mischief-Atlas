import L from "leaflet";
import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import "leaflet/dist/leaflet.css";
import { publicUrl } from "../public-url.js";
import { drawCoastalNature, hasCoastalNature } from "./nature-ink.js";

// Render the original OSM vector geometry on canvas. No GPU or remote map service is required.
const tileCache = new Map();
// Bounded raster cache makes revisiting nearby map/zoom tiles a bitmap copy.
const renderedTiles = new Map();
async function loadTile(z, x, y) {
  const key = `${z}/${x}/${y}`;
  if (!tileCache.has(key))
    tileCache.set(
      key,
      fetch(publicUrl(`map/${key}.pbf`))
        .then((r) => {
          if (!r.ok) throw new Error("Map tile unavailable");
          return r.arrayBuffer();
        })
        .then((buf) => {
          const tile = new VectorTile(new PbfReader(new Uint8Array(buf))),
            layers = {};
          for (const name of [
            "water",
            "park",
            "landcover",
            "building",
            "transportation",
            "transportation_name",
          ]) {
            const layer = tile.layers[name];
            if (layer)
              layers[name] = Array.from({ length: layer.length }, (_, i) => {
                const f = layer.feature(i);
                const geometry = f.loadGeometry();
                const bounds = [Infinity, Infinity, -Infinity, -Infinity];
                for (const ring of geometry)
                  for (const p of ring) {
                    bounds[0] = Math.min(bounds[0], p.x);
                    bounds[1] = Math.min(bounds[1], p.y);
                    bounds[2] = Math.max(bounds[2], p.x);
                    bounds[3] = Math.max(bounds[3], p.y);
                  }
                return {
                  geometry,
                  bounds,
                  properties: f.properties,
                  extent: f.extent,
                  type: f.type,
                };
              });
          }
          return layers;
        }),
    );
  return tileCache.get(key);
}
const InkTiles = L.GridLayer.extend({
  createTile(coords, done) {
    const tile = document.createElement("canvas"),
      dpr = Math.min(devicePixelRatio, 2);
    tile.width = tile.height = 256 * dpr;
    const renderKey = `${this.options.mini ? "inset" : "map"}/${coords.z}/${coords.x}/${coords.y}/${dpr}`;
    const cached = renderedTiles.get(renderKey);
    if (cached) {
      renderedTiles.delete(renderKey);
      renderedTiles.set(renderKey, cached);
      tile.getContext("2d").drawImage(cached, 0, 0);
      queueMicrotask(() => done(null, tile));
      return tile;
    }
    const z = Math.min(14, Math.max(11, coords.z)),
      factor = 2 ** (coords.z - z),
      sx = Math.floor(coords.x / factor),
      sy = Math.floor(coords.y / factor),
      offsetX = (coords.x / factor - sx) * 256,
      offsetY = (coords.y / factor - sy) * 256;
    loadTile(z, sx, sy)
      .then((sourceLayers) => {
        // At close zoom a canvas covers only a fraction of a source vector tile.
        // Discard off-canvas geometry before constructing expensive canvas paths.
        const layers = Object.fromEntries(
          Object.entries(sourceLayers).map(([name, features]) => [
            name,
            features.filter((f) => {
              const scale = (256 * factor) / f.extent;
              return (
                f.bounds[2] * scale - offsetX * factor >= -16 &&
                f.bounds[0] * scale - offsetX * factor <= 272 &&
                f.bounds[3] * scale - offsetY * factor >= -16 &&
                f.bounds[1] * scale - offsetY * factor <= 272
              );
            }),
          ]),
        );
        const ctx = tile.getContext("2d");
        ctx.scale(dpr, dpr);
        // Opaque white within the multiply-blended map pane lets the shared paper
        // show through, but prevents retained zoom layers bleeding through each other.
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 256, 256);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        const path = (f) => {
          ctx.beginPath();
          for (const ring of f.geometry) {
            ring.forEach((p, i) => {
              const x = ((p.x / f.extent) * 256 - offsetX) * factor,
                y = ((p.y / f.extent) * 256 - offsetY) * factor;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });
            if (f.type === 3) ctx.closePath();
          }
        };
        const fill = (
          name,
          color,
          stroke,
          width = 0.5,
          filter = () => true,
        ) => {
          for (const f of layers[name] || []) {
            if (!filter(f)) continue;
            path(f);
            ctx.fillStyle = color;
            ctx.fill("evenodd");
            if (stroke) {
              ctx.strokeStyle = stroke;
              ctx.lineWidth = width;
              ctx.stroke();
            }
          }
        };
        fill("water", "#fff");
        // Retain exact geographic edges; never stroke artificial tile closures.
        for (const f of layers.water || []) {
          const coast = new Path2D(),
            segments = [];
          for (const ring of f.geometry)
            for (let i = 1; i < ring.length; i++) {
              const a = ring[i - 1],
                b = ring[i];
              if (
                (a.x === b.x && (a.x <= 0 || a.x >= f.extent)) ||
                (a.y === b.y && (a.y <= 0 || a.y >= f.extent))
              )
                continue;
              const ax = ((a.x / f.extent) * 256 - offsetX) * factor;
              const ay = ((a.y / f.extent) * 256 - offsetY) * factor;
              const bx = ((b.x / f.extent) * 256 - offsetX) * factor;
              const by = ((b.y / f.extent) * 256 - offsetY) * factor;
              coast.moveTo(ax, ay);
              coast.lineTo(bx, by);
              segments.push([ax, ay, bx, by]);
            }
          if (!this.options.mini && coords.z >= 14) {
            ctx.save();
            path(f);
            ctx.clip("evenodd");
            ctx.strokeStyle = "rgba(121,83,58,.38)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (const [ax, ay, bx, by] of segments) {
              const length = Math.hypot(bx - ax, by - ay);
              if (length < 3) continue;
              const nx = -(by - ay) / length,
                ny = (bx - ax) / length;
              // World-aligned sampling is stable across overzoom tile siblings.
              const phase =
                (((ax + coords.x * 256 + ay + coords.y * 256) % 9) + 9) % 9;
              for (let d = phase; d < length; d += 9) {
                const x = ax + ((bx - ax) * d) / length,
                  y = ay + ((by - ay) * d) / length;
                if (x < -10 || x > 266 || y < -10 || y > 266) continue;
                for (const side of [-1, 1]) {
                  ctx.moveTo(x + nx * side * 3 - 1, y + ny * side * 3 + 1);
                  ctx.lineTo(x + nx * side * 7 + 1, y + ny * side * 7 - 1);
                }
              }
            }
            ctx.stroke();
            ctx.restore();
          }
          ctx.strokeStyle = "rgba(75,45,32,.86)";
          ctx.lineWidth = this.options.mini ? 0.8 : coords.z < 14 ? 1.25 : 1.45;
          ctx.stroke(coast);
        }
        if (this.options.mini) {
          done(null, tile);
          return;
        }
        fill("park", "rgba(121,130,74,.17)", "rgba(100,97,54,.42)");
        fill("landcover", "rgba(119,122,71,.08)", null, 0.5, (f) =>
          ["wood", "grass"].includes(f.properties.class),
        );
        fill(
          "landcover",
          "rgba(194,140,62,.1)",
          null,
          0.5,
          (f) => f.properties.class === "sand",
        );
        if (hasCoastalNature(coords)) {
          const polygons = { wave: [], sand: [], palm: [] };
          for (const f of [
            ...(layers.water || []),
            ...(layers.landcover || []),
          ]) {
            const kind = layers.water?.includes(f)
              ? "wave"
              : f.properties.class === "sand"
                ? "sand"
                : ["wood", "grass"].includes(f.properties.class)
                  ? "palm"
                  : null;
            if (!kind || f.type !== 3) continue;
            const outline = new Path2D();
            for (const ring of f.geometry) {
              ring.forEach((p, i) => {
                const x = ((p.x / f.extent) * 256 - offsetX) * factor;
                const y = ((p.y / f.extent) * 256 - offsetY) * factor;
                if (i === 0) outline.moveTo(x, y);
                else outline.lineTo(x, y);
              });
              outline.closePath();
            }
            polygons[kind].push(outline);
          }
          drawCoastalNature(ctx, coords, polygons);
        }
        const buildingScale =
          coords.z < 14 ? "distant" : coords.z < 16 ? "near" : "detail";
        for (const f of layers.building || []) {
          const scale = (256 * factor) / f.extent;
          const area =
            (f.bounds[2] - f.bounds[0]) *
            (f.bounds[3] - f.bounds[1]) *
            scale *
            scale;
          if (buildingScale === "distant" && area < 7) continue;
          path(f);
          ctx.fillStyle =
            buildingScale === "distant"
              ? "rgba(121,83,58,.09)"
              : "rgba(121,83,58,.12)";
          ctx.fill("evenodd");
          if (buildingScale !== "distant") {
            ctx.strokeStyle = "rgba(95,60,37,.62)";
            ctx.lineWidth = buildingScale === "detail" ? 0.75 : 0.6;
            ctx.stroke();
          }
          if (buildingScale === "detail" && area > 100) {
            ctx.save();
            ctx.clip("evenodd");
            ctx.strokeStyle = "rgba(95,60,37,.30)";
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            const phase = ((coords.x + coords.y) * 256) % 6;
            const left = Math.max(-8, f.bounds[0] * scale - offsetX * factor);
            const right = Math.min(264, f.bounds[2] * scale - offsetX * factor);
            const top = Math.max(-8, f.bounds[1] * scale - offsetY * factor);
            const bottom = Math.min(
              264,
              f.bounds[3] * scale - offsetY * factor,
            );
            for (
              let k = Math.floor((left + top + phase) / 6) * 6 - phase;
              k < right + bottom;
              k += 6
            ) {
              ctx.moveTo(k - top, top);
              ctx.lineTo(k - bottom, bottom);
            }
            ctx.stroke();
            ctx.restore();
          }
        }
        const roads = layers.transportation || [];
        for (const interior of [false, true]) {
          ctx.strokeStyle = interior ? "#fff" : "rgba(106,71,43,.68)";
          for (const f of roads) {
            const kind = f.properties.class;
            if (["rail", "path", "track", "service"].includes(kind)) continue;
            const major = [
              "motorway",
              "trunk",
              "primary",
              "secondary",
              "tertiary",
            ].includes(kind);
            const width =
              coords.z < 14
                ? major
                  ? 1.3
                  : 0.4
                : coords.z < 16
                  ? major
                    ? 2.6
                    : 1.25
                  : major
                    ? 5.2
                    : 3.1;
            ctx.lineWidth = interior
              ? Math.max(0.2, width - (major ? 1.1 : 0.6))
              : width;
            if (interior && coords.z < 14 && !major) continue;
            path(f);
            ctx.stroke();
          }
        }
        ctx.strokeStyle = "rgba(110,78,45,.4)";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 3]);
        for (const f of roads) {
          if (!["path", "track", "service"].includes(f.properties.class))
            continue;
          path(f);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        if (coords.z >= 15 && !this.options.mini) {
          const used = [];
          ctx.font = `${coords.z >= 17 ? 13 : 12}px "IM Fell English"`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          for (const f of layers.transportation_name || []) {
            const name = f.properties.name_en || f.properties.name;
            if (!name) continue;
            for (const ring of f.geometry) {
              let best = null;
              for (let i = 1; i < ring.length; i++) {
                const a = ring[i - 1],
                  b = ring[i],
                  length =
                    ((Math.hypot(b.x - a.x, b.y - a.y) * 256) / f.extent) *
                    factor;
                if (!best || length > best.length) best = { a, b, length };
              }
              if (!best || best.length < ctx.measureText(name).width + 8)
                continue;
              const x =
                  (((best.a.x + best.b.x) / 2 / f.extent) * 256 - offsetX) *
                  factor,
                y =
                  (((best.a.y + best.b.y) / 2 / f.extent) * 256 - offsetY) *
                  factor;
              if (
                x < 20 ||
                x > 236 ||
                y < 20 ||
                y > 236 ||
                used.some((p) => Math.hypot(p.x - x, p.y - y) < 65)
              )
                continue;
              used.push({ x, y });
              let angle = Math.atan2(best.b.y - best.a.y, best.b.x - best.a.x);
              if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI;
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(angle);
              ctx.strokeStyle = "#f0dfbc";
              ctx.lineWidth = 3;
              ctx.strokeText(name, 0, 0);
              ctx.fillStyle = "#6b492f";
              ctx.fillText(name, 0, 0);
              ctx.restore();
            }
          }
        }
        renderedTiles.set(renderKey, tile);
        while (renderedTiles.size > 48)
          renderedTiles.delete(renderedTiles.keys().next().value);
        done(null, tile);
      })
      .catch(() => done(null, tile));
    return tile;
  },
});

export class InkMap {
  constructor({
    container,
    center = [-80.133, 25.782],
    zoom = 14,
    interactive = true,
  }) {
    this.map = L.map(container, {
      center: [center[1], center[0]],
      zoom: zoom + 1,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.5,
      minZoom: interactive ? 12.4 : 8,
      maxZoom: 19.3,
      zoomAnimation: false,
      fadeAnimation: false,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      keyboard: interactive,
      boxZoom: false,
      maxBounds: [
        [25.746, -80.205],
        [25.886, -80.105],
      ],
      maxBoundsViscosity: 0.8,
    });
    this.tiles = new InkTiles({
      tileSize: 256,
      minNativeZoom: 11,
      noWrap: true,
      bounds: [
        [25.746, -80.205],
        [25.886, -80.105],
      ],
      keepBuffer: 2,
      mini: !interactive,
      updateWhenIdle: true,
      updateWhenZooming: false,
    }).addTo(this.map);
    this.resize = new ResizeObserver(() =>
      this.map.invalidateSize({ pan: false }),
    );
    this.resize.observe(container);
    this.touchZoomRotate = { disableRotation: () => {} };
  }
  getContainer() {
    return this.map.getContainer();
  }
  getZoom() {
    return this.map.getZoom() - 1;
  }
  getCenter() {
    const c = this.map.getCenter();
    return [c.lng, c.lat];
  }
  project(c) {
    return this.map.latLngToContainerPoint([c[1], c[0]]);
  }
  on(event, fn) {
    if (event === "load") {
      queueMicrotask(() => {
        if (!this.removed) fn();
      });
    } else this.map.on(event, fn);
    return this;
  }
  off(event, fn) {
    this.map.off(event, fn);
    return this;
  }
  fitBounds(bounds, options = {}) {
    const p =
      typeof options.padding === "number"
        ? {
            left: options.padding,
            right: options.padding,
            top: options.padding,
            bottom: options.padding,
          }
        : options.padding || {};
    const opts = {
      paddingTopLeft: [p.left || 0, p.top || 0],
      paddingBottomRight: [p.right || 0, p.bottom || 0],
      maxZoom: (options.maxZoom || 18.3) + 1,
      duration: (options.duration || 0) / 1000,
    };
    const b = bounds.map((c) => [c[1], c[0]]);
    if (options.duration) this.map.flyToBounds(b, opts);
    else this.map.fitBounds(b, { ...opts, animate: false });
  }
  flyTo({ center, zoom, offset = [0, 0], duration = 0 }) {
    const z = zoom + 1,
      target = this.map.unproject(
        this.map.project([center[1], center[0]], z).subtract(offset),
        z,
      );
    if (duration) this.map.flyTo(target, z, { duration: duration / 1000 });
    else this.map.setView(target, z, { animate: false });
  }
  zoomIn(options = {}) {
    this.flyTo({
      center: [this.map.getCenter().lng, this.map.getCenter().lat],
      zoom: Math.min(18.3, this.getZoom() + 0.65),
      duration: options.duration,
    });
  }
  zoomOut(options = {}) {
    this.flyTo({
      center: [this.map.getCenter().lng, this.map.getCenter().lat],
      zoom: Math.max(11.4, this.getZoom() - 0.65),
      duration: options.duration,
    });
  }
  remove() {
    this.removed = true;
    this.resize.disconnect();
    this.map.remove();
  }
}
