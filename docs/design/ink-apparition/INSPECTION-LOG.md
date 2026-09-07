# Ink apparition inspection log

September 7, 2026. Research-only evidence; not shipped artwork or a visual approval.

- Supplied compilation URL: https://www.youtube.com/watch?v=HmGrtROhey0
- Fresh Chrome research tab title: Every Marauder's Map Scene | Compilation | Harry Potter - YouTube.
- Visible player duration: 9:36. Channel: Harry Potter, verified badge in browser/native accessibility state. Playback muted through normal UI; sampled state at 0:13. No source-specific motion claim follows from that metadata.
- Two browser screenshot attempts timed out. Switched to documented native Chrome inspection; window title confirmed the same dedicated research group. Two native screenshots, including after raising that research window, were blank. No repeated Chrome screenshot attempts after diagnosis.
- No remote video was downloaded, no warning bypassed, no user/main preview tab controlled, no source/store changes made.
- Read-only source diagnosis: `atlas/src/styles.css` `@keyframes ink-arrives` uses opacity plus a horizontal inset clip and tiny blur. `atlas/src/map/AtlasMap.jsx` filters a visible-marker list and renders keyed buttons; unconditional mount animations can replay after culling/remount. Implementation owner independently reported this issue and no pigment-exit lifecycle.
- Renewed inspection was unblocked by Mick's local 13.948-second recording, with sampled frames extracted by the implementation task. The director directly viewed twelve frames: 00–10 and 12. This is a temporal sequence of actual pixels, not inference from player metadata. The IAB route also worked for the implementation task; its independent browser observations are not needed to substitute for these directly inspected files.

## Private recording evidence

All paths below are relative to the repository's `.git/atlas-checkpoints/ink-reference/`. Keep them and `reference.mov` private: they include browser/account context. No frame was copied into public documentation or used as a production asset.

| File | Recording time | Evidence |
| --- | --- | --- |
| `frame-00-0.00s.png` | 0.00 s | Source player 1:02; sparse marks on right leaf beside developed left cover. |
| `frame-01-1.15s.png` | 1.15 s | Source 1:03; right-leaf plan/lettering substantially developed. |
| `frame-02-2.31s.png` | 2.31 s | Source 1:04; extensive fine plan detail. |
| `frame-03-3.46s.png` | 3.46 s | Source 1:05; user seeking UI visible. |
| `frame-04-4.62s.png` | 4.62 s | Shot of people/blank paper after backward seek. |
| `frame-05-5.77s.png` | 5.77 s | Nearly blank cover leaves; material/crease visible before ink. |
| `frame-06-6.92s.png` | 6.92 s | Faint names and separate lower brown patches. |
| `frame-07-8.08s.png` | 8.08 s | Stronger names and larger ragged connected patches. |
| `frame-08-9.23s.png` | 9.23 s | Dense title mass and light counters; incomplete fine ornament. |
| `frame-09-10.39s.png` | 10.39 s | Fine architecture and flourishes largely resolve. |
| `frame-10-11.54s.png` | 11.54 s | Film cut to Harry; displayed source 0:54. |
| `frame-12-13.85s.png` | 13.85 s | Paused source 0:55, after the cut. |

The source timeline was scrubbed backward during the recording. These are **two appearance excerpts, not an appearance followed by disappearance**. Do not interpolate source timestamps through the seek. The 5.77–10.39 s samples establish development over about 4.62 recording seconds, not exact start/end duration, playback-speed calibration, fine stroke ordering or a specific VFX algorithm. No filmed dissolve was verified. The brief's exit is a proposed reverse, with compressed original UI timing.

## Final handoff verification

The resumed director directly re-inspected frames 5.77, 8.08, 9.23 and 10.39 s and `atlas/public/assets/parchment.webp`. The latter already contains broad mottling, fine flecks, warm worn edges and faint cross-folds. Source inspection at `atlas/src/styles.css:78` confirms the approximately 87% opaque pale layer (`#efdfbcdd`) over that texture. The first material test is therefore to expose more of the existing asset and compare it against the blank-paper recording frame; new texture generation is not a prerequisite. No application files, shared progress guide or private evidence assets were changed during this verification.

## Supplementary material sources

- Earlier directly inspected local user images: `/Users/mick/Downloads/Harry-potter3_map_pettigrew.webp` and `/Users/mick/Downloads/Marauder%27sMap.webp`.
- Earlier inspected physical replica screenshot: `docs/design/visual-director/08-replica-open-folds.png`; primary source https://noblecollection.co.uk/product/marauders-map/ .
- Refreshed primary designer text: https://minalima.com/product/the-marauders-map/ — medieval-map influences, red-ink cover, architectural enclosure and handwritten script. Current art-print paper specifications are not original prop-material specifications. Gallery image links were located but not visually inspected in this pass; no claims from unseen gallery images.
