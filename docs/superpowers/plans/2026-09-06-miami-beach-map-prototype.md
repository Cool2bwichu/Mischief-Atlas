# Miami Beach Living Map Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a faithful, interactive desktop prototype of the selected Unfurled Cartographer Miami Beach map, including pan and zoom, eighteen discoverable landmarks, living-ink state changes, and an unfolding, renameable Ocean Drive place sheet.

**Architecture:** Use the Product Design Vite/React prototype starter. Preserve the selected artwork as the visual truth, then separate behavior into an illustrated raster layer, normalized landmark geometry, a map transform controller, a living-ink motion layer, and a semantic DOM place sheet. Keep the prototype client-only and deterministic; no backend, private data, or production memory engine enters this build.

**Tech Stack:** React 19, Vite 6, JavaScript modules, CSS custom properties and keyframes, Vitest, Testing Library, Phosphor Icons, bundled Fontsource fonts, ImageGen-created raster assets, and the Product Design browser/design-QA workflow.

**Spec:** `docs/specs/2026-09-06-miami-beach-unfurled-cartographer-design.md`

## Global Constraints

- Canonical viewport: exactly `1440 × 1024` CSS pixels for the primary fidelity comparison.
- Selected visual truth: `docs/design/assets/miami-beach-unfurled-cartographer.webp`.
- The full Miami Beach territory remains visible at overview scale; South Beach carries the highest detail density.
- At least eighteen landmarks or geographic anchors must be discoverable without conventional map pins.
- Required interactions: pan, zoom, hover or focus, select, refold, rename, and at least one expandable place-sheet section.
- Canonical selected state: Ocean Drive, subtitle “Where luminous nights are kept.”
- Required motion meanings: ink reveal, footprints, route emphasis, and paper unfolding.
- Reduced-motion mode must preserve all interaction meaning.
- No authentication, persistence, private memories, personal photographs, or backend calls.
- Do not include franchise names, quotations, crests, characters, or copied prop artwork.
- Use real raster assets for parchment, cartography, vignettes, footprints, compass, quill, and other non-standard artwork; do not recreate them with CSS drawings, custom SVG, emoji, or text glyphs.
- The Product Design starter's `worker/`, Sites build script, and Sites worker test remain intact.
- Do not deploy; keep the verified local preview open for review.

---

## Planned file structure

```text
mischief-atlas/
├── AGENTS.md
├── package.json
├── public/
│   ├── assets/
│   │   ├── map/miami-beach-base.webp
│   │   ├── map/miami-beach-ink-route.webp
│   │   ├── paper/place-sheet.webp
│   │   ├── paper/parchment-grain.webp
│   │   ├── landmarks/ocean-drive-vignette.webp
│   │   └── marks/
│   │       ├── compass.webp
│   │       ├── quill.webp
│   │       ├── footprint-left.webp
│   │       └── footprint-right.webp
│   └── reference/miami-beach-unfurled-cartographer.webp
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── data/landmarks.js
│   ├── hooks/useMapViewport.js
│   ├── lib/mapTransform.js
│   ├── components/
│   │   ├── ArtifactControls.jsx
│   │   ├── LandmarkHotspot.jsx
│   │   ├── LivingInk.jsx
│   │   ├── MapViewport.jsx
│   │   └── PlaceSheet.jsx
│   └── styles/
│       ├── tokens.css
│       ├── map.css
│       ├── motion.css
│       ├── place-sheet.css
│       └── responsive.css
├── tests/
│   ├── app-shell.test.jsx
│   ├── landmarks.test.js
│   ├── map-transform.test.js
│   └── place-sheet.test.jsx
├── design-qa.md
└── implementation-miami-beach.png
```

Each file has one responsibility: data names landmarks, transform code owns coordinate math, the hook owns input state, map components render the atlas, the place sheet owns selection content, and styles are separated by visual system rather than accumulated in one file.

### Task 1: Bootstrap the prototype and establish the test harness

**Files:**
- Create from template: `package.json`, `vite.config.mjs`, `src/App.jsx`, `src/main.jsx`, `src/styles.css`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, `tests/sites-worker.test.mjs`
- Modify: `package.json`
- Modify: `src/App.jsx`
- Test: `tests/app-shell.test.jsx`

**Interfaces:**
- Consumes: Product Design `prototype` starter.
- Produces: `App()` with `data-testid="atlas-app"`; npm scripts `test`, `test:watch`, `build`, and `test:sites`.

- [ ] **Step 1: Bootstrap the Product Design prototype**

Run:

```bash
node /root/.codex/plugins/cache/openai-curated-remote/product-design/0.1.53/scripts/bootstrap-prototype.mjs --dest "$PWD/mischief-atlas"
cd "$PWD/mischief-atlas"
npm install --prefer-offline --no-audit --no-fund
```

Expected: the web `prototype` starter exists and `npm run build` succeeds without modifications to the protected Sites runtime.

- [ ] **Step 2: Install the smallest required UI and test dependencies**

Run:

```bash
npm install @phosphor-icons/react @fontsource/im-fell-english @fontsource/caveat
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "vite build && node scripts/prepare-sites-build.mjs",
    "preview": "vite preview",
    "test:sites": "node --test tests/sites-worker.test.mjs"
  }
}
```

- [ ] **Step 3: Write the failing app-shell test**

Create `tests/app-shell.test.jsx`:

```jsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App.jsx";

describe("App shell", () => {
  it("renders the atlas as the primary surface", () => {
    render(<App />);
    expect(screen.getByTestId("atlas-app")).toBeInTheDocument();
    expect(screen.getByRole("application", { name: "Mischief Atlas — Miami Beach" })).toBeInTheDocument();
  });
});
```

Add `vitest.config.mjs`:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
    css: false,
  },
});
```

- [ ] **Step 4: Run the test and verify that it fails**

Run:

```bash
npm test -- tests/app-shell.test.jsx
```

Expected: FAIL because `atlas-app` and the named application region do not exist.

- [ ] **Step 5: Add the minimal semantic shell**

Replace `src/App.jsx` with:

```jsx
export function App() {
  return (
    <main
      className="atlas-app"
      data-testid="atlas-app"
      role="application"
      aria-label="Mischief Atlas — Miami Beach"
    />
  );
}
```

- [ ] **Step 6: Run the test and commit**

Run:

```bash
npm test -- tests/app-shell.test.jsx
git add package.json package-lock.json vitest.config.mjs src/App.jsx tests/app-shell.test.jsx
git commit -m "chore: bootstrap Miami Beach atlas prototype"
```

Expected: PASS.

### Task 2: Produce and install the visual asset pack

**Files:**
- Create: `public/reference/miami-beach-unfurled-cartographer.webp`
- Create: `public/assets/map/miami-beach-base.webp`
- Create: `public/assets/map/miami-beach-ink-route.webp`
- Create: `public/assets/paper/place-sheet.webp`
- Create: `public/assets/paper/parchment-grain.webp`
- Create: `public/assets/landmarks/ocean-drive-vignette.webp`
- Create: `public/assets/marks/compass.webp`
- Create: `public/assets/marks/quill.webp`
- Create: `public/assets/marks/footprint-left.webp`
- Create: `public/assets/marks/footprint-right.webp`
- Create: `src/styles/tokens.css`
- Test: `tests/assets.test.js`

**Interfaces:**
- Consumes: selected reference image at `docs/design/assets/miami-beach-unfurled-cartographer.webp`.
- Produces: stable asset URLs under `/assets/` and CSS variables used by all visual components.

- [ ] **Step 1: Write the failing asset-presence test**

Create `tests/assets.test.js`:

```js
import { access } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const assets = [
  "public/reference/miami-beach-unfurled-cartographer.webp",
  "public/assets/map/miami-beach-base.webp",
  "public/assets/map/miami-beach-ink-route.webp",
  "public/assets/paper/place-sheet.webp",
  "public/assets/paper/parchment-grain.webp",
  "public/assets/landmarks/ocean-drive-vignette.webp",
  "public/assets/marks/compass.webp",
  "public/assets/marks/quill.webp",
  "public/assets/marks/footprint-left.webp",
  "public/assets/marks/footprint-right.webp",
];

describe("visual asset pack", () => {
  for (const path of assets) {
    it(`contains ${path}`, async () => {
      await expect(access(path)).resolves.toBeUndefined();
    });
  }
});
```

- [ ] **Step 2: Run the test and verify that it fails**

Run:

```bash
npm test -- tests/assets.test.js
```

Expected: FAIL on the first missing asset.

- [ ] **Step 3: Generate the clean map asset**

Use the selected mockup as the visual reference and generate a single `1487 × 1058` clean base. The required generation direction is:

```text
Edit the selected Unfurled Cartographer Miami Beach interface into a clean,
full-bleed map plate. Preserve the exact parchment, coastline, city drawing,
folds, ink palette, landmark density, compass style, and lived-in wear. Remove
the Ocean Drive place sheet, selection bloom, active footprints, zoom control,
and all software controls. Reconstruct plausible cartography underneath the
removed sheet. Keep the full Miami Beach island visible and South Beach most
detailed. Do not add logos, franchise words, modern map pins, bright UI, or a
second frame. Output only the map artwork at 1487 × 1058.
```

Save the result as `public/assets/map/miami-beach-base.webp` at WebP quality 88.

- [ ] **Step 4: Generate the supporting raster assets**

Generate each asset independently using the selected reference as art direction:

```text
parchment-grain.webp — seamless warm fibrous parchment texture, restrained
fold fibers and salt wear, no writing, no objects, 1024 × 1024.

place-sheet.webp — blank vertical aged parchment sheet with curled upper-left
corner, believable torn edges and soft physical shadow, no writing or icons,
760 × 980.

ocean-drive-vignette.webp — fine oxblood-and-charcoal etched elevation of
Ocean Drive Art Deco facades and palms, transparent-looking plain parchment
background matching the place sheet, no title, 900 × 360.

compass.webp — antique brass-rimmed ink cartographer compass on plain matching
parchment, centered, no outside shadow, 256 × 256.

quill.webp — dark brown antique quill and nib on plain matching parchment,
diagonal composition, 256 × 256.

footprint-left.webp and footprint-right.webp — one small human shoe print in
deep oxblood ink, isolated on flat matching parchment with no other marks,
128 × 128 each.

miami-beach-ink-route.webp — a narrow irregular oxblood ink route following
Ocean Drive from South Pointe northward, isolated on flat matching parchment,
1487 × 1058, with all non-route pixels matching the base parchment closely.
```

Post-process to WebP without stretching. Preserve each asset's stated aspect ratio.

- [ ] **Step 5: Install the selected reference and visual tokens**

Copy the selected target to `public/reference/miami-beach-unfurled-cartographer.webp`.

Create `src/styles/tokens.css`:

```css
@import "@fontsource/im-fell-english/400.css";
@import "@fontsource/im-fell-english/400-italic.css";
@import "@fontsource/caveat/500.css";
@import "@fontsource/caveat/600.css";

:root {
  --paper-50: #ead5aa;
  --paper-100: #d6b982;
  --paper-200: #b88e58;
  --ink-900: #24160f;
  --ink-700: #4a2b1d;
  --ink-500: #745039;
  --oxblood-700: #641f1a;
  --oxblood-500: #8a342a;
  --water-500: #718d8b;
  --water-300: #9fafaa;
  --focus-ring: #321c12;
  --shadow-paper: 0 22px 48px rgb(32 16 8 / 42%);
  --font-cartographic: "IM FELL English", Georgia, serif;
  --font-hand: "Caveat", "Bradley Hand", cursive;
  --ease-paper: cubic-bezier(.22, .78, .2, 1);
  --duration-reveal: 700ms;
  --duration-unfold: 620ms;
}
```

- [ ] **Step 6: Run the asset test, inspect every asset, and commit**

Run:

```bash
npm test -- tests/assets.test.js
git add public src/styles/tokens.css tests/assets.test.js
git commit -m "design: add Unfurled Cartographer asset system"
```

Expected: PASS. Open every asset at original resolution before committing; reject visible text corruption, inconsistent parchment, weak linework, or unrelated fantasy motifs.

### Task 3: Define the landmark model and bounded map transform

**Files:**
- Create: `src/data/landmarks.js`
- Create: `src/lib/mapTransform.js`
- Test: `tests/landmarks.test.js`
- Test: `tests/map-transform.test.js`

**Interfaces:**
- Produces: `LANDMARKS: Landmark[]`, `getLandmark(id)`, `clampScale(scale)`, and `clampPan({x,y}, scale, viewport, content)`.
- Landmark shape: `{ id, geographicName, displayName, subtitle, x, y, priority, vignette, sections }`, with `x` and `y` normalized from `0` to `1`.

- [ ] **Step 1: Write failing landmark tests**

Create `tests/landmarks.test.js`:

```js
import { describe, expect, it } from "vitest";
import { LANDMARKS, getLandmark } from "../src/data/landmarks.js";

describe("Miami Beach landmarks", () => {
  it("defines eighteen unique, normalized landmarks", () => {
    expect(LANDMARKS).toHaveLength(18);
    expect(new Set(LANDMARKS.map(({ id }) => id)).size).toBe(18);
    for (const landmark of LANDMARKS) {
      expect(landmark.x).toBeGreaterThanOrEqual(0);
      expect(landmark.x).toBeLessThanOrEqual(1);
      expect(landmark.y).toBeGreaterThanOrEqual(0);
      expect(landmark.y).toBeLessThanOrEqual(1);
    }
  });

  it("keeps Ocean Drive as the canonical selected place", () => {
    expect(getLandmark("ocean-drive")).toMatchObject({
      displayName: "Ocean Drive",
      subtitle: "Where luminous nights are kept.",
    });
  });
});
```

- [ ] **Step 2: Write failing transform tests**

Create `tests/map-transform.test.js`:

```js
import { describe, expect, it } from "vitest";
import { clampPan, clampScale } from "../src/lib/mapTransform.js";

describe("map transform", () => {
  it("limits scale to the designed range", () => {
    expect(clampScale(0.4)).toBe(1);
    expect(clampScale(1.8)).toBe(1.8);
    expect(clampScale(4)).toBe(2.7);
  });

  it("keeps scaled map edges reachable", () => {
    expect(
      clampPan(
        { x: -900, y: 700 },
        2,
        { width: 1440, height: 1024 },
        { width: 1487, height: 1058 },
      ),
    ).toEqual({ x: -767, y: 512 });
  });
});
```

- [ ] **Step 3: Run both tests and verify failure**

Run:

```bash
npm test -- tests/landmarks.test.js tests/map-transform.test.js
```

Expected: FAIL because both modules are absent.

- [ ] **Step 4: Implement the transform contract**

Create `src/lib/mapTransform.js`:

```js
export const MIN_SCALE = 1;
export const MAX_SCALE = 2.7;

export function clampScale(scale) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function clampPan(pan, scale, viewport, content) {
  const maxX = Math.max(0, (content.width * scale - viewport.width) / 2);
  const maxY = Math.max(0, (content.height * scale - viewport.height) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, Math.round(pan.x))),
    y: Math.min(maxY, Math.max(-maxY, Math.round(pan.y))),
  };
}
```

- [ ] **Step 5: Implement the landmark data**

Create `src/data/landmarks.js` with exactly these IDs and normalized anchor positions:

```js
const sharedSections = {
  inside: ["Threshold", "Main chamber", "Hidden corner"],
  memories: [],
  paths: ["Nearest route", "Return path"],
};

export const LANDMARKS = [
  ["south-pointe-park", "South Pointe Park", "Where beginnings face the water.", .504, .805, 1],
  ["south-pointe-pier", "South Pointe Pier", "Where the island reaches outward.", .596, .865, 1],
  ["nikki-beach", "Nikki Beach", "Where the shoreline keeps its rhythm.", .664, .545, 2],
  ["ocean-drive", "Ocean Drive", "Where luminous nights are kept.", .579, .568, 1],
  ["lummus-park", "Lummus Park", "Where the palms watch the avenue.", .615, .607, 1],
  ["art-deco-district", "Art Deco Historic District", "Where geometry learned to glow.", .488, .583, 1],
  ["villa-casa-casuarina", "Villa Casa Casuarina", "Where ornament guards a story.", .474, .681, 2],
  ["espanola-way", "Española Way", "Where the street narrows into conversation.", .461, .474, 2],
  ["flamingo-park", "Flamingo Park", "Where the neighborhood breathes.", .493, .402, 2],
  ["lincoln-road", "Lincoln Road", "Where the island comes to wander.", .471, .302, 1],
  ["new-world-center", "New World Center", "Where music redraws the air.", .374, .252, 2],
  ["holocaust-memorial", "Holocaust Memorial", "Where memory refuses disappearance.", .394, .355, 2],
  ["botanical-garden", "Miami Beach Botanical Garden", "Where the map grows quiet.", .442, .072, 2],
  ["convention-center", "Miami Beach Convention Center", "Where many paths gather.", .458, .142, 3],
  ["the-bass", "The Bass", "Where objects keep other lives.", .591, .164, 2],
  ["collins-park", "Collins Park", "Where culture meets the sea wind.", .619, .268, 2],
  ["venetian-causeway", "Venetian Causeway", "Where the island remembers the mainland.", .302, .184, 2],
  ["macarthur-causeway", "MacArthur Causeway", "Where arrivals become departures.", .264, .685, 1],
].map(([id, geographicName, subtitle, x, y, priority]) => ({
  id,
  geographicName,
  displayName: geographicName,
  subtitle,
  x,
  y,
  priority,
  vignette: id === "ocean-drive" ? "/assets/landmarks/ocean-drive-vignette.webp" : null,
  sections: sharedSections,
}));

export function getLandmark(id) {
  return LANDMARKS.find((landmark) => landmark.id === id) ?? null;
}
```

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm test -- tests/landmarks.test.js tests/map-transform.test.js
git add src/data src/lib tests/landmarks.test.js tests/map-transform.test.js
git commit -m "feat: define Miami Beach landmark geometry"
```

Expected: PASS.

### Task 4: Build pan, zoom, focus, and landmark selection

**Files:**
- Create: `src/hooks/useMapViewport.js`
- Create: `src/components/ArtifactControls.jsx`
- Create: `src/components/LandmarkHotspot.jsx`
- Create: `src/components/MapViewport.jsx`
- Create: `src/styles/map.css`
- Modify: `src/App.jsx`
- Test: `tests/map-viewport.test.jsx`

**Interfaces:**
- Consumes: `LANDMARKS`, `clampScale`, `clampPan`.
- Produces: `useMapViewport()` returning `{ pan, scale, mapProps, zoomIn, zoomOut, resetView }`; `MapViewport({ selectedId, onSelect })`.

- [ ] **Step 1: Write the failing interaction test**

Create `tests/map-viewport.test.jsx`:

```jsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MapViewport } from "../src/components/MapViewport.jsx";

describe("MapViewport", () => {
  it("selects Ocean Drive and exposes zoom controls", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MapViewport selectedId={null} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Explore Ocean Drive" }));
    expect(onSelect).toHaveBeenCalledWith("ocean-drive");
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeEnabled();
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
npm test -- tests/map-viewport.test.jsx
```

Expected: FAIL because `MapViewport` does not exist.

- [ ] **Step 3: Implement the viewport hook**

Create `src/hooks/useMapViewport.js` with pointer capture for drag, `wheel` zoom centered on the pointer, keyboard `+`, `-`, and `0`, and bounds from `clampPan`. Use these exact initial values:

```js
const INITIAL = { pan: { x: 0, y: 0 }, scale: 1 };
const VIEWPORT = { width: 1440, height: 1024 };
const CONTENT = { width: 1487, height: 1058 };
```

Expose `data-pan-x`, `data-pan-y`, and `data-scale` through `mapProps` so browser QA can verify state without reading internal React values.

- [ ] **Step 4: Implement semantic landmark hotspots**

`LandmarkHotspot.jsx` renders one absolutely positioned `button`:

```jsx
export function LandmarkHotspot({ landmark, selected, onSelect }) {
  return (
    <button
      className="landmark-hotspot"
      style={{ "--x": landmark.x, "--y": landmark.y }}
      aria-label={`Explore ${landmark.geographicName}`}
      aria-pressed={selected}
      data-landmark-id={landmark.id}
      onClick={() => onSelect(landmark.id)}
    >
      <span className="sr-only">{landmark.geographicName}</span>
    </button>
  );
}
```

The hotspot has no modern pin. Its resting boundary is invisible; hover, focus, and selected states use an oxblood ink-ring asset or a restrained outline aligned to existing map artwork.

- [ ] **Step 5: Implement the map and artifact controls**

`MapViewport.jsx` must:

- Render `miami-beach-base.webp` as the full visual plate.
- Transform the artwork, route layer, living-ink layer, and hotspots as one coordinate space.
- Render all eighteen landmarks.
- Mark the selected hotspot with `aria-pressed="true"`.
- Use a drag cursor only during pointer capture.
- Keep selection context visible when the place sheet opens.

`ArtifactControls.jsx` must:

- Use `compass.webp` as the compass control.
- Use Phosphor `Plus`, `Minus`, and `ArrowCounterClockwise` icons at thin weight for zoom and reset.
- Provide visible focus states and full accessible names.
- Avoid a modern toolbar container; place controls directly along the parchment edge.

- [ ] **Step 6: Wire selection into App**

Use this state contract in `src/App.jsx`:

```jsx
import { useState } from "react";
import { MapViewport } from "./components/MapViewport.jsx";
import "./styles/tokens.css";
import "./styles/map.css";

export function App() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <main
      className="atlas-app"
      data-testid="atlas-app"
      role="application"
      aria-label="Mischief Atlas — Miami Beach"
    >
      <MapViewport selectedId={selectedId} onSelect={setSelectedId} />
    </main>
  );
}
```

- [ ] **Step 7: Implement the map CSS**

`map.css` must establish:

- `.atlas-app { width: 100vw; height: 100dvh; overflow: hidden; background: var(--ink-900); }`
- A `1440 / 1024` artwork ratio using `object-fit: cover` only when it does not crop the island.
- Stable parchment texture under the moving cartography.
- Layer order: paper grain, base map, ink route, footprints, hotspots, controls, place sheet.
- Focus outline of at least `2px` with `3px` offset.
- No rounded white surfaces, gradients, or drop shadows except physically motivated paper depth.

- [ ] **Step 8: Run tests and commit**

Run:

```bash
npm test -- tests/map-viewport.test.jsx
git add src tests/map-viewport.test.jsx
git commit -m "feat: add interactive Miami Beach map viewport"
```

Expected: PASS.

### Task 5: Build the unfolding place sheet and rename flow

**Files:**
- Create: `src/components/PlaceSheet.jsx`
- Create: `src/styles/place-sheet.css`
- Modify: `src/App.jsx`
- Test: `tests/place-sheet.test.jsx`

**Interfaces:**
- Consumes: `getLandmark(selectedId)`.
- Produces: `PlaceSheet({ landmark, onClose, onRename })`; `onRename(id, displayName)`.

- [ ] **Step 1: Write the failing place-sheet test**

Create `tests/place-sheet.test.jsx`:

```jsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../src/App.jsx";

describe("Ocean Drive place sheet", () => {
  it("opens, renames, expands, and refolds", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Explore Ocean Drive" }));
    expect(screen.getByRole("dialog", { name: "Ocean Drive" })).toBeInTheDocument();
    expect(screen.getByText("Where luminous nights are kept.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Rename this place" }));
    const input = screen.getByRole("textbox", { name: "Place name" });
    await user.clear(input);
    await user.type(input, "Films That Feel Like Memory");
    await user.click(screen.getByRole("button", { name: "Keep this name" }));
    expect(screen.getByRole("dialog", { name: "Films That Feel Like Memory" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Inside" }));
    expect(screen.getByText("Threshold")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Refold place sheet" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
npm test -- tests/place-sheet.test.jsx
```

Expected: FAIL because selection does not open a dialog.

- [ ] **Step 3: Implement place-sheet state**

`PlaceSheet.jsx` must:

- Return `null` when `landmark` is null.
- Render a semantic `dialog` with `aria-modal="false"` so the map remains interactive.
- Focus the title on open without trapping focus.
- Use `place-sheet.webp` as the entire paper boundary and shadow.
- Use the Ocean Drive vignette only when available.
- Render geographic identity below a renamed display name.
- Support one active accordion section at a time.
- Validate rename input with trimmed length `1..60`.
- Keep invalid input in edit state with “Give this place a name between 1 and 60 characters.”
- Refold through `onClose`.

- [ ] **Step 4: Store prototype renames in App session state**

Use:

```js
const [renames, setRenames] = useState({});

function renamePlace(id, displayName) {
  setRenames((current) => ({ ...current, [id]: displayName }));
}
```

Derive the selected landmark with:

```js
const baseLandmark = getLandmark(selectedId);
const selectedLandmark = baseLandmark
  ? { ...baseLandmark, displayName: renames[selectedId] ?? baseLandmark.displayName }
  : null;
```

Do not add storage APIs.

- [ ] **Step 5: Implement the paper-sheet CSS**

`place-sheet.css` must:

- Match the reference's lower-right position, approximate `420px` width, and parchment-edge silhouette.
- Use the blank generated sheet as the full background so torn edges and curl are not CSS drawings.
- Animate from `translate3d(38px, 26px, 0) rotate(.7deg) scale(.96)` to rest.
- Use `var(--font-cartographic)` for title and `var(--font-hand)` for subtitle and rename action.
- Keep body copy at least `16px`.
- Use thin ink rules between accordion rows.
- Use Phosphor caret and close icons; no text-glyph arrows.
- At widths below `900px`, become a bottom sheet while preserving map context.

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm test -- tests/place-sheet.test.jsx
git add src tests/place-sheet.test.jsx
git commit -m "feat: add unfolding landmark place sheet"
```

Expected: PASS.

### Task 6: Add living ink, footprints, and reduced-motion behavior

**Files:**
- Create: `src/components/LivingInk.jsx`
- Create: `src/styles/motion.css`
- Create: `src/styles/responsive.css`
- Modify: `src/components/MapViewport.jsx`
- Modify: `src/App.jsx`
- Test: `tests/living-ink.test.jsx`

**Interfaces:**
- Consumes: `selectedId`, map scale, generated route and footprint assets.
- Produces: `LivingInk({ selectedId, reducedMotion })`; body class `motion-reduced`.

- [ ] **Step 1: Write the failing motion-semantics test**

Create `tests/living-ink.test.jsx`:

```jsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../src/App.jsx";

describe("living ink", () => {
  it("ties route and footprints to the selected landmark", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByTestId("living-ink")).toHaveAttribute("data-state", "idle");

    await user.click(screen.getByRole("button", { name: "Explore Ocean Drive" }));
    expect(screen.getByTestId("living-ink")).toHaveAttribute("data-state", "ocean-drive");
    expect(screen.getAllByAltText("").length).toBeGreaterThanOrEqual(6);
  });

  it("exposes a reduced-motion control", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Reduce map motion" }));
    expect(screen.getByTestId("atlas-app")).toHaveClass("motion-reduced");
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
npm test -- tests/living-ink.test.jsx
```

Expected: FAIL because the living-ink layer and motion control do not exist.

- [ ] **Step 3: Implement the living-ink component**

Render:

- One full-size `miami-beach-ink-route.webp` image whose opacity and mask-position resolve on Ocean Drive selection.
- Six alternating footprint images positioned along the selected route, each with `alt=""` and `aria-hidden="true"`.
- One `aria-live="polite"` status outside the decorative layer with the sentence “Ocean Drive revealed. Place sheet opened.”
- `data-state="idle"` or `data-state={selectedId}`.

Use staggered custom properties `--step-index: 0..5`; do not draw footprints in CSS.

- [ ] **Step 4: Implement meaningful motion**

`motion.css` must define:

- `ink-resolve`: opacity `.08 → .88` and slight contrast increase over `700ms`.
- `footstep-arrive`: opacity `0 → .92 → .55` with a `4px` forward translation over `900ms`.
- `place-unfold`: transform and opacity over `620ms`.
- `label-develop`: blur `1.5px → 0`, opacity `.35 → 1` over `520ms`.
- No infinite animation except an idle ink-breath below `2%` opacity change over at least `12s`.
- All idle animation pauses while `:focus-within`, pointer drag, or a place sheet is open.

- [ ] **Step 5: Implement explicit and system reduced motion**

Add a parchment-edge motion toggle labeled “Reduce map motion” / “Restore map motion.” Initialize from `matchMedia("(prefers-reduced-motion: reduce)")`.

Under `.motion-reduced` and the media query:

```css
*, *::before, *::after {
  animation-duration: 1ms !important;
  animation-iteration-count: 1 !important;
  scroll-behavior: auto !important;
  transition-duration: 1ms !important;
}
```

Selected routes and footprints must still appear in their final state.

- [ ] **Step 6: Add responsive preservation rules**

`responsive.css` must:

- Maintain the island in view from `1024px` upward.
- Convert the place sheet to a bottom sheet below `900px`.
- Increase hotspot target area to at least `44 × 44px` for coarse pointers.
- Prevent controls or place sheet from covering Ocean Drive at the canonical selected state.
- Preserve keyboard zoom and reset on every viewport.

- [ ] **Step 7: Run tests and commit**

Run:

```bash
npm test -- tests/living-ink.test.jsx
git add src tests/living-ink.test.jsx
git commit -m "feat: animate meaningful living-ink states"
```

Expected: PASS.

### Task 7: Integrate, verify, and pass design QA

**Files:**
- Modify as findings require: `src/components/*.jsx`, `src/styles/*.css`
- Create: `implementation-miami-beach.png`
- Create: `comparison-miami-beach.png`
- Create: `design-qa.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: selected reference, completed prototype, all automated tests.
- Produces: browser-verified prototype and `design-qa.md` whose final line is exactly `final result: passed`.

- [ ] **Step 1: Record the durable selected direction**

Append to `AGENTS.md`:

```md
## Mischief Atlas visual contract

- The selected source of truth is Unfurled Cartographer, stored at
  `public/reference/miami-beach-unfurled-cartographer.webp`.
- Preserve one continuous map, South Beach density, oxblood living ink,
  blue-gray water, physical fold logic, and the lower-right unfolding place sheet.
- Do not replace the map with a generic dashboard, tile-map theme, modern pins,
  glass cards, or decorative animation without state meaning.
```

- [ ] **Step 2: Run the complete automated verification**

Run:

```bash
npm test
npm run build
npm run test:sites
```

Expected: all Vitest tests pass; the build produces `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`; the Sites worker test passes.

- [ ] **Step 3: Start and open the Work Mode preview**

Run:

```bash
sites-preview start "$PWD"
```

Open `http://terminal.local:4173/` in the cloud browser at exactly `1440 × 1024`.

Verify in the browser:

1. Drag the map and reset it.
2. Zoom in, zoom out, and use keyboard `+`, `-`, and `0`.
3. Tab to Ocean Drive and select it.
4. Rename it to “Films That Feel Like Memory.”
5. Expand “Inside.”
6. Refold the sheet.
7. Reopen Ocean Drive and enable reduced motion.
8. Confirm the browser console has no errors.

- [ ] **Step 4: Capture the canonical selected state**

Return the name to “Ocean Drive,” restore overview transform, select Ocean Drive, and capture the page at `1440 × 1024` to `implementation-miami-beach.png`.

Record:

- Source pixels: `1487 × 1058`
- Implementation capture: `1440 × 1024`
- CSS viewport: `1440 × 1024`
- Device scale factor: `1`
- State: Ocean Drive selected, place sheet open, standard motion final frame

- [ ] **Step 5: Create a normalized side-by-side comparison**

Run:

```bash
convert public/reference/miami-beach-unfurled-cartographer.webp   -resize 1440x1024! /tmp/mischief-reference-normalized.png
convert /tmp/mischief-reference-normalized.png implementation-miami-beach.png   +append comparison-miami-beach.png
```

Open `comparison-miami-beach.png` at original resolution. Use focused crops for the map center, Ocean Drive selection, and place sheet if their typography or asset quality cannot be judged in the full comparison.

- [ ] **Step 6: Write the first design-QA report**

Create `design-qa.md` with:

```md
# Design QA — Miami Beach Unfurled Cartographer

source visual truth path: public/reference/miami-beach-unfurled-cartographer.webp
implementation screenshot path: implementation-miami-beach.png
viewport: 1440 × 1024 CSS pixels
source pixels: 1487 × 1058
implementation pixels: 1440 × 1024
deviceScaleFactor: 1
state: Ocean Drive selected; place sheet open
full-view comparison evidence: comparison-miami-beach.png
focused region evidence: map center, Ocean Drive route, and place sheet crops
primary interactions tested: pan, reset, wheel zoom, button zoom, keyboard zoom,
landmark focus and selection, rename, accordion, refold, reduced motion
console errors checked: yes

**Findings**

List every visible mismatch as P0, P1, P2, or P3 with location, evidence,
impact, and a concrete fix.

**Comparison history**

Record each P0/P1/P2, the exact change made, and the post-fix screenshot path.

**Follow-up polish**

List only non-blocking P3 refinements.

final result: blocked
```

Replace the instructional sentences with concrete findings from the visible comparison.

- [ ] **Step 7: Fix every P0, P1, and P2 and repeat comparison**

For each iteration:

1. Apply the exact component, token, asset, crop, spacing, typography, or motion fix.
2. Run the affected test and `npm test`.
3. Recapture the same canonical state and viewport.
4. Rebuild the side-by-side comparison.
5. Record the earlier finding, change, and post-fix evidence in `design-qa.md`.

Stop only when the full comparison and necessary focused crops reveal no actionable P0, P1, or P2 issues.

- [ ] **Step 8: Mark QA passed and commit**

Set the final line of `design-qa.md` to:

```text
final result: passed
```

Run:

```bash
npm test
npm run build
npm run test:sites
git add AGENTS.md src public tests implementation-miami-beach.png comparison-miami-beach.png design-qa.md
git commit -m "feat: complete Miami Beach living map prototype"
```

Keep `sites-preview` running and the verified local prototype open in the cloud browser. Do not deploy.
