import { useEffect, useRef, useState } from "react";
import { pointAlongPath, trafficSettings } from "../atlas-model.js";
import { publicUrl } from "../public-url.js";
export default function TrafficInk({ map, motion, preset, visible }) {
  const canvas = useRef(null),
    clock = useRef(0),
    [paths, setPaths] = useState([]),
    [stamp, setStamp] = useState(null);
  useEffect(() => {
    let live = true;
    fetch(publicUrl("map/traffic-paths.json"))
      .then((r) => r.json())
      .then((data) => {
        const count = {};
        const length = (p) =>
          p.coordinates
            .slice(1)
            .reduce(
              (sum, b, i) =>
                sum +
                Math.hypot(
                  b[0] - p.coordinates[i][0],
                  b[1] - p.coordinates[i][1],
                ),
              0,
            );
        const routes = data
          .filter((p) => p.coordinates.length > 1)
          .sort((a, b) => length(b) - length(a))
          .filter((p) => {
            count[p.name] = (count[p.name] || 0) + 1;
            return count[p.name] <= 2;
          });
        if (live) setPaths(routes);
      })
      .catch(() => {
        if (live) setPaths([]);
      });
    const img = new Image();
    img.onload = () => {
      if (live) setStamp(img);
    };
    img.src = publicUrl("assets/footprint.png");
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!map || !stamp || !paths.length) return;
    const el = canvas.current,
      ctx = el.getContext("2d"),
      settings = trafficSettings(preset);
    let frame,
      previous = 0,
      projected = [];
    const project = () => {
      const dpr = Math.min(devicePixelRatio, 2),
        box = map.getContainer();
      el.width = box.clientWidth * dpr;
      el.height = box.clientHeight * dpr;
      el.style.width = box.clientWidth + "px";
      el.style.height = box.clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      projected = paths
        .map((p, i) => {
          const coords = p.coordinates.map((c) => {
            const q = map.project(c);
            return [q.x, q.y];
          });
          return {
            coords,
            i,
            length: coords
              .slice(1)
              .reduce(
                (sum, b, j) =>
                  sum + Math.hypot(b[0] - coords[j][0], b[1] - coords[j][1]),
                0,
              ),
          };
        })
        .filter((p) => p.length > 65);
      if (!motion) draw(0);
    };
    const draw = (now) => {
      if (motion && previous && !document.hidden)
        clock.current += Math.min((now - previous) / 1000, 0.08);
      previous = now;
      ctx.clearRect(0, 0, el.width, el.height);
      const reveal = Math.max(0, Math.min(1, (map.getZoom() - 13.25) / 0.5));
      if (visible && reveal)
        for (const route of projected) {
          if (route.i % 3 === 2 && settings.density === 1) continue;
          const count = route.i < 4 ? settings.density : 1;
          for (let trail = 0; trail < count; trail++) {
            const time = clock.current + route.i * 5 + trail * 17,
              step = (time * settings.speed) / 17,
              head = Math.floor(step),
              fraction = step - head;
            for (let age = 0; age < 7; age++) {
              const n = head - age,
                dist =
                  (((n * 17 + route.i * 37 + trail * 113) % route.length) +
                    route.length) %
                  route.length;
              const { point, angle } = pointAlongPath(
                route.coords,
                dist / route.length,
              );
              if (
                point[0] < -10 ||
                point[0] > el.clientWidth + 10 ||
                point[1] < -10 ||
                point[1] > el.clientHeight + 10
              )
                continue;
              const side = n % 2 === 0 ? 1 : -1,
                alpha =
                  (1 - age / 7) *
                  reveal *
                  (age === 0 ? Math.min(1, fraction * 3) : 1) *
                  0.78;
              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.translate(
                point[0] - Math.sin(angle) * side * 2.7,
                point[1] + Math.cos(angle) * side * 2.7,
              );
              ctx.rotate(angle + Math.PI / 2);
              ctx.scale(side, 1);
              ctx.drawImage(stamp, -1.8, -5.5, 3.6, 11);
              ctx.restore();
            }
          }
        }
      if (motion) frame = requestAnimationFrame(draw);
    };
    project();
    map.on("move", project);
    map.on("resize", project);
    if (motion) frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      map.off("move", project);
      map.off("resize", project);
    };
  }, [map, paths, stamp, motion, preset, visible]);
  return <canvas ref={canvas} className="traffic-ink" aria-hidden="true" />;
}
