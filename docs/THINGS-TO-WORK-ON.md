# Mischief Atlas — Things to work on

Shared project guide · Last updated: September 7, 2026

Also known in conversation as **Where are we with the project?** or **the project list**. This single guide serves both progress reporting and the backlog.

- **"Where are we with the project?"** Read this guide, check current evidence where needed, and summarize completed work, active work, next priorities, and blockers/decisions. Identify stale or unverified status rather than repeating it as current fact.
- **"Add this to the project list."** Record the idea here with context and an appropriate status. Adding an item does not itself start implementation.
- **"Show me the guide."** Link to or open this file.

These are ordinary conversational requests, not exact commands; equivalent wording should work. Keep one maintained guide rather than creating a separate file for each name.

## Start here

Mischief Atlas is a personal memory palace built around familiar places. Its purpose is to keep meaningful books, films, passages, people, knowledge, and life experiences actively retrievable. The map gives them a familiar home; the eventual recall experience makes that home useful.

Mick loves the current first pass and wants to develop its identity, not replace it. Preserve Awakening City's parchment, walnut and oxblood ink, serif lettering, restrained handwriting, illustrated Miami landmarks, and sense of enchantment. Real geographic geometry remains the foundation.

**Current state:** V3/V4 have received a second local pass after Mick rejected the sparse/static water and imperceptible ornament in the first prototype. The revised pass is ready for Mick to review in **Mischief Maintained**, task ID `01a07a0f-8b1c-7c40-b4b3-128561e7af5e`. The earlier V1/V2 release remains published. **Review hold: Mick explicitly requested pausing further development after this pass. Do not extend, merge or publish the new pass until he reviews and gives further direction.**

**Next creative milestone:** prototype one illustrated room with five interactive objects, then grow toward one house, three rooms, and fifteen stable memory locations. The room direction is endorsed for development; its detailed interaction and visual design still need to be demonstrated.

**Not built yet:** actual memory entries, mnemonic placement, recall walks, scheduling, durable backup/export, and synchronization. Named rooms in the current prototype are not a complete memory system.

This is the operational progress guide. [WORKING_VISION.md](WORKING_VISION.md) explains the product hypothesis; [ROADMAP.md](ROADMAP.md) preserves the larger phases; [DECISIONS.md](DECISIONS.md) records durable choices. Older lists can contain unresolved or superseded ideas. Use the dated decisions and verified evidence, and resolve contradictions rather than silently assuming old plans are current.

## How to maintain this guide

- **Existing:** implemented in the baseline, with evidence/limitations noted below.
- **In progress:** an active task owns the work; completion is not yet verified here.
- **Planned:** agreed direction still to implement or refine; not a claim that it exists.
- **Explore:** a promising approach whose final form is not settled.
- **Parked:** intentionally outside the immediate scope.

After each meaningful milestone, update the relevant row, add the evidence and remaining limitations, and append a short dated progress entry. Record user review separately from technical completion. A successful build alone does not establish that a visual experience works well. Keep checks proportional to the change.

Before work, confirm current files and active task status. Avoid overlapping edits with another task. A backlog entry does not authorize starting every feature, deploying, changing the audience, or recording private memories.

## Preferred tools

User decision, September 7, 2026: use these capabilities when they fit the work.

| Capability | Use it for |
| --- | --- |
| Forme | Focused visual references, evidence, design rationale and continuity. |
| Image generation | Cohesive landmark illustrations, room cutaways, furniture and mnemonic artwork. |
| Browser verification | Inspect actual interactions, map placement, navigation, responsive layouts and persistence with the available browser tools. |
| Product Design | Explore room/building experiences, develop visual ideas and critique product flows before or during implementation. |

Read the relevant skill before applying a workflow. Use the smallest useful combination for the task; do not repeat research, image generation or verification without a concrete need. Figma and Cloudflare remain possible later additions, not installation requests. This preference does not change model settings or expand the current feature scope.

## What we already have

| Capability | Status | Evidence and limits |
| --- | --- | --- |
| React/Vite app with Leaflet navigation and custom geographic rendering | Existing | Source under `atlas/src/`; bundled map geometry, fonts and artwork. |
| Miami Beach map opening on South Beach, with whole-island view | Existing | Local browser render confirmed in the original setup task. |
| 26 curated searchable places and six landmark illustrations | Existing baseline | Baseline inventory from the local handoff and source inspection; update this count after the active refinement pass. |
| Pan, zoom, search, landmark selection and place cards | Existing | Baseline interactions documented in `atlas/design-qa.md`; local opening render confirmed September 7. |
| Rename a place, unfold its card, create and inspect named rooms | Existing | Source inspection and user feedback confirm the current room experience. Interiors are illustrative; rooms do not yet hold actual memories. |
| Browser-local aliases and named-room storage | Existing, provisional | Stored under `mischief-atlas-v1`; no backup or synchronization. Origin/browser-specific. |
| Living ink, street-following footprints, pause and reduced-motion handling | Existing | Baseline source and QA documentation. Traffic is simulated, never live. |
| Local installation and preview | Completed setup | Original task installed with Node 22 and opened `http://127.0.0.1:5173/`. Recheck server availability before reuse. |
| Initial visual direction | User approved as a starting point | Mick described the first pass as exceeding expectations, then requested the refinements below. This is not final design sign-off. |

Baseline test/build and desktop/mobile results in `LOCAL-HANDOFF.md` and `atlas/design-qa.md` are historical evidence, not fresh validation of later changes. Existing hosting files are preserved; current work is local and does not request a deployment.

## Current pass — make the map a better place to explore

The active work task owns implementation. M1–M4, the initial navigation pass, and V1/V2 are implemented with focused local checks. Mick approved this release; further art-direction work is tracked in V3. The director’s original pale-map screenshots are a before-state; the renderer has since changed.

| ID | Work | Status | What a good result must demonstrate |
| --- | --- | --- | --- |
| M1 | Title becomes an opening moment | Implemented; browser checked; user approved September 7 | Keep the large initial title, then fold/withdraw it during exploration. Retain compact identity, accessible search and a clear return path. The geography gains usable space. |
| M2 | Parchment belongs to the cartography | Implemented and visually inspected; user approved September 7 | Land, water, streets, buildings, coastlines and lettering share a coherent paper-and-ink language. Subtle material texture is welcome; a muddy overlay should not obscure geographic detail. |
| M3 | A more inhabited city | Implemented: 792 additional snapshot places; zoom/search checked | Increase meaningful place detail using a hierarchy: major illustrations, smaller neighborhood places/symbols, and finer labels/detail appearing with zoom. Prevent collisions and preserve geographic provenance. |
| M4 | Bottom-right toolkit: Add a landmark | Implemented; keyboard/pointer/search/reload checked | A compact, working tool lets the user choose a location, name it and save it. Include clear placement feedback, cancellation, keyboard/touch access, immediate map display, search, place cards and reload persistence. Preserve existing aliases/rooms during storage changes. |
| M5 | Effortless exploration | Initial pass implemented and browser checked; user approved September 7 | Refine pan/zoom feel, search, selection, returning to familiar locations and the amount of detail revealed at each scale. Check orientation, responsiveness and predictable back behavior. |
| M6 | Personally meaningful places | Planned; M4 provides a foundation | Add a purpose/subtitle, such as a home for film memories. Keep geographic identity alongside personal meaning. Consider a restrained distinction between existing places and places claimed for memories. |
| M7 | Readability and composition review | Revised desktop/phone inspected; user approved September 7 | Inspect landmark scale, label collisions, street detail, contrast and place-card occlusion on desktop and mobile. Preserve the existing visual character. |
| M8 | Fluid map navigation | Targeted optimizations implemented; revised navigation inspected; no controlled FPS claim | Investigate lag and zoom/drag hiccups after the refinement work. Measure the active rendering paths, reduce avoidable work, and validate navigation in the browser. Do not mask slow work with more animation. |

Implementation evidence, September 7: four original personal-landmark drawings are integrated with a selectable chooser and least-used default. The catalogue contains the original 26 anchors plus 792 additional public locations, each with exact bundled-snapshot provenance and stable identity. Browser checks used a separate port 5174 so synthetic QA landmarks did not enter the user’s port-5173 atlas. Keyboard and pointer placement, empty-name rejection, cancellation, chosen illustration, search, reload persistence, and 390 × 844 / desktop compositions were inspected. Eight model tests and four hosting tests passed; production build passed with a non-blocking large-JavaScript-chunk warning. Reduced-motion emulation switched the app to its static state. These checks do not establish final V1 visual approval or real-device performance.

Performance changes: avoid React reconciliation on camera frames; update visible marker positions directly and reconsider label density at movement end. Cache footprint route distances, keep canvas allocation tied to size changes, cull offscreen vector geometry, defer tile rebuilds until zoom settles, and bound raster reuse to 48 tiles. Opaque tile backing within the multiply-blended map surface prevents retained transparent zoom levels from bleeding through. New artwork web delivery is about 1.7 MB versus 10.6 MB of source PNGs. Profiles identified the work to remove; the before/after captures are not a controlled FPS benchmark.

Current limits: four reusable personal illustration choices, not on-demand unique generation; browser-local storage remains unbacked-up and unsynced; snapshot businesses are not a live directory. Existing aliases/rooms are preserved by migration checks. Timestamps (T1), weather (W1) and room/memory expansions remain backlog work.

## Priority visual refinement — strong map fingerprint

**V1 · Status: Implemented; main-task desktop/phone review passed; user approved September 7; independent follow-up unavailable.** September 7, 2026. Mick reports the map feels stale after the overlay removal and explicitly wants the two supplied Marauder's Map references to define a strong visual fingerprint throughout the map.

Read [the visual fingerprint brief](design/2026-09-07-visual-fingerprint.md), including both local reference-image paths and primary-source research. Apply coherent expressive ink to the island contour, streets, architecture, typography, annotations and purposeful motion. Preserve recognizable Miami Beach geography, existing functionality and fluid navigation. Do not restore the muddy overlay.

This is priority steering for **Mischief Maintained**, ahead of future room/weather expansion. The separate M8 navigation concern remains relevant; visual richness must not worsen lag. Compare a current baseline with the revised South Beach and whole-island views, inspect interactions and mobile, and record actual evidence before marking complete.

Mick explicitly requested a dedicated **Visual Director**, including responsibility for research. Agent `visual_director` completed its first assignment on **Astra High** in the side conversation. Its [visual brief and folding addendum](design/VISUAL-DIRECTOR-BRIEF.md) have been written, read and handed to **Mischief Maintained**, with eight evidence images under `docs/design/visual-director/`; local evidence links were checked. The main task owns material continuity, ink hierarchy, cartographic refinement and appropriate fold implementation. The agent owns research, art direction and read-only visual inspection; **Mischief Maintained** owns application implementation. A completed brief does not mean the app changes are complete or approved. Main-reported compositing changes after the director's screenshots are explicitly distinguished from the captured before-state.

**V2 · Parchment folding and unfolding — implemented and behavior checked; user approved September 7.** Mick explicitly asked the Visual Director to find online examples of the Harry Potter map's distinctive physical folding/unfolding and adapt that motion to opening and closing atlas elements where it makes sense. The brief cites official film samples at 1:07, 1:22 and 1:27 plus a manufacturer's physical replica with nested folds. Recommended first demonstration: a fixed identity spine and two overlapping hinged leaves for a place sheet, reversed closing, a simpler upward toolkit flap, and one horizontal mobile hinge. Exact film timing was not measured; app timings/order are proposals. Preserve content readability, focus, rapid interruption/reversal, touch access and reduced-motion alternatives. Future room cutaways remain a later milestone. The place sheet now uses two reversible decorative hinges over stable semantic content, with one horizontal hinge on mobile. Its exterior artwork also opens/refolds over the existing illustrative interior. The toolkit uses a short upward utility flap. Five open/close cycles, two rapid reversals and switching places during opening were exercised; the map camera transform stayed unchanged. Mobile, Escape/focus return and reduced motion were checked. These changes do not implement future room cutaways.

## Next visual pass — expressive parchment and nature

**V3 · Status: Second local pass implemented and checked; awaiting Mick’s review.** September 7 feedback after approval of the current release: the visuals are improving but do not yet have the full desired Marauder’s Map character. Mick wants a stronger parchment identity and expressive illustrations of water and other natural elements. This refines the next visual direction; it does not withdraw approval of V1/V2.

The first static, sparse coastal composition was insufficient in Mick’s review and is superseded by [LIVING-PARCHMENT-BRIEF.md](design/LIVING-PARCHMENT-BRIEF.md). The new continuous worn-paper asset has irregular central mottling, fibers and restrained folds under a light 8% tint. Three evolving water stroke families now cover the available geographic water polygons across the island. Their shapes change over 4.2–6.6-second cycles, with dark crest heads and finer companion strokes. Full motion envelopes are water-clipped and clear of labels/controls; bounded cached frames animate at 24 paints/second, freeze during gestures, follow the camera and resume afterward. Static sand/vegetation detail remains on mapped areas.

The landscape must carry its identity with the panels hidden. Preserve real geography, readable routes and labels, negative space, stable world-anchored patterns and the navigation budget. Avoid uniform texture wallpaper and invented terrain. Consider restrained coastal motion only after the still composition works; retain pause and reduced-motion behavior. Weather (W1), new rooms and memory objects remain separate work.

Further user emphasis: the Visual Director must make the parchment look and feel as close to the supplied real-map references as practical, then give the main orchestrator a concrete treatment to implement. Compare paper hue/tonal depth, mottling, fibers, fold creases, edge wear and ink contrast/absorption. Strong tactile identity is a requirement, not an optional subtle finishing texture. Distinguish cinematic lighting from paper characteristics; keep material beneath the ink and essential labels readable. Earlier suggested texture-intensity numbers are starting proposals, not restrictions that override this feedback. Judge a before/after representative view against the references before extending the treatment.

### Ink that dissolves and appears

**V4 · Status: Actual place-card illustration effect implemented and checked in the second local pass; awaiting Mick’s review.** Mick supplied [Every Marauder's Map Scene](https://www.youtube.com/watch?v=HmGrtROhey0) as an explicit visual reference and asked the director to perfect the way elements dissolve away and appear into existence, then hand it off for implementation.

The director inspected the user’s actual recording: separate pigment pools join into dense masses while lettering and finer architecture resolve on overlapping schedules. The recording includes a backward scrub, not an observed disappearance; the new inverse erosion is explicitly an original adaptation. Recording-relative evidence, material comparisons and timing limits are in the finalized brief.

Evaluate use on selected landmarks, annotations and restrained water/nature drawings where it explains attention or state. Keep real geographic geometry stable, interaction immediate, content and focus intact, and reduced-motion/paused states fully readable. Coordinate this ink behavior with the existing physical folds without stacking long delays. Avoid full-map animated filters, unbounded particles, per-frame geographic regeneration or new navigation lag.

Read [INK-APPARITION-BRIEF.md](design/INK-APPARITION-BRIEF.md) for recording provenance and [LIVING-PARCHMENT-BRIEF.md](design/LIVING-PARCHMENT-BRIEF.md) for the revised scope. The inadequate small selection ornament has been removed. The actual large exterior illustration on each illustrated place card now gathers from image-derived pigment regions over 1.1 seconds, with separate dense/fine masks, and erodes over 680 ms on close. White image backing becomes transparent, leaving stable paper beneath. Paper remains open briefly before folding; semantics and inertness close immediately. Same-place reversals retain progress; switching places replaces the prior illustration immediately. Pause/reduced motion settle into a static endpoint. This does not animate whole-map geography, room objects or unillustrated cards. **This local pass is finished; development is paused for review again.**

## Next — landmarks become small worlds

Mick endorsed developing the room idea and requested that it be retained here. Begin with a small interactive demonstration; do not silently treat the examples below as completed features or as the user's actual memory content.

**Creative direction:** a landmark can contain an imaginative interior larger than its exterior suggests. The geography outside is real; the personal memory interior can be invented. Its layout should become familiar through use.

| ID | Work | Status | Direction and acceptance |
| --- | --- | --- | --- |
| R1 | Unfold a building into an illustrated cutaway | Explore, user-endorsed direction | Reveal rooms, a staircase or courtyard from the building illustration. Select a room to approach it while preserving a visible route back. Demonstrate the transition before committing to the final architecture. |
| R2 | Rooms have recognizable personalities | Planned exploration | Start with a few distinctive types: screening room, greenhouse, observatory, kitchen or study. Let the user name and eventually furnish them. Appearance should help distinguish the room's purpose. |
| R3 | Stable objects hold memories | Planned | A projector, windowsill, armchair, globe, painting or desk becomes a specific memory location. Prototype five objects in one room before expanding. Placement/moving must have click/tap and keyboard alternatives to dragging. |
| R4 | Small interactions reveal content | Explore | Pull a book, lift a frame, or switch on a projector. Select a few consistent interactions with visible affordances; avoid making content dependent on guessing a hidden gesture. |
| R5 | A coherent map-to-memory journey | Planned | Map → building → room → object → memory. Always show where the user is, how they arrived, and how to return. Preserve context, focus and navigation history. |
| R6 | User authors the interior's meaning | Planned | Offer room/object and mnemonic suggestions, but let the user choose what belongs where. Do not fabricate autobiographical content or infer private memories. |

**Illustrative example, not user data:** The Colony could become a Cinema House, with a lobby for discoveries, a screening room for favorite films and a writing room for script passages. Each object inside a room would anchor an association the user chose.

**Spatial rule:** once a memory is placed, its location stays stable until the user deliberately moves it. Do not automatically rearrange objects, change room geometry, or randomize familiar cues during revisits. Enchantment must preserve orientation.

**First demonstration gate:** one illustrated room with five distinct interactive objects, a clear entry/exit, readable empty/selected states, and accessible interactions. Judge whether being inside the atlas is compelling before producing a large library of interiors.

## Then — prove that the atlas helps its owner remember

| ID | Work | Status | Direction and acceptance |
| --- | --- | --- | --- |
| C1 | Capture, encode and place a memory | Planned | Add meaningful content and its source, choose or create a vivid personal association, and place it at a stable object. Preserve original content separately from its mnemonic cue. |
| C2 | A short recall walk | Planned | Guide the user through objects while withholding answers until they have attempted recall. Recognition alone must not be counted as successful recall. |
| C3 | Enchantment communicates useful state | Planned | Footsteps guide the chosen route; unfolding explains entry; ink richness or a lit window can reflect recorded recall activity. Make state understandable without relying only on color or motion. Avoid arbitrary magical effects. |
| C4 | Scheduling and a humane revisit ritual | Planned | Create a lightweight reason to return, with recall history and confidence tracked separately. Settle scoring and scheduling through focused design and evidence; no streak pressure or leaderboards. |
| C5 | One complete palace | Planned | Grow the successful room demonstration to one house, three rooms and fifteen memory locations. Prove capture → placement → later recall across repeated days before broadening the atlas. |
| C6 | Learn from recall difficulty | Explore, later | Distinguish weak cues, sequence/name difficulty and interference where the user's results support it. Suggest better encoding without pretending to measure memory strength precisely. |

## Dependability — required before relying on real memories

| ID | Work | Status | Direction and acceptance |
| --- | --- | --- | --- |
| D1 | Reliable storage, export, backup and recovery | Planned | Choose the personal-alpha persistence model. Test recovery and safe migrations; browser storage alone is not a durable archive. |
| D2 | Complete keyboard, touch and reduced-motion behavior | Partly existing; ongoing | Verify each new flow, including placement and room interactions. Use readable labels, visible focus, sensible focus return and touch-sized targets. |
| D3 | Performance and graceful fallbacks | Ongoing quality requirement | Keep geographic exploration responsive as artwork and place density grow. Test meaningful viewports and avoid expensive continuous effects. |
| D4 | Privacy and authorship | Existing rule; ongoing | Keep private memories/media/credentials out of the public repository. Make persistence and any future AI processing boundaries explicit. |

## Planned addition — creation dates and times

**T1 · Status: Planned, not started.** Requested by Mick on September 7, 2026. Applies to user-created landmarks and future memory/note entries; complements M4 and C1.

- Automatically record the date and time when a landmark or memory/note is first successfully created. No manual date entry should be necessary.
- Show a discreet creation annotation in its detail view, with a readable local calendar date, day of week and time. Keep timestamps out of the main map labels to avoid clutter.
- Preserve the original creation timestamp through renaming, editing, moving, reloading and future export/import. Track later edits separately if needed; never replace creation time with the last edit time.
- Store an unambiguous timestamp and retain the creation timezone so the original day/time can be interpreted correctly if the user travels or changes timezone. Format the display clearly for the user.
- Distinguish when an entry was created in the atlas from when the remembered event actually happened. A future event-date field must remain separate.
- For older entries without a recorded creation time, leave it unknown rather than inventing a date during migration or treating the migration time as the original creation time.

**Acceptance:** create a personal landmark or, once supported, a memory/note; confirm its displayed date/time; edit and reload it; verify that the original timestamp survives. Check legacy entries and timezone handling. Recording this feature does not claim memory entries already exist.

## Planned addition — living weather

**W1 · Status: Planned, not started.** Added at Mick's request on September 7, 2026. This promotes weather from a parked possibility to an explicit backlog feature; implementation timing is still to be chosen. Do not interrupt the current map/toolkit pass to build it.

**User's concept:** a neat, continuously visible weather presence on the map while connected to the internet, reflecting current South Florida conditions in the established Marauder's Map-inspired parchment-and-ink aesthetic. It should be minimal but noticeable, adding atmosphere without drowning the map in visual elements.

Requirements:

- Display the current temperature in **Fahrenheit (°F)** at the **top right** of the map, with a compact indication of the weather condition. Keep it visible during exploration; reconcile its placement with the existing island inset and other controls.
- Reflect real current weather from an online source. For the first Miami Beach territory, use a clearly labelled Miami Beach/South Beach location rather than implying uniform conditions across all South Florida. This is a proposed implementation default; the provider and exact reporting location remain to be selected.
- Rain: sparse, small falling **ink drops**, integrated with the paper-and-ink visual language.
- Cloudy weather: small, intermittent, gently drifting **ink clouds** over the map. Avoid a continuous opaque cloud blanket.
- Preserve the map's readability: streets, labels, landmarks, place cards and controls must remain easy to see and use. Keep effects sparse and restrained; they must not intercept map gestures or clicks.
- Use original artwork consistent with the atlas. Any additional condition treatments should follow the same restrained language rather than introducing an unrequested collection of effects.

Implementation/verification considerations, not yet completed:

- Select a suitable weather source and refresh cadence; show the reporting location and make freshness/source information available unobtrusively. Do not describe cached or unavailable conditions as live merely because the browser is online.
- On disconnect or fetch failure, use a clear offline/stale/unavailable state and keep map exploration working. The exact offline presentation remains a design decision.
- Respect the existing pause control and reduced-motion preference. Temperature and a static condition indicator should remain usable with animation off.
- Check rain, clouds, clear conditions, loading/failure/stale states, and desktop/mobile composition. Effects should remain performant and should not compete with existing footsteps or ink animations.

**Acceptance:** current °F temperature and a legible condition indicator remain in the top-right composition; weather-appropriate ink motion is visible but subtle; navigation and landmark reading remain unobstructed; freshness and offline behavior are honest; paused/reduced-motion use retains the weather information.

## Parked until the core experience works

- Life Chronicle: years and life chapters as explorable territories.
- People Palaces: shared experiences and the texture of knowing someone, without contact scoring.
- Recitation mode: reconstruct passages by walking their sequence of locations.
- Cross-memory connections and multiple palaces beyond the first useful one.
- Inkbound/BOOX handwriting as a future capture doorway.
- Live traffic, broader Wayward Atlas exploration, and optional symbolic creatures. Live weather has moved to the explicit W1 backlog above.
- Accounts and synchronization: consider with the persistence model when needed, rather than making them a prerequisite for the room experiment.

## Progress and handoff log

### September 7, 2026 — local continuation

- The ZIP working copy was extracted locally. Dependencies were installed using Node 22, the app started at port 5173, and the opening map was inspected in the browser.
- Mick approved the initial visual direction as a strong first pass.
- Map feedback: withdraw the title while exploring, integrate parchment into the cartography, and increase meaningful landmark density.
- Mick requested a bottom-right toolkit beginning with personal-landmark creation. This brief was sent to **Mischief Maintained**, which is actively implementing the map pass.
- Mick endorsed imaginative landmark interiors, room personalities, interactive memory objects and stable spatial layouts as the next creative direction.
- Mick requested this persistent shared guide, including the initial seven-part development plan, the map refinements, and the room ideas. This documentation task made no application-code changes.

### September 7, 2026 — weather added to the backlog

- Mick requested a persistent top-right Fahrenheit weather indicator and minimal, current-condition-driven ink rain or intermittent drifting clouds.
- Recorded as W1, planned and not started. Weather is no longer merely a parked concept, but its priority relative to the room experiment has not been decided. Current map implementation remains unchanged by this documentation update.

### September 7, 2026 — creation timestamps added to the backlog

- Mick requested automatic records of the time and day personal landmarks and memory/note entries are created.
- Recorded as T1, planned and not started, with original creation time preserved across edits and honest handling of older entries without dates. No application code changed in this documentation update.

### Next handoff

The active work task should finish and validate M1–M4, assess M5/M7, and update this guide with changed files, focused behavior checks, browser evidence, known limits and review status. Then review the map with Mick before starting R1–R4's one-room experiment. Do not start the later recall system solely because it appears in this backlog.

## Where future chats find this

Repository root `AGENTS.md` points here. Local tasks using this working copy should read this guide before continuing and update it at meaningful milestones. The app's instructions and local setup handoff remain applicable.

This guide is now committed and synchronized to the public GitHub repository. A ChatGPT project chat without access to this filesystem cannot automatically read it. To carry continuity into such a chat, provide the latest guide as project reference material; keep this working-copy file as the maintained source and refresh shared copies after milestones.


### September 7, 2026 — local implementation and final checks

- Added 792 source-matched public places (818 with the original anchors), progressive detail, compact exploration identity and four generated personal-building variants. Drawing prompts, original/delivery paths and provenance are in [the artwork record](design/2026-09-07-personal-landmark-art.md).
- Applied the director’s V1 brief in `InkMap.js`, `AtlasMap.jsx` and `map-refinements.css`: continuous warm paper, exact dark coast, sparse water-clipped engraving, quieter distant buildings, selective close-up hatch, larger street names, geographic arc lettering, one opaque selection ribbon and UI label reservations. No coastline jitter or cloudy mask. A selected ribbon relocates above the toolkit with a leader when necessary.
- Added V2 reversible place-sheet leaves, a horizontal mobile hinge, an exterior illustration that refolds over the existing interior, and the compact toolkit flap. Closed panels are inert and absent from the accessibility tree immediately; visual closing completes separately. Controls remain single semantic elements. Tool cancellation resets the next draft as before.
- Preserved the navigation optimizations during V1. Footprints now have a drawing budget of 48 marks on desktop / 30 on phones. Inspected immediate drag/zoom after folding and dense South Beach street rendering, with no browser errors observed. Performance profiles are diagnostic evidence, not a matched before/after FPS benchmark or a promise that no hardware will hiccup.
- Final production build and four hosting tests passed; eight data/model tests passed after the catalogue/performance changes. The build retains a non-blocking 688 kB JavaScript chunk warning (about 176 kB compressed). `git diff --check` passed.
- Reviewed opening, exploration, South Pointe selection, whole-island, 390×844 placement/chooser and static interior states. Five repeated card cycles, interrupted folding, a place change during opening, keyboard cancellation/focus and a fresh empty draft were checked. Earlier isolated-port save/reload evidence remains applicable; no synthetic records were added to the user’s port-5173 atlas.
- At the end of implementation, work remained local and uncommitted; the release entry below supersedes that state. Git origin is connected to `Cool2bwichu/Mischief-Atlas`; no new publication was performed. Weather, creation timestamps and the new room/object experience remain backlog items. Mick approved the result and authorized merging and updating the published versions on September 7.

- Optional fresh director inspection could not run because its browser surface was unavailable. The final visual checks above were performed by the implementation task; no independent director approval is claimed. The director’s earlier research and brief remain the basis for V1/V2.

### September 7, 2026 — release approved

Mick approved the completed refinement ("awesome") and requested merging and updating everything. This authorizes the repository merge and refreshing the existing published editions with their current audience. Release execution is underway; the subsequent release entry records verified outcomes. Backlog features remain separate work.

### September 7, 2026 — release completed

- [PR #2](https://github.com/Cool2bwichu/Mischief-Atlas/pull/2) merged into main as `5fe97876a378e949171166d414ebf8a3e61bbb84`; local main synchronized. It includes V1/V2, 792 added places, personal illustration choices and navigation optimizations.
- Enabled the existing GitHub Actions Pages configuration. [Run 34086826322](https://github.com/Cool2bwichu/Mischief-Atlas/actions/runs/34086826322) completed successfully. [GitHub Pages](https://cool2bwichu.github.io/Mischief-Atlas/) serves the validated Pages bundle, new personal illustration asset and map tile (HTTP 200).
- Refreshed the existing [Mischief Atlas Site](https://mischief-atlas.cool2bwichu1992.chatgpt.site) as version 2. Deployment `appgdep_6a9e4b66f6688191b2ba92e015de7de5` succeeded. Site source `080efd2fff9d71be4caa937c69b0e439798c85b2` is the app subtree synchronized from merged GitHub source. The current Site audience was verified public and preserved.
- The Site’s live HTML references the validated root-path bundle; a new illustration and bundled map tile return HTTP 200. A browser opening was queued in the implementation task. Existing browser-local records were not transferred, cleared or modified by publishing.
- Eight tests, four hosting tests and the Pages/root builds passed for the release. The non-blocking large-JavaScript-chunk warning remains. Local preview continues at port 5173.
- Mick’s latest stronger-parchment / expressive-nature feedback is recorded as V3, planned and not started. It is the next visual study rather than a claim that this release completes the ultimate art direction.


### September 7, 2026 — local parchment/ink prototype ready; review hold

- Branch `codex/ink-apparition`, based on released main `c7ff4a9`. No new merge, push or deployment. Published editions retain V1/V2.
- Preserved the existing paper asset, geographic raster cache, single camera positioning loop, personal data model and physical folds. Added only original vector nature/ornament marks; the user's recording and all source frames remain private under `.git`.
- Director’s static comparison accepted the stronger paper as a practical first material pass, with film-lighting limits explicitly retained. Updated repeated offshore curls to three distinct silhouettes. Same-camera 1280 × 720 material A/B captures compare the old 87% veil with the new 28% veil; geography and controls remain crisp. Phone opening/exploration inspected at 390 × 844.
- Browser checks: local dense pigment precedes fine detail; fully resolved animation is pixel-identical to its static source; close/reopen reverses existing progress; fast A→B→A retains at most two decorations and resolves to the correct place with unchanged camera; camera interruption leaves no residual ornament; marker animation names remain `none` after zoom. Pause/reduced motion show immediate static endpoints, Escape closes with inert hidden content. A synthetic landmark saved in a separate browser profile appeared once after its camera flight, then settled; user browser data was untouched.
- Measured 79 effect callbacks during the final rapid-switch sequence: mean 0.16 ms, p95 0.30 ms, maximum 0.30 ms. This measures JavaScript/canvas submission for the small effect, not GPU completion, whole-map FPS or every device. Eight model tests and the production build passed; the existing large-bundle warning remains.
- Local evidence under ignored `output/playwright/`: `ink-review.webm`, `ink-phase-*.png`, `ink-final.png`, `material-old-veil.png`, `material-new-veil.png`, `phone-opening.png`, `phone-exploring.png`. Phase filenames are target thresholds; screenshots can be later because capture takes time. The video records the actual sequence. These are review artifacts, not public assets.
- **User decision:** finish this current task, then pause further development for review. The local prototype is the review boundary, not final artistic approval or permission to extend/publish. Next action is Mick’s review and feedback; weather, timestamps, rooms and broader ink rollout stay untouched.


### September 7, 2026 — second living-parchment pass; review hold resumed

- Mick rejected the first sparse, static waves and tiny ink ornament. He explicitly requested another Visual Director research/implementation pass. The director supplied the new brief and reviewed final material, water hierarchy and actual illustration phase samples; this is not user approval.
- Implemented the revised water, paper and illustration behavior described in V3/V4 above. No new production dependency, saved-data change, merge, push or deployment. Released V1/V2 remains unchanged.
- Local browser evidence (ignored `output/playwright/`): `living-opening-final.png`, `living-whole-island-final.png`, `living-north-final.png`, `living-phone.png`, `living-phone-explore.png`, `living-gathering.png`, `living-dissolving.png`; `living-review.webm` captures an earlier same-pass density setting. Private reference recording is not included in publishable files.
- Verified changing water canvas pixels across two seconds; identical paused pixels; reduced-motion static endpoints; actual illustration gathering/eroding phase captures; same-place reversal and replacement with New World Center artwork; immediately inert closing content; canvas reaches zero before sheet visibility ends. Drag/zoom returns the overlay to its settled geographic frame. Final samples: 13 water groups at whole island, 17 near North Beach, 6 in phone exploration (3 with the large opening card covering water). Real-water and clear-space availability determine count.
- Eight model tests, production build and diff whitespace check passed. Existing large-JavaScript-chunk warning remains. Bounded local callback sample: water p95 0.4 ms (72 samples; max 1.5 ms); drawing p95 1.3 ms (107 samples; max 3.7 ms). These are JavaScript submission timings, not full rendering/FPS or a controlled before/after speed benchmark. White-backed illustration pixel comparison showed small differences (mean 1.65/255 per channel, maximum 25/255); visual preservation is checked, pixel identity is not claimed.
- Next action: Mick reviews the running local version. Preserve this boundary; do not start rooms, weather, broader effect rollout, publishing or further development without his direction.
