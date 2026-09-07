import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlass,
  Plus,
  Minus,
  Compass,
  Pause,
  Play,
  Footprints,
  X,
  CaretDown,
} from "@phosphor-icons/react";
import AtlasMap, { IslandInset, frameMap } from "./map/AtlasMap.jsx";
import PlaceSheet from "./PlaceSheet.jsx";
import { landmarks, landmarkById } from "./data/landmarks.js";
import { parseSavedAtlas, trafficSettings } from "./atlas-model.js";
import "@fontsource/im-fell-english/400.css";
import "@fontsource/im-fell-english/400-italic.css";
import "@fontsource/caveat/400.css";

export function App() {
  const map = useRef(null),
    search = useRef(null),
    [ready, setReady] = useState(false),
    [view, setView] = useState({ zoom: 14 }),
    [selected, setSelected] = useState("ocean-drive"),
    [whole, setWhole] = useState(false),
    [query, setQuery] = useState(""),
    [searchOpen, setSearchOpen] = useState(false),
    [searchIndex, setSearchIndex] = useState(0),
    [trafficOpen, setTrafficOpen] = useState(false),
    [preset, setPreset] = useState("steady"),
    [inkVisible, setInkVisible] = useState(true),
    [motion, setMotion] = useState(
      () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [saveError, setSaveError] = useState(false);
  const [saved, setSaved] = useState(() => {
    try {
      return parseSavedAtlas(localStorage.getItem("mischief-atlas-v1"));
    } catch {
      return { aliases: {}, rooms: {} };
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("mischief-atlas-v1", JSON.stringify(saved));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [saved]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)"),
      change = (e) => setMotion(!e.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const results = landmarks
    .filter((p) =>
      `${p.name} ${saved.aliases[p.id] || ""}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
    )
    .slice(0, 8);
  function choose(id, fly = false) {
    setSelected(id);
    setSearchOpen(false);
    if (fly && map.current) {
      const p = landmarkById[id];
      map.current.flyTo({
        center: p.coordinates,
        zoom: Math.max(15, map.current.getZoom()),
        offset: [innerWidth < 700 ? 0 : 160, innerWidth < 700 ? -70 : 0],
        duration: motion ? 1000 : 0,
      });
      setWhole(false);
    }
  }
  function toggleIsland() {
    if (!map.current) return;
    frameMap(map.current, !whole, motion);
    setWhole(!whole);
  }
  function renamePlace(name) {
    setSaved((s) => {
      const aliases = { ...s.aliases };
      if (name === landmarkById[selected].name) delete aliases[selected];
      else aliases[selected] = name;
      return { ...s, aliases };
    });
  }
  function handleKey(e) {
    if (e.key === "Escape") {
      setSearchOpen(false);
      search.current.blur();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchOpen(true);
      setSearchIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[searchIndex]) {
      e.preventDefault();
      choose(results[searchIndex].id, true);
    }
  }
  return (
    <main
      className={`atlas-app ${motion ? "motion-on" : "motion-off"} ${selected ? "has-sheet" : ""}`}
    >
      <AtlasMap
        onReady={(m) => {
          map.current = m;
          setReady(true);
        }}
        onView={setView}
        selected={selected}
        aliases={saved.aliases}
        onSelect={choose}
        motion={motion}
        preset={preset}
        inkVisible={inkVisible}
      />
      <header className="masthead">
        <p className="edition">
          A PERSONAL ATLAS <span>·</span> VOLUME I
        </p>
        <h1>
          Mischief
          <br />
          <span>Atlas</span>
        </h1>
        <div className="title-rule">
          <span>MIAMI BEACH</span>
        </div>
        <p className="title-note">For the places you keep within.</p>
        <div className="search-wrap">
          <MagnifyingGlass size={21} weight="light" />
          <input
            ref={search}
            role="combobox"
            aria-label="Find a place"
            aria-expanded={searchOpen}
            aria-controls="place-results"
            aria-autocomplete="list"
            aria-activedescendant={
              searchOpen && results[searchIndex]
                ? `result-${results[searchIndex].id}`
                : undefined
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchIndex(0);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={handleKey}
            placeholder="Where shall we wander?"
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                search.current.focus();
              }}
            >
              <X size={16} />
            </button>
          )}
          {searchOpen && (
            <>
              <button
                className="search-dismiss"
                aria-label="Dismiss search"
                onClick={() => setSearchOpen(false)}
                tabIndex={-1}
              />
              <div className="search-results" role="listbox" id="place-results">
                {results.length ? (
                  results.map((p, i) => (
                    <button
                      key={p.id}
                      id={`result-${p.id}`}
                      role="option"
                      aria-selected={i === searchIndex}
                      onMouseEnter={() => setSearchIndex(i)}
                      onClick={() => choose(p.id, true)}
                    >
                      <span>
                        {saved.aliases[p.id] || p.name}
                        {saved.aliases[p.id] && <small>{p.name}</small>}
                      </span>
                      <em>{p.kind}</em>
                    </button>
                  ))
                ) : (
                  <p>No place by that name. Try “garden” or “pier”.</p>
                )}
              </div>
            </>
          )}
        </div>
      </header>
      <IslandInset whole={whole} onClick={toggleIsland} />
      <div className="marginal-note" aria-hidden="true">
        Not all who wander
        <br />
        <span>are lost to memory.</span>
      </div>
      {selected ? (
        <PlaceSheet
          place={landmarkById[selected]}
          alias={saved.aliases[selected]}
          rooms={saved.rooms[selected] || []}
          onRename={renamePlace}
          onRooms={(rooms) =>
            setSaved((s) => ({
              ...s,
              rooms: { ...s.rooms, [selected]: rooms },
            }))
          }
          onClose={() => setSelected(null)}
        />
      ) : (
        <div className="folded-invitation">
          <p>A city full of stories.</p>
          <span>Touch a landmark to begin.</span>
        </div>
      )}
      {saveError && (
        <div className="save-notice" role="status">
          Your browser couldn’t save these changes. Keep this tab open.
        </div>
      )}
      <aside className="map-tools" aria-label="Map controls">
        <button
          className="compass-button"
          aria-label="Return to South Beach"
          onClick={() => {
            if (map.current) {
              frameMap(map.current, false, motion);
              setWhole(false);
            }
          }}
        >
          <span>N</span>
          <Compass weight="thin" size={76} />
        </button>
        <div className="zoom-buttons">
          <button
            aria-label="Zoom in"
            disabled={!ready || view.zoom >= 18.25}
            onClick={() => map.current.zoomIn({ duration: motion ? 450 : 0 })}
          >
            <Plus size={21} />
          </button>
          <button
            aria-label="Zoom out"
            disabled={!ready || view.zoom <= 11.45}
            onClick={() => map.current.zoomOut({ duration: motion ? 450 : 0 })}
          >
            <Minus size={21} />
          </button>
        </div>
        <span className="zoom-label">
          {view.zoom >= 15
            ? "Closer still"
            : view.zoom >= 13.3
              ? "Street level"
              : "Island view"}
        </span>
      </aside>
      <div className="living-controls">
        <button
          className="ink-status"
          aria-expanded={trafficOpen}
          aria-controls="traffic-panel"
          onClick={() => setTrafficOpen(!trafficOpen)}
        >
          <Footprints size={18} />
          <span>
            {!inkVisible
              ? "Ink at rest"
              : view.zoom < 13.3
                ? "Zoom closer to find the footsteps"
                : trafficSettings(preset).label}
          </span>
          <CaretDown size={13} />
        </button>
        <button
          className="motion-button"
          onClick={() => setMotion(!motion)}
          aria-label={motion ? "Pause animations" : "Resume animations"}
          aria-pressed={!motion}
        >
          {motion ? <Pause size={15} /> : <Play size={15} />}
          <span>{motion ? "Pause" : "Resume"}</span>
        </button>
        {trafficOpen && (
          <section
            className="traffic-panel"
            id="traffic-panel"
            aria-label="Living ink settings"
          >
            <div>
              <h3>The city has a rhythm.</h3>
              <button
                className="icon-button"
                aria-label="Close living ink settings"
                onClick={() => setTrafficOpen(false)}
              >
                <X size={17} />
              </button>
            </div>
            <p>
              Footsteps gather on busier streets and slow as the crowds grow.
            </p>
            <label htmlFor="traffic-rhythm">Set the rhythm</label>
            <select
              id="traffic-rhythm"
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
            >
              <option value="quiet">A quiet morning</option>
              <option value="steady">The city stirring</option>
              <option value="busy">A crowded evening</option>
            </select>
            <label className="ink-checkbox">
              <input
                type="checkbox"
                checked={inkVisible}
                onChange={(e) => setInkVisible(e.target.checked)}
              />{" "}
              Reveal footsteps at street level
            </label>
            <small>
              Illustrative traffic, not live conditions. Anonymous trails follow
              mapped streets.
            </small>
          </section>
        )}
      </div>
      <footer className="atlas-footer">
        <span>
          CHAPTER I <span className="sep">/</span>{" "}
          {whole ? "MIAMI BEACH" : "SOUTH BEACH"}
        </span>
        <span className="map-attribution">
          Map ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap
          </a>{" "}
          ·{" "}
          <a href="https://openfreemap.org" target="_blank" rel="noreferrer">
            OpenFreeMap
          </a>{" "}
          ·{" "}
          <a href="https://openmaptiles.org" target="_blank" rel="noreferrer">
            OpenMapTiles
          </a>
        </span>
      </footer>
      {!ready && (
        <div className="map-loading" role="status">
          Waking the ink…
        </div>
      )}
    </main>
  );
}
