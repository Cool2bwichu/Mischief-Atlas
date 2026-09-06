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
