# Awakening City — prototype verification

final result: passed

## Evidence and state

- Source visual truth: `../docs/design/assets/awakening-city-selected.png` (1488 × 1058).
- Final browser capture: `../docs/design/verification/atlas-desktop.jpg` (1488 × 1058).
- Full comparison: `../docs/design/verification/atlas-comparison.jpg` (2976 × 1058), source left, implementation right; opened together for review.
- Phone capture: `../docs/design/verification/atlas-mobile.jpg` (390 × 844).
- Desktop state: South Beach, Ocean Drive selected, original name, folded place sheet, street-level map. Motion paused for the stable comparison.
- The browser viewport is 1363 × 936. A temporary same-origin iframe harness provided the exact 1488 × 1058 CSS viewport; full-page capture preserves 1:1 pixels. The mobile iframe was 390 × 844 CSS pixels, captured at 1:1. No design-image scaling was used in the comparison.
- The desktop place card was also inspected at full capture resolution: heading, hotel illustration, frame corners, buttons and footnotes are legible. Separate crops were unnecessary because these details are readable at 1:1.

## Comparison history and fixes

1. P0: WebGL initialization prevented the original map from rendering. Replaced the GPU renderer with a canvas vector-tile renderer and Leaflet navigation; the original geographic dataset is preserved. Later captures show the complete map and functional UI.
2. P1: Landmark drawings initially had white rectangular backgrounds. Applied multiply blending at the full illustration layer. Final captures show ink integrated into the parchment, including garden, Colony Hotel, Casa Casuarina, pier, New World Center and Bass.
3. P2: Early label collision ordering hid illustrated landmarks behind lower-priority text. Prioritized illustrated anchors, retained selected-place priority, and tuned collision bounds. The final desktop viewport shows all six illustrated landmarks.
4. P2: The place sheet was too small and plain compared with the source. Added a generated ornamental frame, enlarged the desktop sheet and illustration, moved it closer to the source position, and restored an oxblood primary action.
5. P2: Footprints were overcrowded and overlapping. Limited duplicate road segments, separated stamp spacing from motion speed, shortened trails and reduced footprint size. Final streets retain discrete, fading trails.
6. P2: Map detail competed with the masthead. Faded the map under the desktop title and mobile header while preserving geographic geometry and navigation.
7. Final matched-state comparison: the sheet now has the intended lower-left prominence, six integrated ink illustrations, readable controls and source-aligned parchment/oxblood hierarchy. No remaining actionable P0/P1/P2 issue within the approved aesthetic-prototype scope.

## Required fidelity surfaces

- **Typography:** bundled IM Fell English supplies a period serif for headings and street labels; Caveat supplies annotations. Original source lettering is more calligraphic. The live font is an intentional editable-text approximation, with additional display flourishes left as P3 polish. Heading wrapping and map labels were inspected.
- **Spacing/layout:** title upper-left, map center-right, large sheet lower-left, inset upper-right, compass/zoom lower-right. Real geographic proportions make the island narrower than the generated concept; this is intentional to preserve spatial accuracy. Expanded content scrolls within the sheet. Mobile keeps the search, sheet actions and navigation reachable.
- **Colors:** ivory/amber parchment, walnut map ink, oxblood headings and primary action. Contrast was strengthened in building outlines. Fainter marginalia is decorative; core actions remain darker.
- **Image quality:** generated parchment, six individual landmarks, the interior and ornate frame are separate raster assets. No screenshot is used as the map or interactive UI. Images preserve their aspect ratios; white asset backgrounds blend into the paper. Standard controls use Phosphor icons. Actual map geometry is data-driven canvas cartography.
- **Copy:** retains Ocean Drive and the source's “A place for what you want to keep.” Place names retain original geographic identity after renaming. Empty rooms contain no fabricated personal memories. Simulated traffic is disclosed both on the map and in settings.

## Browser checks

- Desktop search by keyboard selected Botanical Garden and moved the map.
- Whole-island view displayed North Beach Oceanside Park, Miami Beach Bandshell and Fontainebleau; streets/landmarks remain geographically anchored.
- Rename updated the map label and sheet; original identity remained visible.
- A synthetic room was created, survived reload, opened and was removed through the UI. The synthetic alias was restored to Ocean Drive; no personal data was used.
- Blank room input displayed validation. Mobile search selected South Pointe Pier, and mobile zoom and close/refold controls worked.
- Traffic presets changed, footsteps toggled off/on, pause changed to resume, and the whole-island view hid footsteps at low zoom. Reduced motion is wired through matchMedia and the same paused rendering branch.
- Browser app console errors after the canvas replacement: none. Unrelated browser-extension metadata messages were excluded.

## Scope and residual gaps

This is a working aesthetic prototype, not a pixel-identical reproduction of the generated drawing or a Google Maps data clone. Accurate OSM geometry replaces the concept's invented street layout. Bespoke calligraphic flourishes, more illustrated secondary landmarks and richer landmark-specific looping motion remain P3 polish. Current landmark motion is reveal/hover/unfold, with continuously animated street ink.

Touch layout and controls were checked at a phone-sized viewport; physical-device multi-touch, Safari and assistive-technology audits remain untested. Live traffic, memory entries, recall scheduling and cloud persistence are outside this build.

## Implementation checklist

- [x] Selected target and later revision compared at the same dimensions and state.
- [x] Core place, search, map, room and motion controls verified.
- [x] Public geographic attribution retained; private data excluded.
- [x] Desktop and phone evidence saved.
- [x] Five model tests, four hosting tests, and the production build passed.
