# Awakening City Implementation Plan

> **For agentic workers:** Use Product Design image-to-code for the selected visual. Asset production may run in parallel; application integration remains in this session.

**Goal:** A working, richly illustrated enchanted Miami Beach map with real geography.

**Architecture:** React manages place selection, browser-local aliases and memory rooms. MapLibre renders locally bundled OpenStreetMap-derived vector tiles; DOM landmarks and a canvas of raster footprints share its geographic projection. Generated raster assets provide parchment and illustration, with CSS animation revealing their ink.

**Tech Stack:** React 19, Vite 6, MapLibre GL JS 5, Phosphor icons, IM Fell English and Caveat fonts, Node test runner.

**Spec:** `docs/specs/2026-09-06-awakening-city.md`

## Global constraints

- Selected source: `docs/design/assets/awakening-city-selected.png`.
- At least 18 selectable landmarks, starting with Ocean Drive.
- Traffic is illustrative, never labeled live; real map geometry remains authoritative.
- Preserve public-repository privacy rules and existing Sites runtime.
- Preview locally; no deployment requested.

## Task 1: Geographic foundation and asset pack

Files: `atlas/scripts/snapshot-map.mjs`, `atlas/public/map/`, `atlas/src/data/landmarks.js`, `atlas/src/map/style.js`, `atlas/public/assets/`.

- [ ] Bootstrap the bundled Product Design desktop template in `atlas/`, preserving repository documents.
- [ ] Snapshot only tiles intersecting Miami Beach and immediate bay context at zooms 11–14. Record retrieval/source attribution. Extract named POI coordinates and traffic lines from those tiles.
- [ ] Generate individually measured parchment, landmark, footprint and memory-room assets in the selected visual style.
- [ ] Define `landmarks` entries with `{id,name,coordinates,subtitle,asset,kind,priority}`; at least 18 entries with stable IDs. `coordinates` is `[longitude,latitude]`.
- [ ] Style water, roads, parks and buildings in transparent sepia so parchment remains the shared surface.

## Task 2: Interactive atlas and place sheet

Files: `atlas/src/App.jsx`, `atlas/src/map/AtlasMap.jsx`, `atlas/src/places/PlaceSheet.jsx`, `atlas/src/atlas-model.js`, `atlas/src/styles.css`, `atlas/tests/atlas-model.test.mjs`.

- [ ] Add model tests before model implementation: `assert.equal(normalizeName('  Film  Library  '), 'Film Library')`; reject blank aliases; verify room IDs stay unique and geographic identity is unchanged.
- [ ] Implement `normalizeName(value)`, `pointAlongPath(coordinates,progress)`, and `trafficSettings(preset)` with immutable state updates.
- [ ] Build a single map viewport, title/search, illustrated coordinate-anchored landmarks, inset/whole-island view, zoom and keyboard controls.
- [ ] Place selection unfolds the lower-left sheet. Add rename/save/cancel, original geographic name, and an interior with user-named rooms. Storage is browser-local and failures fall back to session state.
- [ ] Make all visible primary controls operational and all expandable states semantic.

## Task 3: Living ink and verification

Files: `atlas/src/map/TrafficInk.jsx`, `atlas/src/map/traffic.js`, `atlas/design-qa.md`, `atlas/README.md`.

- [ ] Test route interpolation endpoints and corner movement: `pointAlongPath([[0,0],[1,0],[1,1]],0.75)` reaches `[1,0.5]` within numerical tolerance.
- [ ] Place raster sole impressions along street polylines using map projection; vary density and speed with illustrative flow presets, hide below neighborhood zoom, and fade oldest impressions.
- [ ] Reveal landmark art on approach/selection; unfold card/interior through paper hinges. Pause and reduced motion stop continuous animation without removing controls.
- [ ] Run model tests and production build. Open the preview in the cloud browser and verify pan/zoom/search/select/rename/rooms/refold/traffic/pause.
- [ ] Capture matching visual states, compare full-view and focused card detail against the selected source, resolve substantive issues, and record an honest final QA result.
- [ ] Commit the completed branch and provide the working local preview; retain remote publishing as a separate user-directed action.
