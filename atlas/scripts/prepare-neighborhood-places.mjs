import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { landmarks } from "../src/data/landmarks.js";

// Derive public place anchors only from the committed geographic snapshot.
// Rerunning this script does not fetch new data or imply current business status.
const source = JSON.parse(
  await readFile(new URL("../public/map/poi-index.json", import.meta.url)),
);
const kinds = {
  park: ["Park", 14.2],
  garden: ["Garden", 14.2],
  museum: ["Museum", 14.2],
  library: ["Library", 14.3],
  theatre: ["Theatre", 14.3],
  cinema: ["Cinema", 14.6],
  monument: ["Memorial", 14.3],
  art_gallery: ["Gallery", 14.6],
  harbor: ["Harbor", 14.2],
  school: ["School", 15.2],
  cafe: ["Café", 14.8],
  bakery: ["Bakery", 15],
  lodging: ["Hotel", 15.2],
  restaurant: ["Restaurant", 15.5],
  bar: ["Bar", 15.7],
  ice_cream: ["Ice cream", 15.7],
  grocery: ["Market", 15.5],
  playground: ["Playground", 15],
};
const normalize = (name) =>
  name
    .toLowerCase()
    .replace(/^the /, "")
    .replace(/[^a-z0-9]/g, "");
const near = (a, b, distance) =>
  Math.hypot((a[0] - b[0]) * 0.9, a[1] - b[1]) < distance;
const result = [];
for (const p of source) {
  const [lng, lat] = p.coordinates;
  if (
    !kinds[p.class] ||
    lng < -80.15 ||
    lat < 25.76 ||
    lat > 25.879 ||
    p.name.length > 90
  )
    continue;
  if (
    landmarks.some(
      (l) =>
        normalize(l.name) === normalize(p.name) ||
        near(l.coordinates, p.coordinates, 0.0003),
    )
  )
    continue;
  if (
    result.some(
      (l) =>
        normalize(l.name) === normalize(p.name) &&
        near(l.coordinates, p.coordinates, 0.0008),
    )
  )
    continue;
  const [kind, minZoom] = kinds[p.class];
  const id =
    "osm-" +
    createHash("sha256")
      .update(`${p.name}:${p.coordinates.map((c) => c.toFixed(5)).join(",")}`)
      .digest("hex")
      .slice(0, 14);
  result.push({
    id,
    name: p.name,
    coordinates: p.coordinates,
    kind,
    minZoom,
    priority: 5,
    source: "snapshot",
    sourceClass: p.class,
    subtitle: "A small part of the city. A place of your own to keep.",
  });
}
result.sort((a, b) => a.minZoom - b.minZoom || a.id.localeCompare(b.id));
await writeFile(
  new URL("../src/data/neighborhood-places.json", import.meta.url),
  JSON.stringify(result),
);
console.log(
  `${result.length} additional public places derived from the bundled OSM snapshot.`,
);
