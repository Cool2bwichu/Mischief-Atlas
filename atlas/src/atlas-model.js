import { personalArt } from "./data/personal-art.js";

export function normalizeName(value) {
  const name = String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
  if (!name) throw new Error("Give this place a name.");
  if (name.length > 60) throw new Error("Keep the name to 60 characters.");
  return name;
}

export function pointAlongPath(path, progress) {
  return pointAlongPreparedPath(preparePath(path), progress);
}

export function preparePath(path) {
  if (!path.length) throw new Error("A path needs a point.");
  let total = 0;
  const distances = [0];
  path.slice(1).forEach((p, i) => {
    const d = Math.hypot(p[0] - path[i][0], p[1] - path[i][1]);
    total += d;
    distances.push(total);
  });
  return { path, distances, length: total };
}

export function pointAlongPreparedPath(
  { path, distances, length: total },
  progress,
) {
  if (!total) return { point: [...path[0]], angle: 0 };
  const target = Math.max(0, Math.min(1, progress)) * total;
  let lo = 1,
    hi = distances.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (distances[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  const a = path[lo - 1],
    b = path[lo],
    d = distances[lo] - distances[lo - 1];
  const t = d ? (target - distances[lo - 1]) / d : 0;
  return {
    point: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
    angle: Math.atan2(b[1] - a[1], b[0] - a[0]),
  };
}

const traffic = {
  quiet: { density: 1, speed: 24, label: "A quiet morning" },
  steady: { density: 2, speed: 17, label: "The city stirring" },
  busy: { density: 3, speed: 8, label: "A crowded evening" },
};
export const trafficSettings = (preset) => traffic[preset] || traffic.steady;

export function parseSavedAtlas(text) {
  const empty = { aliases: {}, rooms: {}, personalLandmarks: [] };
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
    if (Array.isArray(input.personalLandmarks)) {
      const ids = new Set();
      for (const p of input.personalLandmarks) {
        if (
          !object(p) ||
          typeof p.id !== "string" ||
          !/^personal-[a-z0-9-]{1,80}$/.test(p.id) ||
          ids.has(p.id)
        )
          continue;
        try {
          if (typeof p.name !== "string") continue;
          const place = createPersonalLandmark(
            p.name,
            p.coordinates,
            p.art,
            p.id,
          );
          empty.personalLandmarks.push(place);
          ids.add(place.id);
        } catch {
          /* Recover valid places even if another record is damaged. */
        }
      }
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

export function validMapCoordinates(coordinates) {
  return (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every(Number.isFinite) &&
    coordinates[0] >= -80.205 &&
    coordinates[0] <= -80.105 &&
    coordinates[1] >= 25.746 &&
    coordinates[1] <= 25.886
  );
}

export function createPersonalLandmark(
  name,
  coordinates,
  art = "cottage",
  id = `personal-${crypto.randomUUID()}`,
) {
  if (!validMapCoordinates(coordinates))
    throw new Error("Choose a location within the Miami Beach map.");
  return {
    id,
    name: normalizeName(name),
    coordinates: [...coordinates],
    art: personalArt.some((a) => a.id === art) ? art : "cottage",
    source: "personal",
    kind: "Personal landmark",
    priority: 1,
    subtitle: "A place you have made your own.",
  };
}
