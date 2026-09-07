# Awakening City prototype

Application root for Mischief Atlas. Run `npm ci` and `npm run dev` here.

## Architecture

- `src/App.jsx`: selected place, search, navigation, motion controls and browser-local persistence.
- `src/map/InkMap.js`: Leaflet navigation with a canvas renderer for original vector-tile geometry. No WebGL dependency.
- `src/map/AtlasMap.jsx`: geographically anchored illustrations and collision-aware place labels.
- `src/map/TrafficInk.jsx`: discrete fading shoe stamps along mapped street polylines.
- `src/LandmarkTool.jsx`: geographic placement, naming and four reusable architectural illustration choices.
- `src/map-refinements.css`: compact exploration, selection ribbons and reversible paper hinges.
- `src/PlaceSheet.jsx`: rename, unfolding interior, room creation and empty-room inspection.
- `src/atlas-model.js`: input validation, storage recovery, route interpolation and traffic presets.

## Geographic and visual sources

`public/map/SOURCE.json` records the OpenFreeMap snapshot, bounds, retrieval date, and OpenStreetMap license. The 78 vector tiles cover Miami Beach and its immediate surroundings at source zooms 11–14; closer views redraw that source geometry. Missing features in OSM cannot be recovered by zooming. The UI contains 26 curated anchors plus 792 additional named places derived from the bundled POI index. Smaller places reveal with zoom. This snapshot is not a live business directory. Regenerate the derived catalogue with `node scripts/prepare-neighborhood-places.mjs` after a deliberate snapshot update.

`scripts/snapshot-map.mjs` refreshes the public map snapshot and reference indexes. Run it from this directory with network access. Keep the OSM/OpenFreeMap/OpenMapTiles attribution visible.

All artwork in `public/assets/` was generated for this prototype. Landmark depictions and memory interiors are illustrative. Roads, buildings, coastlines and geographic positions use map data rather than generated geography.

## Prototype boundaries

Traffic presets are illustrative, never live. Footsteps are anonymous and do not track people. Personal landmarks, names and rooms use localStorage under `mischief-atlas-v1`. No private data is sent to an API, but browser storage is not encrypted, synchronized, or backed up. Do not use this prototype as the only copy of valuable memories.

Continuous motion honors the initial reduced-motion preference and has an always-available pause/resume button. Landmark emergence and place-sheet opening also stop animating when motion is paused.

## Verification

```sh
npm test
npm run build
npm run test:sites
```

See `design-qa.md` for browser evidence and the selected visual comparison. The Sites runtime files are preserved.

## GitHub Pages

`.github/workflows/pages.yml` builds and deploys the client when application changes reach `main`. GitHub repository Settings → Pages → Source must be **GitHub Actions**. The workflow can also be started manually from Actions → Publish Mischief Atlas.

The Pages build uses `ATLAS_BASE_PATH=/Mischief-Atlas/`. Runtime map requests and illustrations honor that prefix; Vite rewrites CSS assets and font URLs. Only `dist/client` is published. Browser-local names and rooms stay on the device where they were entered; data from the temporary preview does not transfer automatically to the new site origin.

For development on your own computer, `npm ci` then `npm run dev` still starts at the root path. Opening `index.html` directly as a `file://` URL is not supported because the map loads local data using HTTP requests.

See [the shared project guide](../docs/THINGS-TO-WORK-ON.md) for implementation evidence, user decisions and the backlog. Navigation reuses cached tile bitmaps, moves marker nodes without per-frame React reconciliation, and bounds the decorative footprint layer.
