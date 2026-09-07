# Mischief Atlas

> A spatial operating system for remembering your life.

Mischief Atlas is a living, navigable memory palace for preserving what matters and repeatedly bringing it back into active recall. It combines familiar places, nested spatial navigation, vivid mnemonic imagery, retrieval practice, and restrained living-ink animation.

The north star is simple:

**A living map of everything you refuse to forget.**

## Status

The **Awakening City** visual prototype is implemented in [`atlas/`](atlas/). It opens on South Beach with real map geometry, illustrated landmarks, living ink, and unfolding place sheets.

- Pan and zoom across Miami Beach; search 26 curated landmarks.
- Rename places and create nested memory rooms, saved in the current browser.
- Watch anonymous footsteps emerge on actual streets; change the simulated traffic rhythm or pause motion.
- Explore on desktop or phone. Generated artwork supplies the parchment and landmark drawings; OpenStreetMap supplies the geography.

This is an aesthetic and interaction prototype. Recall practice, memory entries, accounts, synchronization, and live traffic are future work. See the [approved design](docs/specs/2026-09-06-awakening-city.md) and [verification report](atlas/design-qa.md).

## Run the prototype

Requires Node.js 22 or newer.

```sh
cd atlas
npm ci
npm run dev
```

`npm test` checks the state and motion model. `npm run build` produces the application; `npm run test:sites` checks the preserved hosting adapter. The geographic snapshot and fonts are bundled, so no map API key is required.

## The core loop

**Capture → Transform → Place → Recall → Strengthen**

Every major feature must improve one of those five moments. If it does not help the user remember, it is secondary.

## First proof

The current milestone proves the Miami Beach map's aesthetics and spatial interactions. The later recall milestone remains one deeply polished, functional palace:

- One familiar house
- Three rooms
- Five loci per room
- A complete add-and-place flow
- AI-assisted mnemonic creation with user approval
- A recall walk with answers initially hidden
- Memory-strength changes driven by actual retrieval
- A rich, map-like detail page for the house and its contents

The first milestone succeeds when placing a meaningful memory and recovering it later feels both effective and quietly magical.

## Product family

- **Mischief Atlas:** the core spatial memory system
- **Inkbound:** a possible future handwritten BOOX capture portal
- **Wayward Atlas:** a parked exploration-map concept, not part of the first build

## Design principles

- Google Maps clarity with living-cartography enchantment
- Serious mnemonic science beneath an intuitive surface
- Animation that communicates place, path, time, or memory state
- Personal and humane rather than clinical or CRM-like
- Rich enough to feel cinematic; restrained enough to remain usable
- No generic SaaS dashboard, ornamental fantasy clutter, or gamification for its own sake

## Repository map

- [Working vision](docs/WORKING_VISION.md)
- [Roadmap](docs/ROADMAP.md)
- [Decision log](docs/DECISIONS.md)
- [Privacy boundary](docs/PRIVACY.md)
- [Original concept handoff](docs/handoff/memory-atlas-gpt6-pro-handoff.txt)
- [Design workspace](docs/design/README.md)
- [Research workspace](docs/research/README.md)
- [Validated specifications](docs/specs/README.md)

## Public repository policy

This repository is public, but lived memory data is not. Use synthetic fixtures and fictional people, places, images, and events in examples and tests. Never commit journals, contacts, personal photographs, exports, user databases, private prompts, credentials, or real memory content.

See [PRIVACY.md](docs/PRIVACY.md) before adding data or assets.

## Working sequence

1. Resolve the first-user, primary-platform, and success-criterion decisions.
2. Explore three distinct visual and spatial interaction directions.
3. Select one direction and prototype the complete core loop.
4. Validate usability, motion, accessibility, and recall behavior.
5. Write the implementation specification and build the functional alpha.
6. Expand only after the one-palace experience proves itself.

## License

No open-source license has been granted yet. All rights are reserved until a licensing decision is made.
