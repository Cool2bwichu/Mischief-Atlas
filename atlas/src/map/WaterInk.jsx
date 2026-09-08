import { useEffect, useRef } from "react";

const banks = new Map(),
  COUNT = 96,
  BW = 144,
  BH = 80;
const noise = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

function waveBank(kind) {
  if (banks.has(kind)) return banks.get(kind);
  const frames = Array.from({ length: COUNT }, (_, i) => {
    const c = document.createElement("canvas");
    c.width = BW;
    c.height = BH;
    const ctx = c.getContext("2d"),
      t = (i / COUNT) * Math.PI * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const stroke = (path, width, alpha) => {
      ctx.strokeStyle = `rgba(91,57,35,${alpha})`;
      ctx.lineWidth = width * 1.35;
      ctx.stroke(new Path2D(path));
    };
    if (kind === 0) {
      // A crest grows and leans; the trailing trough develops independently.
      const a = 12 * Math.sin(t),
        b = 5 * Math.sin(t + 0.8),
        d = 8 * Math.sin(t + 2.1);
      ctx.fillStyle="rgba(91,57,35,.8)";
      ctx.fill(new Path2D(`M${34+a} 40 Q${45+a} 31 ${47+a} ${23+b} Q${56+a} ${17+b} ${62+a} 27 Q${55+a} ${24+b} ${52+a} 30 Q${45+a} 40 ${34+a} 43 Z`));
      stroke(
        `M10 42 Q${29 + a} ${47 + b} ${43 + a} 29 Q${51 + a} ${16 + b} ${62 + a} 27 Q${68 + a} 39 ${59 + a} 37`,
        1.35,
        0.74,
      );
      stroke(
        `M13 49 Q${34 + a} ${54 + b} ${50 + a} 36 M${55 + a} 29 Q${61 + a} 27 ${62 + a} 32`,
        0.65,
        0.55,
      );
      stroke(
        `M47 58 Q${69 + d} 66 ${86 + d} 45 Q${98 + d} ${35 - b} ${111 + d} 47`,
        0.85,
        0.64,
      );
      stroke(
        `M59 66 Q${83 + d} ${72 - b} ${107 + d} 55 M5 56 L18 58 M115 39 Q124 40 132 36`,
        0.55,
        0.42,
      );
    } else if (kind === 1) {
      const a = 8 * Math.sin(t),
        b = 5 * Math.sin(t + 1.4);
      ctx.fillStyle="rgba(91,57,35,.62)";
      ctx.fill(new Path2D(`M${24+a} ${44-b} Q${46+a} ${44+b} ${65+a} ${35+b} L${63+a} ${38+b} Q${44+a} ${48+b} ${24+a} ${46-b} Z`));
      stroke(
        `M8 ${36 + b} C${38 + a} ${53 - b} ${80 - a} ${23 + b} 131 ${37 - b}`,
        1.05,
        0.68,
      );
      stroke(
        `M18 ${44 + b} C${51 + a} ${60 - b} ${83 - a} ${33 + b} 121 ${45 - b}`,
        0.6,
        0.5,
      );
      stroke(`M41 ${58 - b} Q${70 + a} ${67 + b} 107 ${54 - b}`, 0.55, 0.43);
      for (let k = 0; k < 4; k++) {
        const x = 36 + k * 18 + a,
          y = 38 + Math.sin(t + k * 0.7) * 3;
        stroke(`M${x} ${y} l${6 + 3 * Math.sin(t + k)} -2`, 0.7, 0.5);
      }
    } else {
      const a = 10 * Math.sin(t),
        b = 4 * Math.cos(t);
      ctx.fillStyle="rgba(91,57,35,.62)";
      ctx.fill(new Path2D(`M${37+a} ${30+b} Q${52+a} ${25+b} ${65+a} 33 L${62+a} 34 Q${49+a} ${28+b} ${37+a} ${32+b} Z`));
      stroke(
        `M21 40 Q${45 + a} ${18 + b} ${71 + a} 35 M${77 + a} 39 Q${89 + a} 46 112 43`,
        0.95,
        0.65,
      );
      stroke(
        `M13 49 Q${47 + a} ${28 + b} ${81 + a} 46 M${88 + a} 50 L122 50`,
        0.65,
        0.53,
      );
      stroke(
        `M31 57 Q${56 - a} ${44 - b} 98 56 M45 64 Q67 ${55 + b} 89 64`,
        0.5,
        0.4,
      );
    }
    return c;
  });
  banks.set(kind, frames);
  return frames;
}

export default function WaterInk({ map, motion, exploring, selected }) {
  const surface = useRef(null),
    settings = useRef({ motion });
  settings.current.motion = motion;
  const control = useRef(null);
  useEffect(() => {
    control.current?.motionChanged();
  }, [motion]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => control.current?.refresh());
    return () => cancelAnimationFrame(frame);
  }, [exploring, selected]);
  useEffect(() => {
    if (!map) return;
    const canvas = surface.current,
      ctx = canvas.getContext("2d");
    const mask = document.createElement("canvas"),
      maskContext = mask.getContext("2d");
    let disposed = false,
      moving = false,
      request = 0,
      frame = 0,
      scene = null;
    let anchors = [],
      clock = 0,
      lastTime = 0,
      lastPaint = 0;
    const paint = () => {
      if (!scene) return;
      const started = performance.now(),
        dpr = scene.dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, scene.width, scene.height);
      for (const a of anchors) {
        const images = waveBank(a.kind);
        const phase = Math.floor(((clock / a.period + a.phase) % 1) * COUNT);
        ctx.drawImage(
          images[phase],
          a.x - a.width / 2,
          a.y - a.height / 2,
          a.width,
          a.height,
        );
      }
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, scene.width, scene.height);
      ctx.globalCompositeOperation = "source-over";
      if (import.meta.env.DEV) {
        performance.clearMeasures("atlas-water-frame");
        performance.measure("atlas-water-frame", { start: started });
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    const tick = (time) => {
      frame = 0;
      if (
        disposed ||
        moving ||
        document.hidden ||
        !settings.current.motion ||
        !anchors.length
      )
        return;
      if (lastTime) clock += Math.min(80, time - lastTime) / 1000;
      lastTime = time;
      if (time - lastPaint >= 1000 / 24) {
        paint();
        lastPaint = time;
      }
      frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      stop();
      if (
        !moving &&
        !document.hidden &&
        settings.current.motion &&
        anchors.length
      )
        frame = requestAnimationFrame(tick);
    };
    const rebuild = async () => {
      const ticket = ++request;
      const water = await map.getWaterScene();
      if (disposed || moving || ticket !== request) return;
      const camera = map.getPixelFrame(),
        box = map.getContainer().getBoundingClientRect();
      const width = box.width,
        height = box.height,
        dpr = Math.min(devicePixelRatio || 1, 1.5);
      if (
        canvas.width !== Math.round(width * dpr) ||
        canvas.height !== Math.round(height * dpr)
      ) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        mask.width = Math.round(width);
        mask.height = Math.round(height);
      }
      const path = new Path2D();
      for (const polygon of water.geometry)
        for (const ring of polygon) {
          ring.forEach(([x, y], i) => {
            const px = x * camera.scale - camera.x,
              py = y * camera.scale - camera.y;
            if (i === 0) path.moveTo(px, py);
            else path.lineTo(px, py);
          });
          path.closePath();
        }
      maskContext.clearRect(0, 0, width, height);
      maskContext.fillStyle = "#fff";
      maskContext.fill(path);
      const spacing = width < 700 ? 90 : 112;
      const ratio = Math.min(1.05, 2 ** (camera.zoom - Math.floor(camera.zoom)));
      const step = spacing * ratio;
      const reserved = Array.from(
        document.querySelectorAll(
          ".masthead,.map-tools,.living-controls,.selection-ribbon,.landmark > span,.island-inset,.atlas-footer,.place-sheet.sheet-open",
        ),
      )
        .map((n) => n.getBoundingClientRect())
        .filter((r) => r.width && r.height);
      anchors = [];
      for (
        let gx = Math.floor(camera.x / step) - 1;
        gx < Math.ceil((camera.x + width) / step) + 1;
        gx++
      )
        for (
          let gy = Math.floor(camera.y / step) - 1;
          gy < Math.ceil((camera.y + height) / step) + 1;
          gy++
        ) {
          const r = noise(gx, gy),
            x = (gx + 0.25 + r * 0.5) * step - camera.x;
          const y = (gy + 0.2 + noise(gy, gx) * 0.6) * step - camera.y;
          const w = 76 + noise(gx + 7, gy) * 48,
            h = (w * BH) / BW;
          if (x < 25 || x > width - 25 || y < 30 || y > height - 30) continue;
          if (!maskContext.isPointInPath(path, x, y)) continue;
          if (
            reserved.some(
              (b) =>
                x + w / 2 > b.left - box.left - 8 &&
                x - w / 2 < b.right - box.left + 8 &&
                y + h / 2 > b.top - box.top - 8 &&
                y - h / 2 < b.bottom - box.top + 8,
            )
          )
            continue;
          const lng = ((x + camera.x) / camera.scale) * 360 - 180;
          anchors.push({
            x,
            y,
            width: w,
            height: h,
            kind: lng > -80.127 ? (r < 0.75 ? 0 : 2) : r < 0.7 ? 1 : 2,
            period: 4.2 + r * 2.4,
            phase: noise(gx - 3, gy + 8),
          });
        }
      anchors.sort((a, b) => noise(a.x, a.y) - noise(b.x, b.y));
      anchors = anchors.slice(0, width < 700 ? 14 : 32);
      scene = { ...camera, width, height, dpr };
      canvas.style.transform = "none";
      canvas.dataset.groups = anchors.length;
      paint();
      wake();
    };
    const start = () => {
      moving = true;
      ++request;
      stop();
    };
    const position = () => {
      if (!scene) return;
      const p = map.getPixelFrame(),
        ratio = p.scale / scene.scale;
      canvas.style.transform = `translate(${scene.x * ratio - p.x}px,${scene.y * ratio - p.y}px) scale(${ratio})`;
    };
    const end = () => {
      moving = false;
      rebuild();
    };
    const visibility = () => (document.hidden ? stop() : wake());
    control.current = {
      motionChanged: () => {
        paint();
        wake();
      },
      refresh: rebuild,
    };
    map.on("movestart", start);
    map.on("move", position);
    map.on("moveend", end);
    map.on("resize", end);
    document.addEventListener("visibilitychange", visibility);
    rebuild();
    return () => {
      disposed = true;
      ++request;
      stop();
      control.current = null;
      map.off("movestart", start);
      map.off("move", position);
      map.off("moveend", end);
      map.off("resize", end);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [map]);
  return <canvas ref={surface} className="water-ink" aria-hidden="true" />;
}
