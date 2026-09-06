import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeName,
  pointAlongPath,
  trafficSettings,
  parseSavedAtlas,
  createRoom,
} from "../src/atlas-model.js";

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
  assert.deepEqual(parseSavedAtlas("broken"), { aliases: {}, rooms: {} });
  assert.deepEqual(parseSavedAtlas('{"aliases":null,"rooms":[]}'), {
    aliases: {},
    rooms: {},
  });
  const s = parseSavedAtlas(
    '{"aliases":{"ocean":"Cinema","bad":12},"rooms":{"ocean":[{"id":"a","name":"Films"},null]}}',
  );
  assert.deepEqual(s.aliases, { ocean: "Cinema" });
  assert.deepEqual(s.rooms.ocean, [{ id: "a", name: "Films" }]);
});
test("new rooms have independent identity and do not mutate existing rooms", () => {
  const first = createRoom("  Books ", []);
  const second = createRoom("Books", [first]);
  assert.notEqual(first.id, second.id);
  assert.equal(first.name, "Books");
});
