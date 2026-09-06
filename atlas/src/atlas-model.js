export function normalizeName(value) {
  const name = String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
  if (!name) throw new Error("Give this place a name.");
  if (name.length > 60) throw new Error("Keep the name to 60 characters.");
  return name;
}

export function pointAlongPath(path, progress) {
  if (!path.length) throw new Error("A path needs a point.");
  let total = 0;
  const lengths = path.slice(1).map((p, i) => {
    const d = Math.hypot(p[0] - path[i][0], p[1] - path[i][1]);
    total += d;
    return d;
  });
  if (!total) return { point: [...path[0]], angle: 0 };
  let target = Math.max(0, Math.min(1, progress)) * total;
  for (let i = 0; i < lengths.length; i++) {
    const d = lengths[i];
    if (target <= d || i === lengths.length - 1) {
      const a = path[i],
        b = path[i + 1],
        t = d ? target / d : 0;
      return {
        point: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
        angle: Math.atan2(b[1] - a[1], b[0] - a[0]),
      };
    }
    target -= d;
  }
}

const traffic = {
  quiet: { density: 1, speed: 24, label: "A quiet morning" },
  steady: { density: 2, speed: 17, label: "The city stirring" },
  busy: { density: 3, speed: 8, label: "A crowded evening" },
};
export const trafficSettings = (preset) => traffic[preset] || traffic.steady;

export function parseSavedAtlas(text) {
  const empty = { aliases: {}, rooms: {} };
  try {
    const input = JSON.parse(text);
    const object = (x) => x && typeof x === "object" && !Array.isArray(x);
    if (!object(input)) return empty;
    if (object(input.aliases))
      for (const [id, name] of Object.entries(input.aliases)) {
        if (
          typeof name === "string" &&
          name.trim() &&
          name.length <= 60 &&
          !["__proto__", "constructor", "prototype"].includes(id)
        )
          empty.aliases[id] = name;
      }
    if (object(input.rooms))
      for (const [id, rooms] of Object.entries(input.rooms)) {
        if (
          Array.isArray(rooms) &&
          !["__proto__", "constructor", "prototype"].includes(id)
        )
          empty.rooms[id] = rooms
            .filter(
              (r) =>
                object(r) &&
                typeof r.id === "string" &&
                typeof r.name === "string" &&
                r.name.trim() &&
                r.name.length <= 60,
            )
            .slice(0, 30)
            .map((r) => ({ id: r.id, name: r.name }));
      }
    return empty;
  } catch {
    return empty;
  }
}

export function createRoom(name, existing) {
  let n = 1;
  while (existing.some((r) => r.id === `room-${n}`)) n++;
  return { id: `room-${n}`, name: normalizeName(name) };
}
