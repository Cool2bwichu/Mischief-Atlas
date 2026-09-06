# Miami Beach Map — Unfurled Cartographer Design

**Status:** Selected visual direction; interaction contract ready for user review  
**Date:** 2026-09-06  
**Selected reference:** [Miami Beach — Unfurled Cartographer](assets/miami-beach-unfurled-cartographer.webp)

## Decision

The first visual prototype uses the **Unfurled Cartographer** direction: one continuous, tactile parchment map of Miami Beach with South Beach rendered at the highest density. Landmark detail pages physically unfold from the map rather than appearing as ordinary software cards.

This prototype is desktop-first at a canonical 1440 × 1024 viewport. It establishes the map's visual and interaction language; it does not yet implement the full memory system.

## Product objective

The screen should immediately feel like a real, long-used enchanted map while remaining as legible and explorable as a modern mapping product. A user should be able to orient themselves, pan and zoom, discover major landmarks, select one, rename it for a memory topic, and understand that it can later expand into sub-locations.

The magic is functional:

- Ink reveal communicates available detail.
- Ink density communicates selection and future memory strength.
- Footprints communicate paths and attention.
- Paper folds communicate hierarchy and expansion.
- Erasures and ghost marks communicate previous names or fading memory.

## Canonical composition

- The map fills the viewport; there is no generic dashboard shell.
- Miami Beach runs north–south with the Atlantic Ocean to the east and Biscayne Bay to the west.
- The full Miami Beach territory remains visible at the overview scale.
- South Beach, from South Pointe to 23rd Street, carries the densest street, building, and landmark detail.
- Mid-Beach and North Beach continue in lighter ink so the territory can expand later without redrawing the product.
- The selected-place sheet unfolds from the lower-right edge of the same parchment and remains subordinate to the map.
- Artifact-native controls are embedded at the edges: compass, zoom scale, and quill-shaped add-place action.

## Geographic grammar

The prototype must preserve a recognizable Miami Beach shoreline, street orientation, and causeway placement. The selected reference is an aesthetic target, not a cartographic authority; implementation should correct its geographic approximations.

### Landmark hierarchy

Landmarks visible at the primary South Beach scale include:

- South Pointe Park
- South Pointe Pier
- Nikki Beach
- Ocean Drive
- Lummus Park
- Art Deco Historic District
- Villa Casa Casuarina
- Española Way
- Flamingo Park
- Lincoln Road
- New World Center and SoundScape Park
- Holocaust Memorial
- Miami Beach Botanical Garden
- Miami Beach Convention Center
- The Bass
- Collins Park
- Venetian Causeway
- MacArthur Causeway

Mid-Beach and North Beach landmarks appear as paler contextual anchors until those territories receive their own design pass.

Landmarks are represented through miniature architectural elevations, garden plans, seals, lifeguard towers, and handwritten labels—not modern map pins.

## Material system

### Parchment

The base is warm, fibrous, uneven, and physically believable. It includes fold memory, softened edges, subtle water and salt marks, rubbed zones, repairs, fingerprints, and restrained ink stains. Wear should suggest years of use without reducing readability.

### Ink

- Primary linework: near-black brown
- Active and selected paths: deep oxblood
- Water and inactive geography: desaturated blue-gray wash
- Fading or latent detail: low-opacity sepia
- No neon, glass effects, synthetic glow, or modern gradient treatment

Ink varies in pressure and absorption. Important locations resolve into sharper, darker marks; peripheral or latent information remains lighter.

### Typography

Use no more than two families:

1. An engraved or old-style serif for geographic names and place titles.
2. A restrained handwritten face for annotations and actions.

Labels must remain readable at their intended zoom level. Handwriting is intimate but never used for dense body copy.

### Illustration

Buildings and landmarks use fine ink elevations or plan drawings with consistent perspective and line weight. Decorative palms, waves, boats, compass flourishes, and wildlife remain sparse and geographic rather than ornamental.

## Interaction contract

### Overview

The full territory is visible. Major labels and landmark drawings are present; minor detail rests in faint underdrawing. A subtle idle ink behavior makes the map feel awake without constant motion.

### Pan and zoom

- Dragging moves the paper itself.
- Zooming behaves continuously, like a modern map.
- New streets, labels, and drawings reveal through progressive ink development instead of abruptly appearing.
- Labels use collision-aware priority so dense areas remain legible.
- The physical paper texture stays stable while cartographic detail changes beneath it.

### Landmark hover or focus

- The landmark's linework darkens.
- Nearby labels soften slightly.
- A short ink filament or a few footprints suggest the route to it.
- The target receives a clear non-color focus state.

### Landmark selection

- An oxblood ink bloom resolves around the landmark.
- Footprints arrive and stop.
- The selected route remains darker than surrounding paths.
- The place sheet unfolds from the parchment edge with physical curl and shadow.
- Selection never recenters so aggressively that the user loses geographic context.

### Place sheet

The initial selected state uses **Ocean Drive** with the subtitle **“Where luminous nights are kept.”**

The sheet includes:

- A small etched landmark vignette
- A prominent editable place name
- “Rename this place”
- “Inside”
- “Memories”
- “Recall paths”
- A discreet close or refold action

“Inside,” “Memories,” and “Recall paths” expand as paper sections within the same sheet. They do not spawn nested floating cards.

### Rename

Choosing “Rename this place” changes the title into an ink-entry field. Saving the name plays a brief dry-ink resolution; the original geographic name remains available as secondary metadata. Prototype renaming may live only in local session state.

### Empty and latent states

A location without memory content still feels intentional: it shows its geographic identity, a faint interior diagram, and one quiet invitation to claim it. Empty places never display fabricated memories.

## Motion grammar

Motion should be sparse, slow enough to perceive, and tied to meaning.

- **Reveal:** strokes draw in the natural direction of handwriting or architectural drafting.
- **Footprints:** appear heel-to-toe along real routes and fade from oldest to newest.
- **Unfold:** the place sheet opens from a credible paper hinge with restrained depth.
- **Resolve:** selected ink deepens and sharpens rather than glowing.
- **Fade:** dormant detail loses density gradually but never vanishes beyond recovery.
- **Rename:** old lettering ghosts beneath the new title for a moment, preserving a sense of history.

No animation loops merely to decorate the screen. Idle motion pauses during direct interaction.

## Prototype structure

The visual prototype may use four isolated layers:

1. **Illustrated base** — parchment, water wash, coastline, streets, and landmark art.
2. **Interactive geography** — landmark hit regions, pan and zoom coordinates, focus order, and label priority.
3. **Living ink** — routes, footprints, progressive reveals, selection bloom, and motion preferences.
4. **Place sheet** — readable interactive content, rename state, sections, and refold behavior.

The selected mockup remains the visual source of truth. The prototype uses synthetic labels and no personal memory data.

## Accessibility

- All landmarks are keyboard reachable in a meaningful geographic order.
- Focus is visible through line weight and boundary treatment, not color alone.
- Text and interactive controls meet WCAG AA contrast against their immediate paper surface.
- A reduced-motion mode replaces drawing, footsteps, and unfolding with short opacity and line-weight changes.
- Pan and zoom have keyboard equivalents.
- Place-sheet content remains semantic and screen-reader navigable.
- Decorative wear never crosses essential body text at harmful contrast.

## Non-goals for this prototype

- Memory capture, mnemonic generation, recall scheduling, or strength scoring
- Authentication, cloud persistence, or private data storage
- Multiple South Florida territories
- Complete building interiors or sub-location navigation
- Mobile-specific interaction design
- Photorealistic 3D geography
- Franchise names, quotations, crests, characters, or copied prop artwork

## Acceptance criteria

The direction is ready to implement when the approved prototype plan can satisfy all of the following:

1. At 1440 × 1024, the rendered screen is visibly faithful to the selected reference in composition, density, color, material, typography, and atmosphere.
2. Miami Beach is geographically recognizable, and South Beach is the densest readable area.
3. At least eighteen named landmarks or geographic anchors are discoverable without conventional pins.
4. Pan, zoom, hover or focus, selection, refold, rename, and one expandable place-sheet section work.
5. Ocean Drive opens the canonical place sheet while preserving surrounding map context.
6. Ink reveal, footprints, route emphasis, and paper unfolding each communicate a distinct state change.
7. Reduced-motion mode preserves every interaction and meaning.
8. No private memory content, credentials, or personal photographs are included.
9. Visual comparison against the selected mockup has no unresolved high- or medium-severity fidelity issues.
10. The experience remains legible and navigable without explanatory onboarding.
