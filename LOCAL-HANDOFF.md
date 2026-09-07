# Mischief Atlas — local development handoff

Updated September 7, 2026. This is the entry point for continuing the existing project on Mick's computer. Read [the shared project guide](docs/THINGS-TO-WORK-ON.md) for the current milestone and release evidence.

## Immediate task

Open this repository in the local coding chat. Read this file, `atlas/AGENTS.md`, and `atlas/README.md`. Inspect the current working tree before changing anything. Install dependencies, start the app locally, and open it in the available browser. Preserve the existing visual direction while Mick reviews it and directs the next changes.

The cloud chat could prepare this repository but could not create a chat in the user's project folder or write files directly to the user's Mac. Do not assume those steps already happened.

## Source and published state

- Canonical repository: https://github.com/Cool2bwichu/Mischief-Atlas
- App directory: `atlas/`.
- Starting main revision before this handoff: `d586cbaee10eade35d240bad1d7415be1e1a3d79`. Prototype PR #1 is merged.
- A ChatGPT Site was successfully published in the previous session and is now public at https://mischief-atlas.cool2bwichu1992.chatgpt.site. Its existing project ID is recorded in `atlas/.openai/hosting.json`; reuse it for any future requested Sites deployment. Do not create another Site.
- GitHub Pages is enabled through `.github/workflows/pages.yml` and live at https://cool2bwichu.github.io/Mischief-Atlas/. Release run 34086826322 succeeded on September 7. The existing ChatGPT Site was also refreshed to version 2. Check the shared guide for release evidence and V3’s next visual direction.
- Mick approved the map/toolkit refinement and requested merging and updating the published versions on September 7. Preserve the current audience and existing browser data.

## Start locally

Use Node.js 22 and npm. From the repository root:

```sh
cd atlas
npm ci
npm run dev -- --host 127.0.0.1
```

Open the localhost URL Vite prints. If the default port is occupied, use the actual printed port. The app needs an HTTP server; opening `index.html` directly will not work. Fonts, illustrations, and map data are bundled. No map API key or backend account is needed.

Verification commands:

```sh
npm test
npm run test:sites
npm run build
```

The September 7 refinement passed eight model tests, four hosting tests, production builds, and desktop/mobile interaction checks. These are dated results; rerun relevant checks after changes. The production build also prepares the existing Sites Worker output.

## Product and visual direction

Mischief Atlas is a personal memory palace: familiar places become topics; rooms and sublocations become categories. Its deeper purpose is vivid lifelong recall. The current scope is the map's aesthetics and interactions.

The chosen visual reference is `docs/design/assets/awakening-city-selected.png` — the last selected Awakening City mockup. Inspect it before major visual work. Earlier Unfurled Cartographer specifications are superseded. Preserve parchment, walnut and oxblood ink, serif lettering, restrained handwriting, illustrated Miami landmarks, unfolding place cards, and a lived-in sense of enchantment inspired by the Marauder's Map.

Use real Miami Beach geography, opening on South Beach with whole-island navigation. Keep Google Maps-like pan, zoom, search, and selectable place cards. Geographic detail comes from mapped geometry; generated artwork provides illustration and material texture.

## What exists

- React/Vite application with Leaflet navigation and a custom canvas map renderer.
- Bundled OSM/OpenFreeMap snapshot: streets, buildings, coastline, 78 source vector tiles at zooms 11–14. Closer zoom redraws that data; it cannot add missing detail.
- 26 curated anchors plus 792 additional searchable snapshot places, six original landmark illustrations, and four personal-landmark drawing choices.
- Ink emergence and street-following fading footprints that reveal at closer zoom.
- Place cards, landmark aliases, unfolding interiors, and user-created named rooms.
- Pause/resume motion and reduced-motion handling.
- Personal landmarks, aliases and rooms persist in localStorage under `mischief-atlas-v1`.

Traffic is simulated, not live; footprint speed and density respond to illustrative traffic presets. Live traffic and weather are future ideas. Memory entries, recall training/scheduling, cloud synchronization, accounts, and backup/export are not implemented.

Browser data is specific to the origin and browser. Names and rooms on the published Site will not automatically appear on localhost. Do not clear existing storage or fabricate personal memories.

## Files to know

- `atlas/src/App.jsx`: app state, search, navigation, persistence, motion.
- `atlas/src/map/InkMap.js`: geographic rendering and map navigation.
- `atlas/src/map/AtlasMap.jsx`: landmark illustrations and labels.
- `atlas/src/map/TrafficInk.jsx`: footprint animation.
- `atlas/src/PlaceSheet.jsx`: cards, renaming, interiors, rooms.
- `atlas/src/styles.css`: material, layout, typography, animation.
- `atlas/src/atlas-model.js`: validation, storage recovery, route interpolation.
- `atlas/public/map/SOURCE.json`: geographic sources and attribution.
- `atlas/design-qa.md`: previous verification and known limits.

Preserve `atlas/worker/index.js`, `atlas/scripts/prepare-sites-build.mjs`, and `atlas/.openai/hosting.json`. Local and Sites builds use root base `/`; GitHub Pages uses `ATLAS_BASE_PATH=/Mischief-Atlas/`. Runtime assets must honor `import.meta.env.BASE_URL`.

## Working preferences

Continue in the same repository. Keep meaningful fixes and design decisions concrete and reviewable. Mick wants beauty, precise geography, and convincing enchantment; avoid a generic dashboard aesthetic. Ask questions as ordinary chat text because interactive choice cards have not appeared reliably in his desktop client.

The repository is public. Keep real memories, journals, private media, exports, and credentials out of Git. Retain map attribution. Do not embed source-write credentials in files or remotes.
