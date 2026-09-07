# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Mischief Atlas decisions

- The selected visual is `../docs/design/assets/awakening-city-selected.png` (the last image of the revised set). Earlier Unfurled Cartographer specifications are superseded.
- Preserve the selected warm parchment, walnut/oxblood ink, large serif title, lower-left unfolding place sheet, illustrated Miami landmarks, and restrained handwriting.
- Use real map geometry for coastlines, buildings, and streets. Generated imagery supplies material and landmark illustrations, not geographic truth.
- Open on South Beach; whole-island control includes Mid Beach and North Beach.
- Street footprints reveal at closer zoom. Density represents simulated volume; movement represents simulated flow. Label traffic as illustrative, never live.
- Animate landmark ink reveal, gently draw garden/pier illustrations, unfold place sheets and rooms. Keep motion restrained, pauseable, and respectful of reduced-motion preferences.
- Landmark names are editable; retain original geographic identity. Memory rooms are illustrative and user-authored. No fabricated personal memories.
- Use the original public GitHub repository; replace obsolete prototype files as needed and preserve privacy safeguards. Do not publish or deploy without a request.
- On 2026-09-07 the user requested GitHub Pages publication, so deploying this prototype to that repository's Pages site is authorized. Build with `ATLAS_BASE_PATH=/Mischief-Atlas/`; keep map and artwork requests beneath `import.meta.env.BASE_URL`. Local development continues to use `/`.
- September 7 local refinement request: preserve the opening title, then withdraw it during exploration while keeping compact identity, search and a clear return. Keep a compact bottom-right map toolkit beginning with personal landmark placement.
- Personal landmarks use matching architectural illustrations with variation and user choice. Keep illustration identity and location stable across reloads; preserve existing aliases and rooms. The current four-drawing set is finite, not on-demand image generation.
- Add at least 25 real places and reveal smaller ones with zoom. The implemented additional catalogue is derived from the bundled OSM snapshot; preserve exact source coordinates and disclose that businesses are not live-verified.
- Prioritize expressive, confident ink across real geography, following the supplied Marauder's Map references and `docs/design/2026-09-07-visual-fingerprint.md`. Removing a muddy overlay must not remove the map's identity. The Visual Director owns a research brief; this work task owns source implementation.
- Investigate navigation lag and keep visual richness compatible with fluid movement. Preserve bounded raster reuse, camera-attached markers, and cached footprint-path measurements unless focused evidence supports a better implementation. Current work is local; earlier publication history does not request a new deployment.

- Implemented September 7 visual grammar: a continuous paper field, exact dark coastline, sparse water-clipped engraving and zoom-dependent architecture; do not restore cool tile backgrounds or global masks. Keep the selected ribbon on a separate opaque paper plane so geographic ink cannot cross its name.
- Folding uses reversible CSS hinges on existing surfaces with stable semantic controls, inert closed panels, static paused/reduced-motion states and one horizontal mobile hinge. Preserve the established memory-room prototype without treating it as the future cutaway implementation.

- September 7 release approval: Mick approved the local map/toolkit refinement and explicitly requested merging and updating everything. Merge this milestone and update its existing published editions with their current audience; this does not authorize implementing every backlog feature.
