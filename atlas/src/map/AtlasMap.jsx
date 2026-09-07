import { useEffect, useRef, useState } from "react";
import { InkMap } from "./InkMap.js";
import {
  Tree,
  Buildings,
  MusicNotes,
  MapPin,
  Anchor,
  Bridge,
} from "@phosphor-icons/react";
import { landmarks } from "../data/landmarks.js";
import TrafficInk from "./TrafficInk.jsx";
import { publicUrl } from "../public-url.js";
const icons = {
  Park: Tree,
  Garden: Tree,
  Music: MusicNotes,
  Harbor: Anchor,
  Causeway: Bridge,
};
export function frameMap(map, whole = false, animate = true) {
  const width = map.getContainer().clientWidth,
    mobile = width < 700;
  map.fitBounds(
    whole
      ? [
          [-80.157, 25.76],
          [-80.115, 25.882],
        ]
      : [
          [-80.145, 25.762],
          [-80.119, 25.8003],
        ],
    {
      padding: {
        left: mobile ? 35 : width * 0.35,
        right: mobile ? 35 : width * 0.08,
        top: mobile ? 145 : 45,
        bottom: mobile ? 260 : 75,
      },
      duration: animate ? 1100 : 0,
      maxZoom: 15.2,
    },
  );
}
export default function AtlasMap({
  onReady,
  onView,
  selected,
  aliases,
  onSelect,
  motion,
  preset,
  inkVisible,
}) {
  const container = useRef(null),
    [map, setMap] = useState(null),
    [view, setView] = useState({
      zoom: 14,
      points: [],
      width: 1440,
      height: 1024,
    }),
    [error, setError] = useState("");
  const callbacks = useRef({ onReady, onView });
  callbacks.current = { onReady, onView };
  useEffect(() => {
    let disposed = false,
      instance;
    document.fonts.load('16px "IM Fell English"').then(() => {
      if (disposed) return;
      try {
        instance = new InkMap({
          container: container.current,
          center: [-80.133, 25.782],
          zoom: 14,
        });
        instance.touchZoomRotate.disableRotation();
        const update = () => {
          if (disposed) return;
          const v = {
            zoom: instance.getZoom(),
            width: container.current.clientWidth,
            height: container.current.clientHeight,
            points: landmarks.map((p) => ({
              ...p,
              point: instance.project(p.coordinates),
            })),
          };
          setView(v);
          callbacks.current.onView(v);
        };
        instance.on("load", () => {
          frameMap(instance, false, false);
          setMap(instance);
          callbacks.current.onReady(instance);
          update();
        });
        instance.on("move", update);
        instance.on("resize", update);
        instance.on("error", (e) => {
          console.warn("Map resource:", e.error?.message);
        });
      } catch {
        setError("The map could not wake. Please reload the page.");
      }
    });
    return () => {
      disposed = true;
      instance?.remove();
    };
  }, []);
  const occupied = [];
  const visible = view.points
    .slice()
    .sort(
      (a, b) =>
        (a.id === selected ? -10 : a.asset ? -2 : a.priority) -
        (b.id === selected ? -10 : b.asset ? -2 : b.priority),
    )
    .filter((p) => {
      const { x, y } = p.point;
      if (x < 10 || x > view.width - 15 || y < 15 || y > view.height - 25)
        return false;
      if (
        p.id !== selected &&
        view.zoom < 13.3 &&
        ![
          "fontainebleau",
          "bandshell",
          "north-beach",
          "ocean-drive",
          "pier",
          "garden",
        ].includes(p.id)
      )
        return false;
      if (p.id !== selected && view.zoom < 14.5 && p.priority > 2) return false;
      const box = {
        x: x - (p.asset ? 54 : 52),
        y: y - (p.asset ? 65 : 20),
        w: p.asset ? 108 : 104,
        h: p.asset ? 80 : 38,
      };
      if (
        p.id !== selected &&
        occupied.some(
          (b) =>
            box.x < b.x + b.w &&
            box.x + box.w > b.x &&
            box.y < b.y + b.h &&
            box.y + box.h > b.y,
        )
      )
        return false;
      occupied.push(box);
      return true;
    });
  return (
    <div
      className="atlas-map-shell"
      aria-label="Interactive illustrated map of Miami Beach"
    >
      <div
        ref={container}
        className="atlas-map"
        aria-label="Map. Drag to explore; scroll to zoom."
      />
      {error && (
        <p className="map-error" role="alert">
          {error}
        </p>
      )}
      <TrafficInk
        map={map}
        motion={motion}
        preset={preset}
        visible={inkVisible}
      />
      <div className="landmark-layer">
        {visible.map((p) => {
          const Icon = icons[p.kind] || Buildings;
          return (
            <button
              key={p.id}
              className={`landmark ${p.asset ? "illustrated" : ""} ${selected === p.id ? "selected" : ""}`}
              style={{ left: p.point.x, top: p.point.y }}
              onClick={() => onSelect(p.id)}
              aria-label={`Open ${aliases[p.id] || p.name}`}
              aria-pressed={selected === p.id}
            >
              {p.asset ? (
                <img src={publicUrl(`assets/${p.asset}.webp`)} alt="" draggable="false" />
              ) : (
                <Icon size={20} weight="light" />
              )}
              <span>{aliases[p.id] || p.name}</span>
              <i className="place-anchor">
                <MapPin size={10} weight="fill" />
              </i>
            </button>
          );
        })}
      </div>
      <span className="ocean-inscription">
        The Atlantic
        <br />
        <em>Here, the ink meets the tide.</em>
      </span>
    </div>
  );
}
export function IslandInset({ onClick, whole }) {
  const ref = useRef(null);
  useEffect(() => {
    const map = new InkMap({ container: ref.current, interactive: false });
    map.fitBounds(
      [
        [-80.159, 25.76],
        [-80.113, 25.886],
      ],
      { padding: 4, duration: 0 },
    );
    return () => map.remove();
  }, []);
  return (
    <button
      className="island-inset"
      onClick={onClick}
      aria-label={whole ? "Return to South Beach" : "Explore the whole island"}
    >
      <span className="inset-kicker">The wider world</span>
      <div className="inset-map" ref={ref} />
      <span>
        {whole ? "Return to South Beach" : "The whole island"}{" "}
        <span aria-hidden="true">↗</span>
      </span>
    </button>
  );
}
