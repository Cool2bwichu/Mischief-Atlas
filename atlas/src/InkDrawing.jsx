import { useEffect, useRef, useState } from "react";

const prepared = new Map(),
  STEPS = 48,
  MW = 128,
  MH = 80;
const clamp = (n) => Math.max(0, Math.min(1, n));
const surface = (w, h) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

async function prepareDrawing(src) {
  if (prepared.has(src)) return prepared.get(src);
  const task = (async () => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const scale = Math.min(1, 640 / img.naturalWidth, 420 / img.naturalHeight);
    const w = Math.round(img.naturalWidth * scale),
      h = Math.round(img.naturalHeight * scale);
    const original = surface(w, h),
      ctx = original.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    const pixels = ctx.getImageData(0, 0, w, h),
      full = ctx.createImageData(w, h);
    const coverage = new Float32Array(w * h),
      cells = Array.from({ length: 12 }, () => ({ weight: 0, x: 0, y: 0 }));
    for (let i = 0; i < w * h; i++) {
      const j = i * 4,
        a =
          1 -
          Math.min(pixels.data[j], pixels.data[j + 1], pixels.data[j + 2]) /
            255;
      coverage[i] = a;
      full.data[j + 3] = Math.round(a * 255);
      for (let k = 0; k < 3; k++)
        full.data[j + k] = a
          ? Math.round(((pixels.data[j + k] / 255 - 1 + a) / a) * 255)
          : 0;
      const x = i % w,
        y = Math.floor(i / w),
        cell =
          cells[
            Math.min(2, Math.floor((y / h) * 3)) * 4 +
              Math.min(3, Math.floor((x / w) * 4))
          ];
      const weight = a * a;
      cell.weight += weight;
      cell.x += (x / w) * weight;
      cell.y += (y / h) * weight;
    }
    const seeds = [];
    for (const c of cells.sort((a, b) => b.weight - a.weight)) {
      if (!c.weight) continue;
      const p = [c.x / c.weight, c.y / c.weight];
      if (seeds.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.22))
        seeds.push(p);
      if (seeds.length === 3) break;
    }
    if (!seeds.length) seeds.push([0.5, 0.5]);
    const mass = ctx.createImageData(w, h),
      lines = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x,
          j = i * 4;
        let density = 0,
          count = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (x + dx < 0 || x + dx >= w || y + dy < 0 || y + dy >= h)
              continue;
            density += coverage[(y + dy) * w + x + dx];
            count++;
          }
        const strength = clamp((density / count - 0.2) / 0.5);
        for (let k = 0; k < 3; k++) {
          mass.data[j + k] = full.data[j + k];
          lines.data[j + k] = full.data[j + k];
        }
        mass.data[j + 3] = Math.round(full.data[j + 3] * strength);
        lines.data[j + 3] = full.data[j + 3] - mass.data[j + 3];
      }
    const sources = [mass, lines].map((data) => {
      const c = surface(w, h);
      c.getContext("2d").putImageData(data, 0, 0);
      return c;
    });
    const ink = surface(w, h);
    ink.getContext("2d").putImageData(full, 0, 0);
    const field = new Float32Array(MW * MH);
    for (let y = 0; y < MH; y++)
      for (let x = 0; x < MW; x++) {
        const u = x / MW,
          v = y / MH;
        const d = Math.min(
          ...seeds.map(([sx, sy]) =>
            Math.hypot((u - sx) * 1.2, (v - sy) * 0.85),
          ),
        );
        const blot =
          Math.sin(x * 0.19 + Math.sin(y * 0.21) * 2) * 0.055 +
          Math.sin(y * 0.31 - x * 0.13) * 0.035 +
          Math.sin(x * 0.83 + y * 0.77) * 0.009;
        field[y * MW + x] = clamp(0.025 + d * 1.5 + blot);
      }
    const masks = [0, 1].map((layer) =>
      Array.from({ length: STEPS + 1 }, (_, step) => {
        const c = surface(MW, MH),
          cx = c.getContext("2d"),
          data = cx.createImageData(MW, MH);
        for (let p = 0; p < field.length; p++) {
          const threshold = layer ? 0.14 + field[p] * 0.85 : field[p] * 0.76;
          data.data[p * 4 + 3] =
            step === 0
              ? 0
              : step === STEPS
                ? 255
                : Math.round(clamp((step / STEPS - threshold) / 0.04) * 255);
        }
        cx.putImageData(data, 0, 0);
        return c;
      }),
    );
    return { w, h, ink, sources, masks };
  })();
  prepared.set(src, task);
  while (prepared.size > 3) prepared.delete(prepared.keys().next().value);
  try {
    return await task;
  } catch (e) {
    prepared.delete(src);
    throw e;
  }
}

export default function InkDrawing({ src, alt, open, motion }) {
  const canvas = useRef(null),
    state = useRef({ progress: 0, target: open ? 1 : 0, motion });
  const [art, setArt] = useState(null),
    [fallback, setFallback] = useState(false);
  const wake = useRef(() => {});
  useEffect(() => {
    let live = true;
    prepareDrawing(src).then(
      (value) => {
        if (live) setArt(value);
      },
      () => {
        if (live) setFallback(true);
      },
    );
    return () => {
      live = false;
    };
  }, [src]);
  useEffect(() => {
    state.current.target = open ? 1 : 0;
    state.current.motion = motion;
    wake.current();
  }, [open, motion]);
  useEffect(() => {
    if (!art) return;
    const node = canvas.current,
      ctx = node.getContext("2d"),
      buffer = surface(art.w, art.h),
      ink = buffer.getContext("2d");
    node.width = art.w;
    node.height = art.h;
    let frame = 0,
      previous = 0;
    const paint = () => {
      const start = performance.now(),
        p = state.current.progress;
      ctx.clearRect(0, 0, art.w, art.h);
      if (p === 1) ctx.drawImage(art.ink, 0, 0);
      else if (p > 0) {
        const position = p * STEPS,
          low = Math.floor(position),
          mix = position - low;
        for (let layer = 0; layer < 2; layer++) {
          ink.clearRect(0, 0, art.w, art.h);
          ink.globalCompositeOperation = "source-over";
          ink.globalAlpha = 1 - mix;
          ink.drawImage(art.masks[layer][low], 0, 0, art.w, art.h);
          if (mix && low < STEPS) {
            ink.globalCompositeOperation = "lighter";
            ink.globalAlpha = mix;
            ink.drawImage(art.masks[layer][low + 1], 0, 0, art.w, art.h);
          }
          ink.globalAlpha = 1;
          ink.globalCompositeOperation = "source-in";
          ink.drawImage(art.sources[layer], 0, 0);
          ctx.globalCompositeOperation = "lighter";
          ctx.drawImage(buffer, 0, 0);
        }
        ctx.globalCompositeOperation = "source-over";
      }
      node.dataset.progress = p.toFixed(3);
      node.dataset.phase =
        p === 1
          ? "present"
          : p === 0
            ? "absent"
            : state.current.target
              ? "gathering"
              : "dissolving";
      if (import.meta.env.DEV) {
        performance.clearMeasures("atlas-drawing-frame");
        performance.measure("atlas-drawing-frame", { start });
      }
    };
    const tick = (time) => {
      frame = 0;
      const s = state.current,
        dt = previous ? Math.min(80, time - previous) : 16;
      previous = time;
      s.progress =
        s.motion && !document.hidden
          ? clamp(s.progress + (s.target ? dt / 1100 : -dt / 680))
          : s.target;
      paint();
      if (s.progress !== s.target) frame = requestAnimationFrame(tick);
      else previous = 0;
    };
    wake.current = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (!state.current.motion || document.hidden) {
        state.current.progress = state.current.target;
        paint();
      } else if (state.current.progress !== state.current.target)
        frame = requestAnimationFrame(tick);
      else paint();
    };
    const visibility = () => wake.current();
    document.addEventListener("visibilitychange", visibility);
    wake.current();
    return () => {
      cancelAnimationFrame(frame);
      wake.current = () => {};
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [art]);
  return (
    <span className={`ink-drawing ${fallback ? "ink-fallback" : ""}`}>
      <img src={src} alt={alt} draggable="false" />
      <canvas ref={canvas} aria-hidden="true" />
    </span>
  );
}
