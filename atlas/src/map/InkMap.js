import L from "leaflet";
import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import "leaflet/dist/leaflet.css";
import { publicUrl } from "../public-url.js";

// Render the original OSM vector geometry on canvas. No GPU or remote map service is required.
const tileCache = new Map();
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
                return {
                  geometry: f.loadGeometry(),
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
    const z = Math.min(14, Math.max(11, coords.z)),
      factor = 2 ** (coords.z - z),
      sx = Math.floor(coords.x / factor),
      sy = Math.floor(coords.y / factor),
      offsetX = (coords.x / factor - sx) * 256,
      offsetY = (coords.y / factor - sy) * 256;
    loadTile(z, sx, sy)
      .then((layers) => {
        const ctx = tile.getContext("2d");
        ctx.scale(dpr, dpr);
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
        fill("water", "rgba(112,90,60,.075)");
        // Coast outlines omit artificial straight tile boundaries.
        ctx.strokeStyle = "rgba(102,72,40,.62)";
        ctx.lineWidth = 0.8;
        for (const f of layers.water || []) {
          ctx.beginPath();
          for (const ring of f.geometry)
            for (let i = 1; i < ring.length; i++) {
              const a = ring[i - 1],
                b = ring[i],
                edge =
                  (a.x === b.x && (a.x <= 0 || a.x >= f.extent)) ||
                  (a.y === b.y && (a.y <= 0 || a.y >= f.extent));
              if (!edge) {
                ctx.moveTo(
                  ((a.x / f.extent) * 256 - offsetX) * factor,
                  ((a.y / f.extent) * 256 - offsetY) * factor,
                );
                ctx.lineTo(
                  ((b.x / f.extent) * 256 - offsetX) * factor,
                  ((b.y / f.extent) * 256 - offsetY) * factor,
                );
              }
            }
          ctx.stroke();
        }
        if (this.options.mini) {
          done(null, tile);
          return;
        }
        fill("park", "rgba(111,113,66,.12)", "rgba(100,97,54,.35)");
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
        fill(
          "building",
          `rgba(113,74,45,${coords.z < 14 ? 0.06 : 0.12})`,
          "rgba(93,59,30,.73)",
          coords.z > 16 ? 0.75 : 0.53,
        );
        const roads = layers.transportation || [],
          width =
            coords.z < 14 ? 0.9 : coords.z < 16 ? 1.9 : coords.z < 18 ? 3.8 : 7;
        for (const color of ["rgba(111,77,45,.49)", "#e8d2ab"]) {
          ctx.strokeStyle = color;
          ctx.lineWidth = color[0] === "#" ? Math.max(0.3, width - 1) : width;
          for (const f of roads) {
            if (
              ["rail", "path", "track", "service"].includes(f.properties.class)
            )
              continue;
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
          ctx.font = `${coords.z >= 17 ? 12 : 10}px "IM Fell English"`;
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
              ctx.strokeStyle = "#edd8b3";
              ctx.lineWidth = 3;
              ctx.strokeText(name, 0, 0);
              ctx.fillStyle = "#6b492f";
              ctx.fillText(name, 0, 0);
              ctx.restore();
            }
          }
        }
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
      fadeAnimation: true,
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
