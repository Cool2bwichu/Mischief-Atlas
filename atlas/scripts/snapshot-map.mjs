import { mkdir, writeFile, readFile } from "node:fs/promises";
import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";

// A bounded, reproducible public geographic snapshot, not personal location data.
const box = [-80.205, 25.746, -80.105, 25.886];
const xAt = (lng, z) => Math.floor(((lng + 180) / 360) * 2 ** z);
const yAt = (lat, z) =>
  Math.floor(
    ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * 2 ** z,
  );
const meta = await fetch("https://tiles.openfreemap.org/planet").then((r) => {
  if (!r.ok) throw new Error(`Tile metadata ${r.status}`);
  return r.json();
});
const jobs = [];
for (let z = 11; z <= 14; z++) {
  for (let x = xAt(box[0], z); x <= xAt(box[2], z); x++) {
    for (let y = yAt(box[3], z); y <= yAt(box[1], z); y++)
      jobs.push({ z, x, y });
  }
}
const pois = new Map();
const roads = [];
let totalBytes = 0;
let done = 0;
async function take({ z, x, y }) {
  const path = `public/map/${z}/${x}/${y}.pbf`;
  let buffer;
  try {
    buffer = await readFile(path);
  } catch {
    const url = meta.tiles[0]
      .replace("{z}", z)
      .replace("{x}", x)
      .replace("{y}", y);
    const result = await fetch(url);
    if (!result.ok) throw new Error(`Tile ${z}/${x}/${y}: ${result.status}`);
    buffer = Buffer.from(await result.arrayBuffer());
    await mkdir(`public/map/${z}/${x}`, { recursive: true });
    await writeFile(path, buffer);
  }
  totalBytes += buffer.length;
  if (z === 14) {
    const tile = new VectorTile(new PbfReader(buffer));
    for (const type of ["poi", "transportation_name"]) {
      const layer = tile.layers[type];
      for (let i = 0; i < (layer?.length ?? 0); i++) {
        const f = layer.feature(i).toGeoJSON(x, y, z);
        const name = f.properties.name_en || f.properties.name;
        if (!name) continue;
        if (type === "poi") {
          const c = f.geometry.coordinates;
          if (
            f.geometry.type === "Point" &&
            c[0] >= box[0] &&
            c[0] <= box[2] &&
            c[1] >= box[1] &&
            c[1] <= box[3]
          ) {
            pois.set(`${name}:${c[0].toFixed(4)}:${c[1].toFixed(4)}`, {
              name,
              coordinates: c,
              class: f.properties.class,
            });
          }
        } else if (
          /^(Ocean Drive|Collins Avenue|Washington Avenue|Lincoln Road|11th Street|10th Street|5th Street)$/.test(
            name,
          )
        ) {
          const paths =
            f.geometry.type === "MultiLineString"
              ? f.geometry.coordinates
              : [f.geometry.coordinates];
          for (const coordinates of paths) {
            if (
              coordinates.length > 1 &&
              coordinates.every((c) => c[1] > 25.758 && c[1] < 25.799)
            )
              roads.push({ name, coordinates });
          }
        }
      }
    }
  }
  done++;
  if (done % 12 === 0) console.log(`${done}/${jobs.length} tiles`);
}
let next = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (next < jobs.length) await take(jobs[next++]);
  }),
);
await writeFile(
  "public/map/tilejson.json",
  JSON.stringify(
    {
      tilejson: "3.0.0",
      name: "Miami Beach geographic snapshot",
      tiles: ["/map/{z}/{x}/{y}.pbf"],
      minzoom: 11,
      maxzoom: 14,
      bounds: box,
      attribution: meta.attribution,
    },
    null,
    2,
  ),
);
await writeFile(
  "public/map/poi-index.json",
  JSON.stringify([...pois.values()], null, 2),
);
await writeFile("public/map/traffic-paths.json", JSON.stringify(roads));
await writeFile(
  "public/map/SOURCE.json",
  JSON.stringify(
    {
      provider: "OpenFreeMap",
      source: "OpenStreetMap / OpenMapTiles",
      metadataUrl: "https://tiles.openfreemap.org/planet",
      tileTemplate: meta.tiles[0],
      retrievedAt: new Date().toISOString(),
      bounds: box,
      zooms: [11, 12, 13, 14],
      tileCount: jobs.length,
      bytes: totalBytes,
      license: "OpenStreetMap data © contributors, ODbL 1.0",
      licenseUrl: "https://www.openstreetmap.org/copyright",
    },
    null,
    2,
  ),
);
// Canvas draws labels with the bundled IM Fell web font; no remote glyph service.
console.log(
  JSON.stringify({
    tiles: jobs.length,
    MB: (totalBytes / 1e6).toFixed(2),
    pois: pois.size,
    trafficSegments: roads.length,
  }),
);
