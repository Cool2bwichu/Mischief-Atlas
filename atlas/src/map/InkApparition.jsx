import { useLayoutEffect, useRef } from "react";
import { drawNatureInk } from "./nature-ink.js";

const W = 128,
  H = 96,
  MW = 96,
  MH = 72,
  STEPS = 24;
const banks = new Map(); // Three shared authored motifs, never one bank per place.
const clamp = (x) => Math.max(0, Math.min(1, x));
function canvas(w, h) {
  const node = document.createElement("canvas");
  node.width = w;
  node.height = h;
  return node;
}

function prepare(kind) {
  if (banks.has(kind)) return banks.get(kind);
  const sources = ["mass", "lines"].map((part) => {
    const node = canvas(W * 1.5, H * 1.5),
      ctx = node.getContext("2d");
    ctx.scale(2.4, 2.05);
    drawNatureInk(ctx, kind, part);
    return node;
  });
  const masks = [[], []];
  // Origins follow the authored trunk/crests/ornamental accents. The line field
  // has its own overlapping timing, so the dense mass resolves before hatching.
  const origins =
    kind === "palm"
      ? [
          [0.51, 0.3],
          [0.53, 0.69],
          [0.28, 0.25],
        ]
      : kind === "wave"
        ? [
            [0.35, 0.36],
            [0.73, 0.53],
            [0.15, 0.43],
          ]
        : [
            [0.18, 0.44],
            [0.5, 0.53],
            [0.81, 0.46],
          ];
  for (let layer = 0; layer < 2; layer++) {
    const field = new Float32Array(MW * MH);
    for (let y = 0; y < MH; y++)
      for (let x = 0; x < MW; x++) {
        const u = x / MW,
          v = y / MH;
        const distance = Math.min(
          ...origins.map(([ox, oy]) => Math.hypot((u - ox) * 1.1, v - oy)),
        );
        const grain =
          Math.sin(x * 0.27 + Math.sin(y * 0.23) * 2) * 0.028 +
          Math.cos(y * 0.43 - x * 0.19) * 0.021 +
          Math.sin(x * 1.9 + y * 1.7) * 0.007;
        field[y * MW + x] =
          layer === 0
            ? clamp(0.045 + distance * 1.25 + grain) * 0.72
            : clamp(
                0.16 +
                  distance * 1.25 +
                  (Math.sin(u * 12 + v * 4) + 1) * 0.13 +
                  grain,
              ) *
                0.83 +
              0.08;
      }
    for (let i = 0; i <= STEPS; i++) {
      const mask = canvas(MW, MH),
        ctx = mask.getContext("2d"),
        data = ctx.createImageData(MW, MH);
      for (let p = 0; p < field.length; p++) {
        data.data[p * 4 + 3] =
          i === 0
            ? 0
            : i === STEPS
              ? 255
              : Math.round(clamp((i / STEPS - field[p]) / 0.045) * 255);
      }
      ctx.putImageData(data, 0, 0);
      masks[layer].push(mask);
    }
  }
  const full = canvas(W * 1.5, H * 1.5);
  const ctx = full.getContext("2d");
  sources.forEach((source) => ctx.drawImage(source, 0, 0));
  const bank = { sources, masks, full, url: full.toDataURL() };
  banks.set(kind, bank);
  return bank;
}

function paint(item) {
  const { node, buffer, bank, progress } = item;
  const ctx = node.getContext("2d"),
    ink = buffer.getContext("2d");
  ctx.clearRect(0, 0, node.width, node.height);
  if (progress === 1) {
    ctx.drawImage(bank.full, 0, 0);
    return;
  }
  const frame = progress * STEPS,
    lower = Math.floor(frame),
    mix = frame - lower;
  for (let layer = 0; layer < 2; layer++) {
    ink.globalCompositeOperation = "source-over";
    ink.clearRect(0, 0, buffer.width, buffer.height);
    // Add neighboring alpha masks, then color only their existing ink pixels.
    ink.globalAlpha = 1 - mix;
    ink.drawImage(bank.masks[layer][lower], 0, 0, buffer.width, buffer.height);
    if (mix > 0 && lower < STEPS) {
      ink.globalCompositeOperation = "lighter";
      ink.globalAlpha = mix;
      ink.drawImage(
        bank.masks[layer][lower + 1],
        0,
        0,
        buffer.width,
        buffer.height,
      );
    }
    ink.globalAlpha = 1;
    ink.globalCompositeOperation = "source-in";
    ink.drawImage(bank.sources[layer], 0, 0);
    ctx.drawImage(buffer, 0, 0);
  }
}

// This layer persists independently of culled marker buttons. A token describes
// an intentional action; neither camera updates nor component mounts create one.
export default function InkApparition({
  map,
  markers,
  anchor,
  selected,
  event,
  motion,
}) {
  const root = useRef(null),
    engine = useRef(null);
  useLayoutEffect(() => {
    if (!map) return;
    let items = [],
      frame = 0,
      previousTime = 0,
      sequence = 0,
      moving = false;
    let current = { anchor: null, event: null, motion: false },
      logicalId = null;
    const remove = (item) => {
      markers.current.delete(`apparition-${item.id}`);
      item.wrapper.remove();
      items = items.filter((i) => i !== item);
    };
    const position = (item) => {
      const p = map.project(item.coordinates);
      item.wrapper.style.left = `${p.x + item.offset.x}px`;
      item.wrapper.style.top = `${p.y + item.offset.y}px`;
      markers.current.set(`apparition-${item.id}`, {
        node: item.wrapper,
        coordinates: item.coordinates,
        offset: item.offset,
      });
    };
    const display = (item) => {
      paint(item);
      const complete = item.progress === 1;
      item.node.hidden = complete;
      item.still.hidden = !complete;
      item.wrapper.dataset.phase = complete
        ? "present"
        : item.target
          ? "entering"
          : "exiting";
      item.wrapper.dataset.progress = item.progress.toFixed(3);
    };
    const settle = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      for (const item of [...items]) {
        if (!item.target) remove(item);
        else {
          item.progress = 1;
          display(item);
        }
      }
    };
    const tick = (time) => {
      const started = performance.now();
      frame = 0;
      const dt = previousTime ? Math.min(80, time - previousTime) : 16;
      previousTime = time;
      let unfinished = false;
      for (const item of [...items]) {
        if (item.progress === item.target) continue;
        item.progress = clamp(
          item.progress + (item.target ? dt / 620 : -dt / 360),
        );
        if (!item.progress && !item.target) {
          remove(item);
          continue;
        }
        display(item);
        unfinished ||= item.progress !== item.target;
      }
      if (unfinished) frame = requestAnimationFrame(tick);
      else previousTime = 0;
      if (import.meta.env.DEV)
        performance.measure("atlas-ink-frame", { start: started });
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const update = (next) => {
      current = next;
      const { anchor, event, motion } = next;
      // The ribbon is measured in its own layout effect. A missing measurement
      // during A → B is not a deselection; keep A's immutable ink until B is ready.
      if (next.selected && !anchor) return;
      const intentional =
        !!event && event.sequence > sequence && event.placeId === anchor?.id;
      // A search/creation flight may finish before its small flourish starts.
      // Manual exploration clears the semantic selection and cancels this token.
      if (moving) {
        for (const item of [...items]) if (item.id !== anchor?.id) remove(item);
        return;
      }
      if (event && event.placeId === anchor?.id)
        sequence = Math.max(sequence, event.sequence);
      const switching = logicalId !== anchor?.id;
      logicalId = anchor?.id;
      let active = items.find((item) => item.id === anchor?.id);
      for (const item of [...items]) {
        if (item === active) continue;
        if (!item.target && switching) remove(item);
        else item.target = 0;
      }
      if (anchor) {
        if (!active) {
          const kind =
            anchor.kind === "Park" || anchor.kind === "Garden"
              ? "palm"
              : anchor.id === "pier"
                ? "wave"
                : "flourish";
          const bank = prepare(kind),
            wrapper = document.createElement("span");
          wrapper.className = "ink-apparition";
          wrapper.dataset.place = anchor.id;
          const node = canvas(W * 1.5, H * 1.5),
            still = new Image();
          still.src = bank.url;
          still.alt = "";
          wrapper.append(node, still);
          root.current.append(wrapper);
          active = {
            id: anchor.id,
            bank,
            wrapper,
            node,
            still,
            buffer: canvas(W * 1.5, H * 1.5),
            progress: intentional && motion && !document.hidden ? 0 : 1,
            target: 1,
          };
          items.push(active);
        }
        active.target = 1;
        active.coordinates = anchor.coordinates;
        active.offset = {
          x: anchor.x - W / 2,
          y: anchor.y + anchor.height - 26,
        };
        position(active);
        display(active);
      }
      if (!motion || document.hidden) settle();
      else wake();
    };
    const start = () => {
      moving = true;
      settle();
    };
    const end = () => {
      moving = false;
      update(current);
    };
    const visibility = () => {
      if (document.hidden) settle();
    };
    map.on("movestart", start);
    map.on("moveend", end);
    document.addEventListener("visibilitychange", visibility);
    engine.current = { update };
    return () => {
      cancelAnimationFrame(frame);
      map.off("movestart", start);
      map.off("moveend", end);
      document.removeEventListener("visibilitychange", visibility);
      for (const item of [...items]) remove(item);
      engine.current = null;
    };
  }, [map, markers]);
  useLayoutEffect(() => {
    engine.current?.update({ anchor, selected, event, motion });
  }, [map, anchor, selected, event, motion]);
  return <div ref={root} aria-hidden="true" className="apparition-layer" />;
}
