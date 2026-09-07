import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { InkMap } from "./InkMap.js";
import {
  Tree,
  Buildings,
  MusicNotes,
  MapPin,
  Anchor,
  Bridge,
  Coffee,
  BookOpen,
  ForkKnife,
  Storefront,
  GraduationCap,
  Bed,
  Wine,
  Crosshair,
} from "@phosphor-icons/react";
import { illustrationPath } from "../data/personal-art.js";
import TrafficInk from "./TrafficInk.jsx";
import { publicUrl } from "../public-url.js";
const icons = {
  Park: Tree,
  Garden: Tree,
  Music: MusicNotes,
  Harbor: Anchor,
  Causeway: Bridge,
  Café: Coffee,
  Library: BookOpen,
  Restaurant: ForkKnife,
  Bakery: Storefront,
  Market: Storefront,
  School: GraduationCap,
  Hotel: Bed,
  Bar: Wine,
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
  places,
  exploring,
  onExplore,
  placement,
  onPlace,
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
  const callbacks = useRef({});
  const selectedLabel = useRef(null);
  const [ribbon, setRibbon] = useState(null);
  useLayoutEffect(() => {
    const place = places.find((p) => p.id === selected);
    if (!map || !place || !selectedLabel.current) {
      setRibbon(null);
      return;
    }
    const rect = selectedLabel.current.getBoundingClientRect();
    const root = container.current.getBoundingClientRect();
    const point = map.project(place.coordinates);
    const tools = document.querySelector(".map-tools")?.getBoundingClientRect();
    const overlapsTools =
      tools &&
      rect.right > tools.left - 10 &&
      rect.left < tools.right + 10 &&
      rect.bottom > tools.top - 10 &&
      rect.top < tools.bottom + 10;
    const top = overlapsTools ? tools.top - rect.height - 16 : rect.top;
    setRibbon({
      coordinates: place.coordinates,
      name: aliases[place.id] || place.name,
      width: rect.width,
      x: rect.left - root.left + rect.width / 2 - point.x,
      y: top - root.top - point.y,
      leader: rect.top - top,
    });
  }, [map, selected, aliases, view, places]);
  const markers = useRef(new Map()),
    draftPin = useRef(null);
  callbacks.current = { onReady, onView, onExplore, onPlace, placement };
  useEffect(() => {
    let disposed = false,
      instance,
      positionFrame;
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
            center: instance.getCenter(),
            width: container.current.clientWidth,
            height: container.current.clientHeight,
          };
          setView(v);
          callbacks.current.onView(v);
        };
        // Keep geography attached to the camera without reconciling the React tree
        // on every animation frame. Re-evaluate label density when movement settles.
        const position = () => {
          if (positionFrame) return;
          positionFrame = requestAnimationFrame(() => {
            positionFrame = null;
            if (disposed) return;
            for (const {
              node,
              coordinates,
              offset,
            } of markers.current.values()) {
              const p = instance.project(coordinates);
              node.style.left = `${p.x + (offset?.x || 0)}px`;
              node.style.top = `${p.y + (offset?.y || 0)}px`;
            }
            const coordinates = callbacks.current.placement?.coordinates;
            if (coordinates && draftPin.current) {
              const p = instance.project(coordinates);
              draftPin.current.style.left = `${p.x}px`;
              draftPin.current.style.top = `${p.y}px`;
            }
          });
        };
        instance.on("load", () => {
          frameMap(instance, false, false);
          setMap(instance);
          callbacks.current.onReady(instance);
          update();
        });
        instance.on("move", position);
        instance.on("moveend", update);
        instance.on("resize", update);
        instance.on("dragstart", () => callbacks.current.onExplore());
        instance.on("click", (e) => {
          if (callbacks.current.placement)
            callbacks.current.onPlace([e.latlng.lng, e.latlng.lat]);
          else callbacks.current.onExplore();
        });
        instance.on("error", (e) => {
          console.warn("Map resource:", e.error?.message);
        });
      } catch {
        setError("The map could not wake. Please reload the page.");
      }
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(positionFrame);
      instance?.remove();
    };
  }, []);
  // Reserve UI space before placing subordinate map labels. No layout reads during motion.
  const mobile = view.width < 700;
  const occupied = [
    {
      x: view.width - (mobile ? 340 : 355),
      y: view.height - (mobile ? 140 : 187),
      w: mobile ? 340 : 355,
      h: mobile ? 140 : 187,
    },
    {
      x: 0,
      y: 0,
      w: mobile ? view.width - 90 : 325,
      h: exploring ? 120 : mobile ? 270 : 300,
    },
    {
      x: view.width - (mobile ? 90 : 160),
      y: 0,
      w: mobile ? 90 : 160,
      h: exploring ? 145 : 250,
    },
  ];
  if (selected)
    occupied.push({
      x: 0,
      y: view.height - (mobile ? 480 : 420),
      w: mobile ? view.width : Math.min(500, view.width * 0.4),
      h: mobile ? 480 : 420,
    });
  // Project current React data on every view change; new landmarks appear immediately.
  const visible = (
    map ? places.map((p) => ({ ...p, point: map.project(p.coordinates) })) : []
  )
    .sort(
      (a, b) =>
        (a.id === selected
          ? -10
          : a.source === "personal"
            ? -5
            : a.asset
              ? -2
              : a.priority) -
        (b.id === selected
          ? -10
          : b.source === "personal"
            ? -5
            : b.asset
              ? -2
              : b.priority),
    )
    .filter((p) => {
      const { x, y } = p.point;
      if (x < 10 || x > view.width - 15 || y < 15 || y > view.height - 25)
        return false;
      if (
        p.id !== selected &&
        p.source !== "personal" &&
        view.zoom < 12.7 &&
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
      if (p.id !== selected && p.minZoom && view.zoom < p.minZoom) return false;
      if (p.id !== selected && view.zoom < 14.5 && p.priority > 2) return false;
      const illustrated = !!illustrationPath(p);
      const minor = p.source === "snapshot";
      const labelWidth = Math.min(
        minor ? 138 : 150,
        Math.max(76, (aliases[p.id] || p.name).length * (minor ? 6 : 7)),
      );
      const box = {
        x: x - Math.max(labelWidth, illustrated ? 130 : 0) / 2,
        y: y - (illustrated ? 94 : 46),
        w: Math.max(labelWidth, illustrated ? 130 : 0),
        h: illustrated ? 125 : 64,
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
      className={`atlas-map-shell ${placement ? "placing-landmark" : ""}`}
      aria-label="Interactive illustrated map of Miami Beach"
    >
      <div
        ref={container}
        className="atlas-map"
        tabIndex={0}
        aria-label={
          placement
            ? "Choose landmark location. Arrow keys move the map; Enter places at centre; Escape cancels."
            : "Map. Drag to explore; scroll to zoom."
        }
        onWheelCapture={onExplore}
        onTouchStart={(e) => {
          if (e.touches.length > 1) onExplore();
        }}
        onKeyDown={(e) => {
          if (placement && e.key === "Enter") {
            e.preventDefault();
            onPlace(map.getCenter());
          } else if (
            [
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "+",
              "-",
              "=",
            ].includes(e.key)
          )
            onExplore();
        }}
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
              ref={(node) => {
                if (node)
                  markers.current.set(p.id, {
                    node,
                    coordinates: p.coordinates,
                  });
                else markers.current.delete(p.id);
              }}
              className={`landmark ${illustrationPath(p) ? "illustrated" : ""} ${p.source === "personal" ? "personal" : ""} ${p.source === "snapshot" ? "neighborhood" : ""} ${selected === p.id ? "selected" : ""}`}
              style={{ left: p.point.x, top: p.point.y }}
              onClick={() => onSelect(p.id)}
              aria-label={`Open ${aliases[p.id] || p.name}`}
              aria-pressed={selected === p.id}
              tabIndex={placement ? -1 : 0}
            >
              {illustrationPath(p) ? (
                <img
                  src={publicUrl(illustrationPath(p))}
                  alt=""
                  draggable="false"
                />
              ) : (
                <Icon size={20} weight="light" />
              )}
              <span ref={p.id === selected ? selectedLabel : null}>
                {aliases[p.id] || p.name}
              </span>
              {p.source === "personal" && <small>Your place</small>}
              <i className="place-anchor">
                <MapPin size={10} weight="fill" />
              </i>
            </button>
          );
        })}
      </div>
      {ribbon && selected && (
        <span
          className="selection-ribbon"
          aria-hidden="true"
          ref={(node) => {
            if (node)
              markers.current.set("selected-ribbon", {
                node,
                coordinates: ribbon.coordinates,
                offset: ribbon,
              });
            else markers.current.delete("selected-ribbon");
          }}
          style={{
            left: map.project(ribbon.coordinates).x + ribbon.x,
            top: map.project(ribbon.coordinates).y + ribbon.y,
            width: ribbon.width,
          }}
        >
          {ribbon.name}
          {ribbon.leader > 0 && (
            <i className="ribbon-leader" style={{ height: ribbon.leader }} />
          )}
        </span>
      )}
      {placement &&
        (placement.coordinates ? (
          <div
            ref={draftPin}
            className="draft-pin"
            style={{
              left: map?.project(placement.coordinates).x,
              top: map?.project(placement.coordinates).y,
            }}
          >
            <MapPin size={32} weight="fill" />
            <span>Your landmark goes here</span>
          </div>
        ) : (
          <div className="placement-crosshair" aria-hidden="true">
            <Crosshair size={34} weight="light" />
          </div>
        ))}
      {map &&
        view.zoom < 14.4 &&
        [
          {
            id: "atlantic",
            name: "The Atlantic",
            coordinates: [-80.112, 25.787],
          },
          {
            id: "biscayne",
            name: "Biscayne Bay",
            coordinates: [-80.169, 25.819],
          },
        ].map((p) => {
          const point = map.project(p.coordinates);
          if (
            point.x < 135 ||
            point.x > view.width - 130 ||
            point.y < 165 ||
            point.y > view.height - 200
          )
            return null;
          return (
            <svg
              key={p.id}
              className="geographic-lettering"
              aria-hidden="true"
              viewBox="0 0 260 80"
              style={{ left: point.x, top: point.y }}
              ref={(node) => {
                if (node)
                  markers.current.set(`geo-${p.id}`, {
                    node,
                    coordinates: p.coordinates,
                  });
                else markers.current.delete(`geo-${p.id}`);
              }}
            >
              <defs>
                <path id={`name-arc-${p.id}`} d="M 10,52 Q 130,12 250,52" />
              </defs>
              <text textAnchor="middle">
                <textPath href={`#name-arc-${p.id}`} startOffset="50%">
                  {p.name}
                </textPath>
              </text>
            </svg>
          );
        })}
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
