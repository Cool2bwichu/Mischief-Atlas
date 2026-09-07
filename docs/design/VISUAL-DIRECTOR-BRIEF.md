# Mischief Atlas — an island written in ink

September 7, 2026 · First visual-director brief · Proposal for **Mischief Maintained** to implement. No application changes or final visual approval are implied.

## Recommended direction

Make Miami Beach feel like a carefully drawn, inhabited place whose ink responds to attention. Keep Awakening City's composition and original Miami illustrations; extend their confident walnut and oxblood drawing into the geographic canvas. The fingerprint should survive with the title, card and animations hidden.

**First fix material continuity. Then establish a decisive coast, quiet interiors and concentrated architectural ink. Finally add expressive lettering and local motion.** More texture or more labels alone will make the current problem worse.

## What was actually inspected

| Evidence | Observation | Consequence |
| --- | --- | --- |
| User image: `/Users/mick/Downloads/Harry-potter3_map_pettigrew.webp` | A spacious name ribbon has dark curled ends, fine hatch shading and irregular calligraphic letters. Writing around it bends with the drawn space. Sparse footprints are small and distinct. | Use a single selected-place ribbon; keep its center light and its folds dark. Give annotations a spatial role. Do not wrap every place in a ribbon. |
| User image: `/Users/mick/Downloads/Marauder%27sMap.webp` | Fine towers surround a large dark title field. Dense lettering forms winding shapes around large areas of untouched paper. Fine detail and nearly solid ink coexist. | Establish dark architectural anchors against breathing room. Translate the relation between drawing and lettering, not the castle, labels or cover layout. |
| [Current opening](visual-director/01-current-opening.png), localhost, 1280×720 | The title/card and landmark art feel warm and drawn. Land is almost white; water reads cool gray. Buildings form a pale, uniformly intricate grid. South Pointe's label competes with the toolkit. | The UI and underlying map currently feel like different materials. Address cartography and label reservations before adding effects. |
| [Current exploration](visual-director/02-current-exploration.png), same viewport | Title withdrawal works in the inspected click transition and frees space. The fine geometry still dominates the island. | Preserve compact identity and search. The geographic rendering must carry the atmosphere when the opening recedes. |
| [Current whole island](visual-director/03-current-whole-island.png), same viewport | Whole-island control reaches the wider geography. Straight vertical boundaries visibly separate cool/white map coverage from warm parchment margins; mainland detail competes strongly with the island. | Fix tile/paper compositing or coverage treatment. Reduce subpixel building detail at wide scales. This screenshot shows a visual defect, not proof of its implementation cause. |
| [Selected Awakening City mock](assets/awakening-city-selected.png) | Architecture, palms, street hierarchy, dark footprints and coastal engraving share one warm sheet. | Retain the drawing vocabulary and hierarchy. Its illustrative geography is not a replacement for the real map data. |

Snapshots were captured around 00:52 EDT while implementation was active. They are a dated baseline, not a review of later edits. No saved data was changed; only transient navigation in a dedicated hidden inspection tab was exercised.

## Primary-source findings and film limits

- **Verified designer account:** MinaLima's [The Marauder's Map](https://minalima.com/product/the-marauders-map/), expanded **Behind the Design**, attributes the cover to medieval-map ink influences, an architectural enclosure around the title and handwritten script. The page identifies its artwork as a recreation of the graphic prop designed for *Prisoner of Azkaban*. Transfer the integration of architecture and lettering; do not reproduce the Hogwarts enclosure.
- **Verified official description:** [HarryPotter.com's film discussion](https://www.harrypotter.com/features/6-ways-harry-potter-films-look-different-after-you-read-the-books), section about the map, identifies roaming footsteps and hidden corridors. This supports purposeful movement as part of the map's identity; it does not establish precise timing.
- **Verified official object account:** [The Marauder's Map](https://www.harrypotter.com/fact-file/objects/the-marauders-map) describes deliberate reveal/hide activation and tracking of inhabitants. Adapt deliberate reveal to selecting a place; keep the atlas's existing traffic explicitly illustrative.
- **Film frame inspected:** the [verified Harry Potter channel clip](https://www.youtube.com/watch?v=vNc43oKqQzg&t=93s), at displayed **1:33**, shows a named ribbon, a short footprint sequence and lettering following the architectural plan. [Captured frame](visual-director/04-film-sampled-frame.png). Playback was accessible and adjacent time positions were sampled; this was not a frame-by-frame motion study. No film easing, step interval, reveal order or duration is claimed. All numerical motion settings below are design proposals.
- **Unverified here:** the earlier [MinaLima gift-wrap URL](https://minalima.com/fr/product/gift-wrap-the-marauders-map/) redirected to a category page. Its previously recorded film-set-footprint claim was not independently recovered in this pass. Real Miami geography remains a user requirement regardless.

Forme project `e0f20afd03e3c1bd` was reopened and read. Its selected Awakening City reference and MinaLima reference `4d8d70828d45550f` were inspected as records; the latter currently has no saved analysis evidence. This brief does not claim a new Forme synthesis or alter the concurrently used board. Unrelated starter references were excluded. No generated artwork is necessary for this first pass.

## Rendering contract

Numbers below are starting values in **CSS pixels at settled zoom**, not physical canvas pixels. Tune against the screenshots after compositing; these are not measured source-image colors.

### One sheet, three ink strengths

| Role | Proposed displayed target | Purpose |
| --- | --- | --- |
| Paper | `#EAD6AF`; lighter clear space `#F0E0BE` | Warm continuous field across land, water and map margins. |
| Primary ink | `#4B2D20` | Coast, selected outline, major names and architectural shadow masses. |
| Secondary ink | `#79533A` | Street edges, building outlines and readable supporting labels. |
| Engraving ink | `#A17C55` | Fine hatch and subordinate geographic detail; never essential small text. |
| Oxblood | `#783729` | Selection, title and a few meaningful accents. Preserve existing accent identity. |
| Water | Warm paper with a thin `#A9936E` tint and warm ink marks | Water stays open and distinguishable through marks/edges, without the current cool gray field. |
| Garden | Restrained `#8B885B` tint over paper | A quiet geographic distinction, not a new saturated category system. |

Keep paper grain below the drawing, with no animated noise or dark blanket over the map. Avoid making the whole atlas as stained as the photographed prop: lighting and physical aging in a reference are not requirements for readable UI. Reserve believable folds/wear for sheet edges and the place card. Aim for subtle material variation, roughly 3–5% luminance locally, then inspect actual legibility.

**Preserve opaque cached tiles and disabled tile fades.** Do not restore transparent overlapping zoom layers to solve color. Source inspection confirms opaque white tile painting and a multiply declaration, but the screenshot still shows white tile fields. Check the actual stacking/backdrop and computed blending before changing palettes. A white tile base must visually become the same paper as its adjacent margin, with no rectangles at rest or during zoom. Do not conceal missing map coverage with invented land or coastline.

### Island and water

- Keep the exact coastline centerline, bridges, gaps, island extents and landmark coordinates. Start with a continuous **1.25–1.6 px primary contour**. Add selective darker emphasis along existing segments; vary stroke width approximately ±15%, never the underlying geography. Preserve narrow waterways at small scales.
- Ink character comes from pressure and adjacent engraving, not random coordinate jitter. A deterministic variation can depend on stable world position/feature identity; it must not change on pan, tile reload or revisit.
- At neighborhood/detail scales, add short, broken **0.45–0.65 px** water-side echo contours about **3–7 px** from the coast. Clip to real water; omit tight channels where spacing would imply new land. Use at most two local echoes, with gaps. This makes the edge feel engraved and gives the island weight.
- If safe offset contours are costly or create joins, implement short water-clipped hatch marks first. Do not add a geometry library solely for this effect. Retain tile-edge suppression; avoid stroked artificial polygon closures and seams. Patterns must use world-aligned origins across tiles.
- Replace the uniform all-over wave wallpaper with sparse, grouped strokes near selected coastal stretches. Leave the Atlantic's center mostly clear for its name. Coastal detail should explain the shoreline, not texture every pixel.

**Geography tradeoff:** buildings and coast can be selectively simplified visually at distance; they must not move. Illustrations may exceed a footprint as cartographic symbols, anchored to their actual coordinate with a small baseline dot/leader when offset. Do not redraw Miami Beach into a fantasy silhouette or bend roads to fit calligraphy.

### Buildings, streets and inhabited detail

| Scale | Treatment |
| --- | --- |
| Whole island, roughly z11–13 | Coast and major routes lead. Suppress subpixel individual buildings; where retained, use a quiet fill with little/no outline. Keep only landmark/neighborhood names and major illustrations. The mainland is geographic context, not a second equal field of engraving. |
| South Beach / neighborhood, roughly z14–15 | Major street edges **0.85–1.15 px** around paper interiors; minor edges **0.45–0.65 px**. Building outlines **0.5–0.7 px**, subordinate to coast. Preserve open corridors and visible parks. |
| Street detail, roughly z16+ | Building outlines **0.65–0.85 px**. Add clipped one-direction hatch only on sufficiently large footprints (e.g. screen area >100 px²), **0.4–0.5 px** strokes spaced **4–6 px**. Use one consistent hatch angle. Avoid uniform black perimeters and fabricated windows on every building. |

Richer art belongs to existing original landmarks: strengthen a few dark window/roof/palm masses while preserving fine hatching. Start by integrating the six existing illustrations; do not commission an entire new library. Small place symbols remain simpler. Added place quantity is not visible richness unless the hierarchy is legible.

### Lettering and controls

- Retain **IM Fell English** for identity, geographic names and functional text; no new font dependency. Keep **Caveat** for short personal asides only. Do not simulate handwriting with random rotation of every label.
- Keep functional body/search/results at **14–16 px or larger**; major map names **15–18 px**, neighborhood names **14–16 px**, local labels generally **12–14 px**. Hide an unfit label instead of shrinking it into texture. Adjust label density to the actual viewport and zoom.
- Allow large geographic water/neighborhood names on a gentle arc only in sufficiently open space. Essential street names remain upright or follow their street at a readable angle. Curved lettering is atmospheric geography, not navigation UI.
- One selected-place ribbon, about **18–22 px** text, two restrained curls, light center, dark hatched folds. It should clarify selection and connect visually to the existing place sheet. Long names wrap or use the plain sheet heading; never squash the letters. Do not reproduce the reference's name or flourish shapes.
- Give labels a small paper knockout/halo (about **1–1.5 px**) and collision padding (about **8 px**). Reserve actual UI/card bounds and illustration bounds, including mobile toolkit space. Prioritize selected place → major landmarks → neighborhood → local places → street text. Keep a selected place discoverable even if its label must relocate with a leader.
- Keep compact identity, search and toolkit usable. No new floating dashboard panels. A single ink rule or drawn corner can tie existing surfaces to the map more effectively than additional distressed borders.

## Three signature motions

| Motion / purpose | Proposed behavior | Static and reduced-motion state |
| --- | --- | --- |
| Attention darkens ink: communicate selection | Local landmark accent/reveal over **240–360 ms**, beginning with its stable anchor. Animate one original artwork or a small local mask, never the entire geographic canvas. Interaction is immediate. | Show the completed accent instantly. Selection also has a persistent outline/ribbon and accessible selected state. |
| Footsteps accumulate: communicate street flow | Distinct alternating marks placed along the existing precomputed route; begin with **250–350 ms** between marks and a short fading tail. Keep a small visible pool (initial budget **≤48 marks**, less on mobile). Tune at real scale. Preserve the existing illustrative-traffic label. | Sparse stationary marks plus legend when paused; no implied live person. Essential future route information must remain visible without motion. |
| Place paper opens: preserve map-to-place continuity | Selected ribbon settles into the place sheet over **240–320 ms**, using a shared small travel direction and restrained opacity/transform. If the sheet is fixed lower-left, retain the map anchor and selected name rather than flying a panel across the map. | Immediate sheet with the same selected anchor, heading and reliable close/focus return. |

Use a small family of ease-out transitions such as `cubic-bezier(.2,.7,.2,1)`. These are original interface proposals, not measured film reproductions. No idle coastline morphing, island bobbing, decorative parallax or recurring full-map ink reveal. During ordinary drag/zoom, geographic layers move together under Leaflet; pause decorative work if necessary. Enchantment must preserve spatial continuity.

## Implementation sequence and acceptance

1. **Material and hierarchy pass:** check tile blending/coverage, warm the water, establish coast weight, quiet distant buildings. Capture the same South Beach and whole-island views. Gate: even with cards, titles and motion absent, the map looks intentionally drawn on one continuous sheet. No straight white/cool tile boundaries or dark zoom rectangles.
2. **Controlled drawing pass:** add deterministic coastal engraving and selective building hatch in cached tile rendering; integrate existing architectural art. Gate: coast/bridges/anchors remain aligned to source geometry; no tile seams, disappearing channels, hatch swimming or uniform dark congestion.
3. **Lettering and local motion pass:** one selection ribbon, label priority/reservations, one local reveal and refinement of existing footsteps. Gate: select Ocean Drive and South Pointe, close/reopen the sheet, search a place, then pan/zoom immediately. Text does not collide with toolkit or sheet; selection stays understandable with animation off.
4. **One focused review:** match desktop baseline at 1280×720 and inspect a 390×844 touch layout. Check keyboard selection/close/focus, reduced motion and pause. Main task should reuse its fresh placement/persistence evidence unless implementation changes that behavior. No storage migration is required by this brief.

**Performance guardrails:** retain the bounded raster cache, offscreen geometry culling, cached route distances and delayed zoom tile updates. Bake static hatching only when rendering/caching a tile. No per-frame vector regeneration, React reconciliation during camera motion, footprint-canvas resize on every move, full-screen filter animation or new rendering engine. Limit device-pixel-ratio scaling as the current renderer does. Compare the same drag/zoom sequence against the main task's fresh baseline; target steady frames around 16.7 ms on its test device and no recurring >50 ms decorative work. These are acceptance targets, not benchmark results from this research pass.

**Review limits and unresolved tuning:** the three atlas stills and title/whole-island transitions were inspected. Mobile, accessibility, memory persistence and frame timing were not validated here. The blending defect's exact cause, final composited palette, safe coastal-echo implementation and density thresholds require the main task's focused implementation check. None requires another broad reference hunt. User review of the resulting live map remains outstanding.

## Folding addendum — opening reveals a larger place

Added after Mick explicitly requested research into distinctive Harry Potter/Marauder's Map folding. This refines the third signature motion above; it is not a fourth family of animation.

### Actual examples

1. **Film prop, blank central fold:** the [official clip at 1:07](https://www.youtube.com/watch?v=vNc43oKqQzg&t=67s) shows a light, blank sheet held open along a strong central crease. [Evidence](visual-director/05-film-blank-fold-1m07.png). The paper has physical depth before ink supplies information; magic need not mean the whole object materializes from nothing.
2. **Film prop, illustrated cover to interior:** [1:22](https://www.youtube.com/watch?v=vNc43oKqQzg&t=82s) shows the illustrated cover beside a narrow angled leaf and a dark vertical fold; by [1:27](https://www.youtube.com/watch?v=vNc43oKqQzg&t=87s), substantially more of the interior plan is exposed while the cover remains at left. [Folded/partly open evidence](visual-director/06-film-gatefold-1m22.png) · [interior evidence](visual-director/07-film-open-plan.png). Playback was run briefly between these positions. The sampled images support hinged lateral expansion and persistent cover/context; they do not establish a complete flap order, closing choreography or a measured animation curve.
3. **Physical replica with nested folds:** [The Noble Collection UK's product](https://noblecollection.co.uk/product/marauders-map/) explicitly describes expanding folds and flaps. Its inspected hero photograph shows multiple upright concertina panels around a broader central plan and additional horizontal flap divisions. [Evidence](visual-director/08-replica-open-folds.png). The manufacturer's [US specification](https://noblecollection.com/Item--i-PRP-HP-7888) gives 15.5×72 inches open and 15.5×8.25 closed. This is documented physical expansion, not proof of screen motion. The transferable idea is a compact exterior holding a much larger interior.

### Proposed atlas choreography

**Use actual hinges and layered paper surfaces, not generic fade/scale.** One coherent place sheet should unfold from its current visible edge into the space available. Keep the map camera and selected landmark fixed. The following timings and ordering are original UI proposals informed by the examples.

| Surface | Hinge and opening | Closing / continuity |
| --- | --- | --- |
| Existing place sheet, first demonstration | Keep a narrow identity spine/title edge fixed. A foreground cover leaf rotates around its vertical crease toward the map's open interior; a second, smaller inner leaf follows after about **60–80 ms**. Use **360–440 ms total**, overlapping stages. The geography remains visible beyond the sheet. | Reverse inner leaf first, then cover; **240–320 ms**. Finish at the same anchor and return focus to the initiating control. Closing is refolding, not disappearing into the center. |
| Add-landmark/toolkit panel | One short flap unfolds upward from the toolkit's top edge, **180–240 ms**, exposing tools in place. No multi-panel theatrical sequence for a frequently used utility. | Refold to the same button; cancellation remains immediate. Retain unfinished input according to existing app behavior rather than destroying it at animation end. |
| Opening title, optional later refinement | A two-part title leaf can tuck toward the compact identity edge once exploration begins, **280–360 ms**. Search stays visible and stationary. | Explicit return reopens from that same edge. Never replay because the user merely drags, zooms or visits another place. Preserve current working withdrawal until this improves it. |
| Future room cutaway, later scope | A facade could be two unequal paper leaves on the building's original edges: near leaf opens, inner leaf follows, fixed floor/room plan is revealed. Room positions remain stable. | Refold the facade around that same interior. Do not turn this proposal into current room implementation or rearrange stored memory positions. |

On desktop, fold the place sheet's leaf toward available map space. On mobile, use **one horizontal hinge at the top edge of a bottom sheet**, unfolding upward inside a bounded panel; preserve visible selected-place identity above it. Recompose the fold for available space rather than rotating a desktop panel offscreen. Touch and keyboard use explicit **Open/Close** controls, not a hidden corner-drag gesture.

### Material, accessibility and implementation constraints

- Show a narrow **1–2 px crease**, slight edge thickness, and a paper-colored reverse face. A shadow stays attached to the hinge, strongest near the fold and fading as the sheet lies flat. Use a small pre-rendered gradient layer with opacity changes, not a moving full-screen blur. Match the drawing across adjacent leaves so the open state feels like one sheet.
- Use at most **two animated leaves plus a stable content plane**. CSS perspective around **900–1200 px** is a starting point; tune without extreme foreshortening or bounce. Backfaces must not show mirrored text. Avoid a real accordion of many DOM layers simply because the replica contains many folds.
- Keep the real heading, close button and form content on a stable semantic plane. Decorative flap duplicates, if used, are `aria-hidden` and noninteractive; do not duplicate focusable controls. Text becomes readable without waiting for a flourish. Closing remains reachable throughout.
- Animate only transform and restrained shadow-layer opacity. Do not animate the geographic canvas, repeatedly measure panel layout per frame, or add a new animation dependency. A simple hinged leaf is stronger than an expensive paper simulation.
- Reversing an action mid-fold must reverse from its current position, not queue a full open-and-close cycle. Selecting another place immediately updates the logical selection; preserve focus and content rather than displaying the previous place until the animation ends. Abort decorative motion on necessary navigation.
- With reduced motion, pause, or insufficient performance, show the final sheet immediately with static crease/edge details and the same content hierarchy. The paper identity survives without movement.

**Focused fold acceptance:** open and close one place five times, interrupt twice mid-fold, then select another place while opening. Verify no stale content, mirrored words, duplicate focus targets, lost input or map-camera movement. Inspect one desktop and mobile sequence, plus reduced motion. Only then reuse the grammar in the toolkit; future cutaways remain a separate milestone.

**Subsequent main-task report:** after this brief's baseline captures, Mischief Maintained reported moving multiply blending to the entire `.atlas-map` surface and normal blending inside the Leaflet tile pane to correct the backdrop isolation issue while retaining opaque tiles. That correction was not freshly inspected by this director. The original screenshots remain useful before-state evidence; the main task should evaluate its newer result before treating the earlier compositing defect as still present.

## Post-implementation review attempt — September 7, 2026

An independent director review of the implemented opening, exploration and whole-island views could not be completed: the isolated inspection browser was unavailable, and the implementation task's fresh captures existed only as inline tool results, with no accessible evidence files. The older screenshots in this brief are not evidence of the new implementation. No additional browser recovery or functional retesting was undertaken.

Mischief Maintained reports checking the refined map views, South Pointe, mobile chooser, static interior, dense navigation, fold reversals and reduced-motion behavior. Those remain implementation-owner reports, not independently verified director findings. No new visual pass or artistic approval is asserted. **Mick's review of the live result is the next gate.**
