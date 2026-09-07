import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeName,
  pointAlongPath,
  trafficSettings,
  parseSavedAtlas,
  createRoom,
  createPersonalLandmark,
  validMapCoordinates,
} from "../src/atlas-model.js";
import { suggestPersonalArt } from "../src/data/personal-art.js";
import { readFileSync } from "node:fs";

test("names preserve meaning, normalize spacing and reject empty input", () => {
  assert.equal(normalizeName("  Film  Library  "), "Film Library");
  assert.equal(normalizeName("Española Way"), "Española Way");
  assert.throws(() => normalizeName(" \n "));
  assert.throws(() => normalizeName("a".repeat(61)));
});
test("footsteps follow polyline corners and exact endpoints", () => {
  const path = [
    [0, 0],
    [1, 0],
    [1, 1],
  ];
  assert.deepEqual(pointAlongPath(path, 0).point, [0, 0]);
  assert.deepEqual(pointAlongPath(path, 1).point, [1, 1]);
  assert.deepEqual(pointAlongPath(path, 0.75).point, [1, 0.5]);
  assert.deepEqual(
    pointAlongPath(
      [
        [3, 4],
        [3, 4],
      ],
      0.5,
    ).point,
    [3, 4],
  );
  assert.throws(() => pointAlongPath([], 0));
});
test("congestion independently changes trail density and motion speed", () => {
  const quiet = trafficSettings("quiet");
  const busy = trafficSettings("busy");
  assert.ok(busy.density > quiet.density);
  assert.ok(busy.speed < quiet.speed);
  assert.deepEqual(trafficSettings("unknown"), trafficSettings("steady"));
});
test("malformed or hostile browser storage cannot break the atlas", () => {
  assert.deepEqual(parseSavedAtlas("broken"), {
    aliases: {},
    rooms: {},
    personalLandmarks: [],
  });
  assert.deepEqual(parseSavedAtlas('{"aliases":null,"rooms":[]}'), {
    aliases: {},
    rooms: {},
    personalLandmarks: [],
  });
  const s = parseSavedAtlas(
    '{"aliases":{"ocean":"Cinema","bad":12},"rooms":{"ocean":[{"id":"a","name":"Films"},null]}}',
  );
  assert.deepEqual(s.aliases, { ocean: "Cinema" });
  assert.deepEqual(s.rooms.ocean, [{ id: "a", name: "Films" }]);
});

test("personal landmarks survive reload alongside legacy aliases and rooms", () => {
  const legacy = {
    aliases: { "ocean-drive": "Films" },
    rooms: { "ocean-drive": [{ id: "room-1", name: "Classics" }] },
  };
  const migrated = parseSavedAtlas(JSON.stringify(legacy));
  assert.deepEqual(migrated, { ...legacy, personalLandmarks: [] });
  const first = createPersonalLandmark(
    "  Sample   home ",
    [-80.132, 25.781],
    "townhouse",
  );
  const second = createPersonalLandmark(
    "Sample home",
    [-80.132, 25.781],
    "bookshop",
  );
  assert.notEqual(first.id, second.id);
  const next = { ...migrated, personalLandmarks: [first, second] };
  assert.deepEqual(parseSavedAtlas(JSON.stringify(next)), next);
  assert.equal(first.name, "Sample home");
  assert.equal(first.art, "townhouse");
  assert.equal(suggestPersonalArt([first, second]), "cottage");
});

test("bad personal records are isolated without losing valid data", () => {
  const good = createPersonalLandmark(
    "Sample garden",
    [-80.13, 25.79],
    "pavilion",
  );
  const input = {
    aliases: { "ocean-drive": "Stories" },
    personalLandmarks: [
      null,
      good,
      good,
      { ...good, id: "personal-invalid", coordinates: [0, 0] },
      { ...good, id: "ocean-drive" },
      { ...good, id: "personal-empty", name: " " },
      { ...good, id: "personal-art", art: "../../bad" },
    ],
  };
  const saved = parseSavedAtlas(JSON.stringify(input));
  assert.equal(saved.personalLandmarks.length, 2);
  assert.equal(saved.personalLandmarks[1].art, "cottage");
  assert.equal(saved.aliases["ocean-drive"], "Stories");
  for (const c of [[NaN, 25.8], [25.8, -80.13], [-80.13], ["-80.13", 25.8]])
    assert.equal(validMapCoordinates(c), false);
  assert.throws(() => createPersonalLandmark("Home", [0, 0]));
});

test("additional public places retain exact snapshot provenance and stable unique ids", () => {
  const added = JSON.parse(
    readFileSync(
      new URL("../src/data/neighborhood-places.json", import.meta.url),
    ),
  );
  const source = JSON.parse(
    readFileSync(new URL("../public/map/poi-index.json", import.meta.url)),
  );
  assert.ok(added.length >= 25);
  assert.equal(new Set(added.map((p) => p.id)).size, added.length);
  for (const p of added) {
    assert.ok(
      source.some(
        (s) =>
          s.name === p.name &&
          s.class === p.sourceClass &&
          JSON.stringify(s.coordinates) === JSON.stringify(p.coordinates),
      ),
      p.name,
    );
    assert.ok(validMapCoordinates(p.coordinates));
    assert.ok(p.minZoom >= 14);
  }
});
test("new rooms have independent identity and do not mutate existing rooms", () => {
  const first = createRoom("  Books ", []);
  const second = createRoom("Books", [first]);
  assert.notEqual(first.id, second.id);
  assert.equal(first.name, "Books");
});
