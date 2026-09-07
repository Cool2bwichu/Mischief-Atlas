# Priority visual direction — a drawn, living atlas

September 7, 2026. User-requested priority refinement. Research and implementation brief; not a claim that the app has been redesigned or visually verified.

## User feedback and intent

Mick reports that the obscuring overlay is gone but the map now feels stale. He wants the Marauder's Map spirit to provide a **strong visual fingerprint** throughout the atlas, including the island's appearance, drawing style, typography and film-inspired movement. Removing the overlay must not remove atmosphere or character.

Supplied visual references, inspected in the conversation:

- `/Users/mick/Downloads/Harry-potter3_map_pettigrew.webp`: curled name ribbon, expressive calligraphy, dense directional lettering, dark brown ink and warm paper.
- `/Users/mick/Downloads/Marauder%27sMap.webp`: architectural illustration surrounding the title, large ink masses balanced against fine hatching, winding text, material folds and wear.

These are style references, not instructions to reproduce the Hogwarts geography or named fictional content. Retain Mischief Atlas's identity and recognizable real Miami Beach geography. Apply expressive treatment to the island contour, coastal edges and surrounding water without relocating landmarks or changing geographic relationships.

## Primary-source research

1. [MinaLima's design account](https://minalima.com/de/product/the-marauders-map/): describes medieval-map ink influences, an architectural frame around the title, and handwritten script. This supports treating drawing and typography as one composition.
2. [MinaLima on the map's contents](https://minalima.com/fr/product/gift-wrap-the-marauders-map/): describes swirling lettering and hand drawing based on the film set's footprint. Transfer the relationship between expressive drawing and a grounded spatial plan.
3. [Official film discussion](https://www.harrypotter.com/features/6-ways-harry-potter-films-look-different-after-you-read-the-books): explicitly identifies roaming footsteps and hidden corridors in the film treatment.
4. [Official object reference](https://www.harrypotter.com/fact-file/objects/the-marauders-map): describes deliberate reveal/hide activation and movement tracking. Adapt the interaction principle to user navigation and future recall paths, not surveillance or invented live activity.
5. [Official film clip](https://www.youtube.com/watch?v=vNc43oKqQzg): located and opened on the verified Harry Potter channel. Playback/frame timing was not successfully analyzed in this side task. Inspect the actual sequence before claiming specific film timing, easing, or drawing order. The motion suggestions below are design proposals, not measured reproductions.

Research also saved to the existing Forme project `e0f20afd03e3c1bd`, MinaLima reference `4d8d70828d45550f`. The initial Awakening City reference remains valid; these new user references refine its visual grammar. Ignore unrelated starter-library references unless independently relevant.

## Translate the fingerprint into the app

| Surface | Direction |
| --- | --- |
| Island and coastline | Give the real contour a confident hand-inked silhouette, local variation in line weight, selective coastal hatching and restrained echo contours in the water. Preserve geographic anchors and stable drawing across pan/zoom. |
| Streets and buildings | Establish strong major routes, finer minor streets and legible building outlines. Use selective hatch/shadow rather than uniform pale geometry. Avoid random per-frame wobble or an equally dark outline around everything. |
| Architectural landmarks | Original Miami silhouettes with the same ink weight, hatch language and tonal hierarchy as the map. Let a few landmarks carry richer illustration; simpler places remain quiet. |
| Typography | Make lettering part of the cartography: clear geographic labels, expressive place titles, limited curved annotations and a restrained selected-place ribbon. Keep functional controls readable; do not make every label decorative. |
| Paper | Warm paper with believable restrained material variation beneath the drawing. Fold/wear accents should support composition without reintroducing a cloudy overlay or obscuring useful detail. |
| Tonal composition | Use deliberate dark ink anchors and breathing room. A uniformly beige rendering will not recover the reference's character. |

## Three candidate signature interactions

1. **Ink arrives where attention goes:** a short local reveal when a place is selected or first introduced. The user can interact immediately; ordinary dragging does not replay the full entrance animation.
2. **Footsteps advance as discrete marks:** a sparse sequence along meaningful routes, with older marks fading behind. Preserve the distinction between current illustrative traffic and future user-directed recall walks.
3. **A place opens like drawn paper:** a compact annotation or ribbon resolves into the place sheet, later connecting to room unfolding. Keep transitions spatially intelligible, interruptible and restrained.

These must work as an expressive static map when paused or reduced motion is enabled. Do not animate the island geometry continuously, create visual swimming during pan, or use effects to disguise navigation lag.

## Ownership and acceptance

The work task **Mischief Maintained** owns application edits. This side task supplies research, reference interpretation and priority documentation only. Following Mick's explicit request, a dedicated **Visual Director** agent has now started on Astra High to own the focused research and art-direction study. Its pending deliverable is `VISUAL-DIRECTOR-BRIEF.md`, with evidence under `visual-director/`. Avoid two tasks editing the same map implementation independently.

Before editing, capture the current result as a baseline. First demonstrate the revised fingerprint on one representative South Beach view and the whole-island view. Validate selection and movement as well as still appearance, then inspect a mobile composition. Compare with both supplied references for ink confidence, architecture, typographic character, material restraint and motion purpose. Preserve saved landmarks/rooms, placement/search, responsive controls, attribution and fluid navigation. Record evidence and user-review status in the shared guide.

This pass takes priority over adding future room/weather features. It is a refinement of the current map identity, not a new deployment or an instruction to rebuild the application.
