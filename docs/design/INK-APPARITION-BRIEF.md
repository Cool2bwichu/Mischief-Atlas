# Mischief Atlas — ink gathering and returning to paper

September 7, 2026 · Source-grounded implementation brief · **Ready for Mischief Maintained.** User-recording keyframes inspected; application changes and final artistic approval remain with the implementation task and Mick. No production changes or exact cinematic-fidelity claim are made here.

## Recommendation

Use **pigment bloom followed by fine drawing resolving**. This revises the preliminary generic porous-mask idea after inspecting Mick's recording: broad ink pools and fine lettering do not arrive as one uniformly processed picture. Brown pools begin in a few places, grow into a ragged connected dark mass, while names and peripheral architecture become legible on overlapping but different schedules. Reproduce that hierarchy with artwork-aware masks. Do not distribute random speckle equally across the whole illustration.

Pair it with a **light, deeply varied parchment field**: broad warm mottling, local stains, restrained fine grain, dimensional creases on folding paper, and dark ink with clean negative space. Paper fidelity and motion fidelity are coequal gates. The earlier 3–5% material suggestion is not a locked ceiling; strengthen the actual material until it reads as parchment, while keeping it below the ink.

For disappearance, design a reverse erosion of the same connected pigment regions. **The supplied recording does not show disappearance**; this inverse is an original functional adaptation. The drawing's final geometry never slides, scales or scatters into airborne particles. Its visible ink coverage changes while paper, geographic anchors and core navigation remain stable.

Paper folding and ink apparition have separate jobs. Folding exposes physical space; apparition introduces or dismisses a particular ink inscription inside that space. Neither is a routine camera-navigation effect.

## Evidence and present diagnosis

- Primary source: Mick's **13.948-second local recording** of [Every Marauder's Map Scene — Compilation](https://www.youtube.com/watch?v=HmGrtROhey0), an observed verified Harry Potter upload of 9:36. The director inspected twelve sampled PNGs from two apparition excerpts. The recording and frames stay private under `.git/atlas-checkpoints/ink-reference/`; they contain browser/account context and must not be copied into public docs or production assets. [Inspection log](ink-apparition/INSPECTION-LOG.md) identifies exact evidence files.
- The recording is **not one continuous source timeline**: it starts at displayed 1:02–1:05, then the user scrubs backward. The second sequence's controls are hidden until a later displayed 0:54. Use recording-relative times below; do not add them to 1:02 or mistake the backward seek for ink disappearing.
- Earlier inspected [official clip at 1:33](https://www.youtube.com/watch?v=vNc43oKqQzg&t=93s) shows a named ribbon, small footprints and lettering following the plan; [earlier captured evidence](visual-director/04-film-sampled-frame.png). It establishes the visual vocabulary, not a dissolve mechanism. Earlier fold evidence is in [the director brief](VISUAL-DIRECTOR-BRIEF.md#folding-addendum--opening-reveals-a-larger-place).
- Read-only source inspection confirms `styles.css`'s `ink-arrives` combines horizontal `clip-path: inset(...)`, opacity and a small blur. This creates a directional wipe, without porous spatial gathering or an exit state. `AtlasMap.jsx` renders a filtered visible-marker list keyed by place ID; when density/visibility removes then remounts a marker, an unconditional mount animation can replay. These are concrete implementation findings, not live visual verification of the current release.

| Recording-relative sample | Visible evidence | Interpretation and limit |
| --- | --- | --- |
| **0.00 s**, displayed source **1:02** | Illustrated left cover; the right leaf has sparse dark marks and little plan detail. | Starting state of an interior-plan apparition. |
| **1.15 s**, displayed **1:03**, then **2.31 s / 1:04** | Extensive fine lettering/architecture occupies the right leaf; the left cover remains drawn. | Local ink information appears without replacing the whole sheet. Coarse sampling does not establish individual stroke order or its exact mechanism. |
| **5.77 s** after backward scrubbing | Nearly blank paired cover leaves, with mottling, stains, creases and a strong center shadow already present. | Paper texture exists before the magical ink; it should not be revealed together with artwork. |
| **6.92 s** | Faint names above; several small brown patches near the lower central seam. | Distinct text and ink-mass regions begin separately. |
| **8.08 s** | Name letters are stronger; lower patches have enlarged into a ragged, branching mass. | Nonuniform growth is visible across successive frames. This supports ink pooling/spreading visually, not a claim about the VFX algorithm or physical absorption. |
| **9.23 s** | Large connected title mass with light negative-space lettering; architecture/flourishes remain incomplete. | Dark filled mass and fine contours have different reveal schedules. Preserve negative-space lettering inside dark areas. |
| **10.39 s**, followed by film cut at **11.54 s / displayed 0:54** | Most fine architectural edges and ornament have resolved around the mass. | Completion follows several seconds of source development; UI timing below deliberately compresses it. A dissolve was not observed. |

**What is established:** spatially nonuniform pigment growth, separate development of dense masses and fine marks, intact paper, and stable drawing placement within moving physical leaves. **Not established:** fluid simulation, pigment particles moving off the paper, microscopic edge absorption, an exact pen-writing path, a source dissolve, or measured film easing. The sequence of actual frames supports temporal change; an isolated still alone would not.

## One effect, two directions

Use these as starting UI timings; they are **proposed**, not measured film timings.

| Phase | Appearance, about 600 ms total | Proposed disappearance, 320–400 ms total |
| --- | --- | --- |
| First, roughly 0–25% | Several pools begin in the artwork's actual dense-ink regions; selected fine text/structural strokes start independently. A plain location dot and semantic name are already available. | Fine details and weaker patches begin to recede while stronger contours remain briefly recognizable. |
| Middle, roughly 25–70% | Dense pools grow and join. Fine line regions appear in uneven clusters, lagging or leading locally. The dense silhouette becomes recognizable before all hatch/detail resolves. | The connected drawing breaks into shrinking attached patches. Nothing flies away; the paper itself does not fade. |
| Finish, roughly 70–100% | Fine hatching/contours complete around the established mass. Finish at exactly the original, fully opaque, crisp artwork, with no lingering haze or shimmer. | Remaining pigment vanishes completely. No rectangular ghost, residual blur, missing base map or stale hit target. |

Use two or three unevenly spaced reveal origins **within authored ink masses**, aligned with structure (trunk/roofline/base), never a conspicuous centered circle or a straight left-to-right front. Then resolve a separate fine-line region with an overlapping schedule. A wave drawing with no large filled area needs only small dark crest/trough accents: do not invent a large stain simply to force the reference's cover effect onto it. Edges may be softly irregular during growth, but no coarse pixel noise. Avoid confetti, smoke, sparks and a dissolving rectangle around the art. The samples do not justify tracing every letter as though written by an invisible pen.

Choose **560–680 ms** for a first deliberate landmark/vignette reveal, **320–420 ms** for a small repeated annotation. These are compressed interface durations, not source measurements. Existing essential labels do not wait for them.

**Paper is a stable lower plane.** Mask ink only. Raster assets with baked paper need a deliberate pigment-isolation decision; do not accidentally animate their rectangular paper background. Begin with a transparent ink asset or simple original vector marks. Retain existing artwork and its final appearance; no broad asset conversion in the first prototype.

## Intentional events and lifecycle

| Trigger | Behavior |
| --- | --- |
| Explicit selection/search result | Materialize the selected annotation or added illustration detail once. Keep the existing geographic marker/label intact. Do not erase and redraw all artwork already visible merely to signal selection. |
| Successful creation of a personal landmark | Materialize its new ink once after the save succeeds. The stable location dot/name appears immediately. Reload shows the completed state; animation is not a persistence requirement. |
| Explicit deselection or replacement | Dissolve only the departing selection-specific ink decoration. Preserve the underlying public/personal landmark. A dissolve must never be mistaken for deletion of saved content. |
| Intentional local reveal of a nature vignette | A small added composition can gather once to acknowledge the explicit reveal. It is not an autonomous repeating weather effect. |
| Pan, zoom, density changes, culling, tile load, remount, page reload | Show the correct static result immediately. No entrance replay, exit animation or delayed labels. Ordinary camera discovery is not an apparition event. |
| Future room/object content | Reuse only where it explains user-directed reveal or concealment; no new memory feature is authorized by this brief. |

Keep logical selection/content separate from animation state. Use a stable event token such as `{placeId, action, sequence}` at the application/selection level, consumed once; do not infer animation from a component mounting or `selected === true`. Keep the consumed-token registry above the culled marker subtree for the current session. No storage migration or saved “has animated” flag is needed.

Minimal visual lifecycle: `absent → entering → present → exiting → absent`, with progress held outside a remounting decorative node. Same-event interruption reverses from current progress with the **same mask field**, not a newly randomized dissolve. A camera gesture settles decorative effects immediately to their logically correct endpoint; camera performance wins.

For A→B selection, update semantic selection, name and focus immediately. If retaining A for a short exit, keep only one immutable outgoing decorative snapshot, `aria-hidden`, noninteractive and owned by its original ID; never leave an old form or active button behind. B begins without waiting for A. Cap overlap at one incoming and one outgoing patch; discard superseded visual ghosts immediately. An exit is never a prerequisite for saving, closing or navigating.

## Practical rendering contract

Prefer one local alpha-mask mechanism with **two artwork-aware regions: dense pigment and fine contours**. It can serve original vectors and transparent illustrations without a new engine or dependency. In the first original vignette, author fills and strokes as separate groups. Do not impose automatic color-threshold extraction on the whole landmark library.

1. At asset preparation/first use, create a small **deterministic scalar field**, roughly 96×96, combining distance from two or three seeds inside dense ink areas with fixed low-frequency boundary variation. Add a separate authored timing field for fine-line regions. Normalize locally so the text/contours do not wait on one global expanding circle. The seed depends on stable asset/place identity, never time or camera position.
2. Precompute about **20–24 small alpha masks** that combine the dense-field threshold and fine-line schedule with a narrow soft edge. The source artwork remains fixed and opaque wherever revealed. The mask exposes only existing ink: counters and negative-space lettering remain paper. The dense mask coalesces first; line clusters continue resolving toward the end. Reverse progress through the same cached sequence for the designed exit, rather than claiming a filmed disappearance.
3. During an event, composite the cached ink bitmap with one or two cached neighboring mask frames inside a **local canvas/surface**, or use an equivalently bounded local mask. A small crossfade between adjacent masks may smooth quantization. No per-frame procedural noise, geometry construction or full-image pixel loop.
4. On completion remove temporary effects and show the original static artwork. Restore the ordinary rendering path, not a permanent animation canvas for every place.

Initial budget: **one effect group**, at most two local patches; typical patch ≤320×240 CSS px; effective DPR ≤1.5; total animated backing pixels ≤350,000. About 24×96×96 RGBA mask frames are under 0.9 MB per shared bank. Keep a small shared bank and bounded cache, not one bank per map feature. Target **≤2 ms total effect work per frame** on the main task's current test device; this is a measurement gate, not a proven result. If it exceeds budget, lower mask/patch resolution or settle to static. Limit effect lifetime to ≤700 ms and stop its frame loop when idle/hidden.

Never animate base geographic tiles, regenerate vector geometry per frame, add React camera-frame reconciliation, resize canvases on every move, or run full-map SVG turbulence/blur/displacement filters. Keep the existing opaque tile cache, blending correction, geographic coordinates and camera-follow path intact. Fixed masks must not develop tile seams or make the coast swim.

## Coordinate V3 material and nature

### Material fingerprint, grounded in the references

**First implementation test: expose the existing material.** Direct inspection of `atlas/public/assets/parchment.webp` shows a usable light honey field, broad cloudy variation, fine flecks, darker edge wear and faint cross-folds. The current `.atlas-app` background in `styles.css` covers it with `#efdfbcdd`, approximately **87% opaque** pale color. This suppresses the asset's variation before the map is composed. Start with a materially lower tint opacity (about 20–35% as a reversible trial), retaining the same texture and geographic blending. Compare the closed-card, paused map against recording 5.77 s before adding new textures or effects. Adjust warmth from that rendered comparison; removing the veil entirely is not automatically better. The existing faint folds may remain as part of the supplied paper texture if they stay subordinate to streets. Do not add stronger arbitrary seams across the map; reserve dimensional crease shadows for actual folding UI.

The **blank-paper recording frame at 5.77 s** is the clearest material reference: a light golden/cream ground has broad uneven warmth, local darker marks, worn boundaries and a pronounced central crease/shadow before the drawing appears. Individual physical fibers are not reliably resolved at this recording scale. At 8.08–10.39 s the dark irregular pigment masses become much stronger than the paper variation, while fine contours remain legible. The overall cast is affected by film lighting; do not sample a shadowed crease as the base-paper color.

The previously inspected user cover reference has a broad warm tan field, smaller uneven mottling, localized edge wear, strong crease lines and a deep architectural ink mass against fine hatching. The Pettigrew close-up keeps the ribbon's middle relatively clear while folded ends carry dense ink; its brown/olive cast may partly reflect film lighting. The [inspected Noble Collection photograph](visual-director/08-replica-open-folds.png) shows warm ochre paper, repeated creases and darker narrow valleys where leaves overlap. Those valleys demonstrate depth/shadow; they do not establish the pigment color of flat paper.

The [MinaLima designer account](https://minalima.com/product/the-marauders-map/) was refreshed for this pass: it identifies the red-ink cover, medieval-map drawing influences, the architectural enclosure and handwritten script. Its current product is an art print, so its stated paper stock is not evidence of the original film prop's material. Additional gallery links were located but not visually inspected here; no new gallery-image observations are claimed.

Transfer this into **three controlled scales**, not a stronger beige veil:

| Scale | Recommended original treatment | Restraint |
| --- | --- | --- |
| Sheet | Light warm honey paper, with a few broad uneven areas of slightly warmer/darker tone. Suggested displayed starting colors: clear field `#E8CEA7`, light reading areas `#EFE0BD`, occasional warm variation `#D7B47E` at low opacity. | These are art-direction targets, not sampled/calibrated prop colors. Keep names and controls on clear paper. Avoid a uniform yellow cast or edge-to-edge brown wash. |
| Crease and wear | Narrow crease shadow beside a lighter ridge on actual folding UI; very restrained local wear on sheet edges. | Physical seams belong to folding elements. Do not place dark random fold lines across streets or falsely suggest the island is sectioned into panels. |
| Fiber and ink | Fine static grain/fibers subordinate to the smallest useful letter; dark walnut/oxblood anchors plus dry, broken peripheral ink in original drawings. | Keep core strokes crisp. Visible film/photograph texture does not prove microscopic ink absorption; avoid claiming a wet-ink simulation or blurring every edge. |

**Concrete layer stack, bottom to top:** (1) stable warm substrate; (2) two or three broad nonrepeating translucent ochre/tan mottles across a representative view; (3) sparse smaller stains/dry edges, kept outside text/control clear zones; (4) very fine static grain, less contrast than fine map ink; (5) geographic ink and nature; (6) opaque clear-paper selection ribbon and functional UI. A starting mottle treatment can use 80–240 px irregular areas at roughly 8–18% tint opacity; adjust from actual rendering, not as a hard authenticity number. Grain can remain subtle while larger material variation becomes unmistakable. Bake/precompose the paper treatment or use a cached static texture, never dynamic noise/filter work. Draw crease shadows only where a sheet actually folds; do not run a decorative fold across the geographic canvas.

The desired density contrast is **clear field → fine engraving → a few confidently dark strokes**. Stronger material identity should remain visible in clean negative space and in the way ink meets paper, not by hiding geographic detail. Inspect the composed still before introducing movement. Use existing/original material artwork; no protected film frame or product photograph becomes a production texture.

Nature's normal state is a **composed static ink drawing baked into cached geography**, not hundreds of animated sprites. Choose a first coast/beach/park region from actual source geometry. Confirm the mapped beach/green polygons before placing marks; if the data lacks a boundary, omit that treatment instead of inventing it.

- **Water:** small groups of two or three uneven wave crests/current curls inside actual water, with a dark short gesture and lighter companion marks. Leave broad gaps of clear paper. Do not repeat one symbol at every grid cell or imply measured current direction.
- **Beach:** local bands of stipple/raked marks on mapped sand, tapering density toward open paper; no invented beach area and no motion on the coastline itself.
- **Green areas:** a few palm/tree-crown groups with stronger trunk/branch anchors and finer botanical hatch, clipped or safely placed inside mapped green areas. Treat these as illustrative vegetation symbols, not surveyed individual trees/species.
- **Paper:** strengthen tactile identity through static fibers, restrained creases and localized material variation below ink. Dark/light masses and negative space should supply character. Do not restore the obscuring overlay or use moving paper texture to simulate enchantment.

Bake these compositions deterministically at tile creation and reuse them. At most a small attention vignette near the explicitly selected place should use apparition; established landscape detail remains still across pan/zoom. Nature placement and ink motion are separate changes with separate evidence.

## Compose with existing folds

Start physical opening immediately. Begin optional ink gathering on the exposed interior portion roughly **60–100 ms** into the fold; overlap the motions so the combined transition finishes within **700 ms**, rather than adding their durations. The heading, close control and essential text stay readable and operable throughout. On closing, allow ink to recede during the existing fold, with no extra waiting period. Never dissolve the paper sheet itself when the intended action is a physical refold.

For reduced motion or the existing Pause setting, show the correct final static appearance immediately and preserve all labels, selection cues, content and keyboard focus. Static ink and paper must carry the identity without animation. Existing markers remain recognizable while selection-specific decorations change.

## First prototype and acceptance

**First composition:** use the Lummus Park/Ocean Drive coastal region if its actual source layers supply the required water, sand and green boundaries. Compose one small offshore group of wave crests, one tapered band of beach marks, and one park-side palm/crown group, leaving a substantial clear field between groups. Use dark short accents within each group and lighter supporting lines, at distinctly different scales. Keep them off streets, landmarks and label reservations. Their normal state is static. Missing source boundaries mean omission, not guessed geography.

Implement one selection-specific ink annotation/vignette there with separated dense accents and fine lines. Keep the baseline landmark and landscape static. Use the same effect once on a successful new personal-landmark creation only after the first annotation behaves correctly. Do not spread it to all marker mounts.

**Coequal material gate:** capture the same region before/after at the same zoom and viewport, with all animation paused and the place card closed. Compare beside the blank-paper 5.77 s reference and the fully developed 10.39 s frame. The new map must show clear warm paper, visible broad variation/local wear, convincing ink-to-paper contrast and deliberately composed nature without a blanket tint, repeated wallpaper pattern or obscured streets. A pleasing motion cannot compensate for flat parchment. Verify labels/controls remain comfortably readable on their actual worst underlying patch, with appropriate text contrast. Then evaluate motion; do not mark V3 complete from a texture change alone.

Focused acceptance sequence:

1. Select A: dense accent pools grow and connect while fine strokes resolve on overlapping schedules; its name and location are immediately clear. At roughly 25%, 50% and 75%, verify an already-solid local mass beside still-incomplete detail, not a straight wipe, uniform fade or evenly distributed pixel dissolve. Final artwork must match its static source, including paper-colored counters/negative spaces.
2. Deselect at full appearance and again halfway through appearance: only the transient ink dissolves; the base landmark remains. Reverse immediately and verify continuous progress with no reseeded pop or queued cycle.
3. Select A→B→A quickly: one correct semantic selection, no stale content/focus, at most one outgoing ghost, camera unchanged.
4. Pan/zoom away and return across a density threshold: markers appear statically with **zero remount replay**. Repeat with animation interrupted by a camera gesture.
5. Pause/reduced motion: correct instant endpoint and complete readable controls. Inspect desktop and mobile patch size. Measure effect cost during one already-established navigation check; do not rerun unrelated persistence/room suites.

Main should capture a short actual sequence plus a final still and record frame-cost evidence. A static screenshot alone cannot validate this effect. Mick's judgment of the live motion is the artistic gate. A separate unverified study is omitted to keep the prototype and its validation in the main task's working browser.
