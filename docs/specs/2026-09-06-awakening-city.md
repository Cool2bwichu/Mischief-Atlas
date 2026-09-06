# Awakening City — approved visual prototype

The user selected the final revised visual on 2026-09-06: `../design/assets/awakening-city-selected.png`. This supersedes the earlier Unfurled Cartographer design and task plan. Continue in the original Mischief Atlas repository.

## Outcome

A beautiful, working personal Miami Beach atlas. South Beach is the initial close view; pan and zoom reveal the whole island. Real coastlines, roads and buildings support generated illustrated landmarks. The selected image controls color, material, typography, composition and illustration style, while real geographic data corrects its misplaced streets and landmarks.

## Interaction

- Drag, wheel, touch and visible controls navigate the map. A whole-island inset or action resets orientation.
- Landmark labels and drawings are selectable and searchable. A parchment place sheet unfolds from the lower-left margin, initially showing Ocean Drive.
- Rename changes the map and sheet title; original geographic name remains visible. Changes may persist in this browser only.
- Unfold exposes an illustrative memory interior. Users can name sublocations; no real building interior or personal memory content is invented.
- Close/refold returns space to the map. Keyboard users can select through search and named controls.
- At neighborhood zoom, anonymous footprints appear on actual street geometry. Density and speed separately express illustrative volume and congestion. No live traffic feed is claimed.
- Ink reveal, landmark emergence, paper unfolding, and footprint aging are purposeful motion. Pause/resume stays available. Reduced-motion preference stops continuous animation.

## Composition and assets

Canonical 1440×1024 desktop: edge-to-edge ivory parchment, roughly 400px title in upper-left, detailed map concentrated center-right, roughly 500×460px lower-left place sheet, small island overview upper-right and navigation lower-right. Adapt at smaller widths to avoid overlapping controls and inaccessible sheet content.

Use generated raster parchment and individual landmark drawings. Use a consistent existing icon library for standard controls. Render actual vector map geometry with a canvas tile layer and Leaflet navigation. MapLibre was replaced during implementation because the preview browser disables WebGL. Do not rasterize the full UI or use the generated concept as the geographic map.

## Data and scope

OpenStreetMap-derived OpenFreeMap vector tiles provide the geographic reference, with visible attribution. A small local geographic snapshot makes this prototype independent of a runtime map API. Public map information and generated art only; no credentials, private memories or real personal photographs in Git.

Full recall scheduling, AI mnemonic generation, accounts, cloud storage, actual live traffic and multi-territory support remain outside this aesthetic prototype.

## Acceptance

Real South Beach geometry; at least 18 selectable landmarks; working search, zoom, pan, whole-island view, rename, unfold/refold and memory-room naming; anonymous simulated footprints follow streets and respond to zoom and flow controls; meaningful reduced-motion behavior; browser-verified interactions and visual comparison against the selected target.
