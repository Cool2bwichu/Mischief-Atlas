// Original cartographic marks. Fills and fine strokes are authored separately so
// a deliberate reveal can establish pigment before the finer engraving resolves.
export function drawNatureInk(ctx, kind, part = "both", variant = 0) {
  const fill = part !== "lines",
    lines = part !== "mass";
  ctx.save();
  ctx.fillStyle = "#65402d";
  ctx.strokeStyle = "#79543a";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 0.7;
  if (kind === "palm") {
    if (fill) {
      for (const d of [
        "M39 59 Q45 38 41 20 L44 19 Q49 39 42 60 Z",
        "M42 21 Q29 9 17 20 Q29 16 42 24 Z",
        "M42 20 Q53 8 66 20 Q53 15 43 24 Z",
        "M42 20 Q32 3 26 7 Q37 12 42 23 Z",
        "M43 21 Q49 4 58 9 Q48 11 44 24 Z",
        "M43 22 Q60 19 65 35 Q54 26 43 25 Z",
        "M40 23 Q25 21 21 36 Q29 29 42 25 Z",
        "M24 62 Q34 58 44 60 L52 62 Q37 61 24 63 Z",
      ])
        ctx.fill(new Path2D(d));
    }
    if (lines) {
      for (const d of [
        "M15 22 Q27 10 41 22 Q36 12 27 8 M43 22 Q52 8 68 22 M44 23 Q61 21 68 38",
        "M40 24 Q23 22 17 39 M43 22 Q43 9 50 5 M42 24 Q34 29 33 41",
        "M39 31 L45 29 M39 36 L46 34 M40 42 L46 40 M39 48 L44 47 M38 54 L44 53",
        "M19 25 L17 29 M23 22 L21 27 M28 20 L27 25 M32 20 L32 24",
        "M51 18 L53 23 M56 17 L60 21 M60 18 L64 23 M51 26 L51 31 M56 28 L57 34 M61 31 L61 37",
        "M18 65 Q37 61 56 65 M29 68 L37 67 M46 68 L60 67 M23 57 L21 53 M27 57 L29 52",
      ])
        ctx.stroke(new Path2D(d));
    }
  } else if (kind === "wave" && variant === 1) {
    if (fill) ctx.fill(new Path2D("M9 39 Q35 43 59 34 L57 36 Q34 46 9 41 Z"));
    if (lines) {
      for (const d of [
        "M3 35 Q28 43 66 30",
        "M21 48 Q40 49 59 42",
        "M59 35 L67 33 M64 39 L72 37 M68 43 L75 41",
      ])
        ctx.stroke(new Path2D(d));
    }
  } else if (kind === "wave" && variant === 2) {
    if (fill)
      ctx.fill(
        new Path2D(
          "M21 42 Q35 37 42 27 Q48 21 55 27 Q47 24 44 31 Q34 42 21 44 Z",
        ),
      );
    if (lines) {
      for (const d of [
        "M9 43 Q23 44 33 34 M37 30 Q45 18 56 26 Q64 34 54 36",
        "M15 49 Q35 49 46 39 M51 44 L63 41",
      ])
        ctx.stroke(new Path2D(d));
    }
  } else if (kind === "wave") {
    if (fill) {
      ctx.fill(
        new Path2D(
          "M10 31 Q24 34 32 23 Q37 16 43 20 Q36 19 35 25 Q31 33 20 33 Z",
        ),
      );
      ctx.fill(
        new Path2D(
          "M39 44 Q52 46 59 39 Q65 34 69 37 Q63 36 61 40 Q54 47 43 46 Z",
        ),
      );
    }
    if (lines) {
      for (const d of [
        "M5 28 Q19 33 29 23 Q36 13 45 20 Q49 25 42 26 Q39 25 41 22",
        "M12 37 Q25 41 38 30 M30 42 Q45 48 56 39 Q64 30 72 38",
        "M38 51 Q53 53 67 45 M3 41 L13 42 M61 28 Q67 31 77 28",
      ])
        ctx.stroke(new Path2D(d));
    }
  } else if (kind === "sand") {
    if (fill) {
      for (const [x, y, r] of [
        [18, 32, 1.1],
        [35, 41, 0.9],
        [51, 28, 1.2],
        [60, 44, 0.7],
      ]) {
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.65, -0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (lines) {
      for (const [x, y] of [
        [12, 39],
        [21, 43],
        [27, 28],
        [31, 36],
        [40, 31],
        [43, 45],
        [54, 37],
        [62, 31],
      ]) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 3, y - 1);
        ctx.stroke();
      }
    }
  } else {
    if (fill) {
      for (const d of [
        "M13 49 Q30 40 48 47 Q57 51 66 46 Q57 54 46 49 Q30 43 13 51 Z",
        "M21 46 Q9 43 9 32 Q19 34 21 46 Z",
        "M24 44 Q25 30 37 26 Q35 37 24 44 Z",
        "M29 45 Q42 34 49 38 Q41 46 29 47 Z",
      ])
        ctx.fill(new Path2D(d));
    }
    if (lines) {
      for (const d of [
        "M5 55 Q23 42 43 48 Q63 58 74 45 Q79 37 71 36 Q64 37 67 42",
        "M17 50 Q8 44 6 33 M23 43 Q26 27 38 23 M30 43 Q39 32 50 37",
        "M13 38 L18 44 M29 35 L28 40 M35 42 L42 39 M25 53 Q35 50 43 54 M48 57 L56 58",
      ])
        ctx.stroke(new Path2D(d));
    }
  }
  ctx.restore();
}

const mercator = ([lng, lat], z) => {
  const scale = 256 * 2 ** z,
    sin = Math.sin((lat * Math.PI) / 180);
  return [
    ((lng + 180) / 360) * scale,
    (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  ];
};

// One authored coastal composition, not a repeated wallpaper. Every mark is
// checked against the actual polygon at the current scale and clipped to it.
const compositions = [
  ["wave", [-80.121, 25.7827], 0.72, -0.12],
  ["wave", [-80.1241, 25.775], 0.58, 0.1, 1],
  ["wave", [-80.1206, 25.7901], 0.48, -0.08, 2],
  ["sand", [-80.1276, 25.7816], 0.65, -0.32],
  ["sand", [-80.1294, 25.7773], 0.65, -0.2],
  ["sand", [-80.1285, 25.7791], 0.5, -0.24],
  ["palm", [-80.13, 25.7808], 0.52, -0.08],
  ["palm", [-80.1313, 25.7776], 0.45, 0.1],
  ["palm", [-80.1287, 25.7834], 0.42, -0.06],
];

export function drawCoastalNature(ctx, coords, polygons) {
  if (coords.z < 14) return;
  for (const [kind, coordinates, size, angle, variant] of compositions) {
    const world = mercator(coordinates, coords.z);
    const x = world[0] - coords.x * 256,
      y = world[1] - coords.y * 256;
    const scale = size * Math.min(1.65, 2 ** ((coords.z - 15) * 0.4));
    if (x < -70 || x > 326 || y < -70 || y > 326) continue;
    const shapes = polygons[kind] || [];
    const dpr = ctx.getTransform().a;
    const shape = shapes.find((p) =>
      ctx.isPointInPath(p, x * dpr, y * dpr, "evenodd"),
    );
    if (!shape) continue;
    ctx.save();
    ctx.clip(shape, "evenodd");
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.translate(-40, -40);
    drawNatureInk(ctx, kind, "both", variant);
    ctx.restore();
  }
}

export function hasCoastalNature(coords) {
  return (
    coords.z >= 14 &&
    compositions.some(([, coordinates]) => {
      const [x, y] = mercator(coordinates, coords.z);
      return (
        x >= coords.x * 256 - 70 &&
        x <= coords.x * 256 + 326 &&
        y >= coords.y * 256 - 70 &&
        y <= coords.y * 256 + 326
      );
    })
  );
}
