# Decision Log

This log records durable project choices and prevents later work from quietly contradicting them.

## Accepted decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-09-06 | The project is named **Mischief Atlas**. | The name preserves the enchanted spirit without binding the product to an existing fictional property. |
| 2026-09-06 | Mischief Atlas is the nucleus; Inkbound is a future capture portal; Wayward Atlas is parked. | One clear center prevents three promising ideas from weakening one another. |
| 2026-09-06 | The strongest first proof is one house with three rooms and fifteen loci. | A complete, excellent loop teaches more than a broad but shallow atlas. |
| 2026-09-06 | The repository remains public. | Public work enables portable collaboration, while strict policy keeps real memory data and credentials outside Git. |
| 2026-09-06 | No application stack is selected before the experience direction. | Technology should serve the spatial interaction and privacy model rather than pre-empt them. |
| 2026-09-06 | No open-source license is granted yet. | Public visibility does not automatically grant reuse rights. |

| 2026-09-06 | The first release is a personal working atlas. | The product must prove genuine usefulness with meaningful lived material before it is generalized for strangers. |
| 2026-09-06 | Miami Beach is the first atlas territory; South Beach receives the first dense visual pass. | The full island preserves a durable outer canvas while South Beach provides a landmark-rich starting area. |
| 2026-09-06 | Superseded: **Unfurled Cartographer** (visual option 1). | Replaced by the user's later selection of the last revised image, Awakening City. |
| 2026-09-06 | The first visual prototype is desktop-first at 1440 × 1024. | A large canvas is best for judging landmark density, legibility, folds, and place-sheet behavior before responsive adaptation. |
| 2026-09-06 | Atlas geometry uses real geography beneath original illustrated cartography. | Recognizable coastlines, streets, and landmarks preserve spatial memory while living ink supplies the product's distinct character. |

## Decisions awaiting approval

### Implementation decisions, 2026-09-06

- **Awakening City** is the selected visual truth. The original concept remains preserved; obsolete prototype direction is superseded.
- The immediate scope is the aesthetics and interactions of Miami Beach, before the complete recall loop.
- React, Vite, Leaflet, and an actual OSM vector snapshot implement the prototype. Canvas rendering supports browsers without WebGL.
- Six generated landmark illustrations sit over real geographic geometry; 26 curated places are searchable and selectable.
- Browser storage holds aliases and named rooms for this prototype. It is not a backup or synchronization system.
- Traffic is explicitly simulated. Congestion increases density and reduces speed; pause and reduced-motion states stop continuous animation.

### Future product decisions

1. Long-term primary platform beyond the desktop-first visual prototype
2. Palace view: floor plan, cutaway, diorama, or layered combination
3. Persistence model for the personal alpha
4. Initial recall scoring and scheduling model
5. Scope of AI-generated mnemonic imagery
6. Final accessibility and reduced-motion expression of living ink

## How to add a decision

Add the date, the chosen direction, and the reason. If a decision replaces an earlier one, preserve the earlier entry and mark it superseded instead of deleting history.
