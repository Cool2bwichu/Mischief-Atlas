import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Feather,
  Plus,
  X,
  Check,
  DoorOpen,
  Buildings,
} from "@phosphor-icons/react";
import { normalizeName, createRoom } from "./atlas-model.js";
import { publicUrl } from "./public-url.js";
import InkDrawing from "./InkDrawing.jsx";
import { illustrationPath } from "./data/personal-art.js";
export default function PlaceSheet({
  place,
  motion,
  open,
  alias,
  rooms,
  onRename,
  onRooms,
  onClose,
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(open));
    return () => cancelAnimationFrame(frame);
  }, [open]);
  const [unfolded, setUnfolded] = useState(false),
    [renaming, setRenaming] = useState(false),
    [draft, setDraft] = useState(""),
    [error, setError] = useState(""),
    [adding, setAdding] = useState(false),
    [room, setRoom] = useState(null);
  useEffect(() => {
    setUnfolded(false);
    setRenaming(false);
    setAdding(false);
    setRoom(null);
    setError("");
  }, [place.id]);
  function rename(e) {
    e.preventDefault();
    try {
      onRename(normalizeName(draft));
      setRenaming(false);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  function addRoom(e) {
    e.preventDefault();
    try {
      onRooms([...rooms, createRoom(draft, rooms)]);
      setAdding(false);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <section
      className={`place-sheet ${unfolded ? "unfolded" : ""} ${entered && open ? "sheet-open" : "sheet-closed"}`}
      aria-hidden={!open}
      inert={!open}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
      aria-label={`${alias || place.name} place card`}
    >
      <div className="paper-leaves" aria-hidden="true">
        <i className="paper-leaf leaf-cover" />
        <i className="paper-leaf leaf-inner" />
      </div>
      <div className="sheet-topline">
        <span>
          MIAMI BEACH <span className="sep">/</span>{" "}
          {room
            ? "A MEMORY ROOM"
            : unfolded
              ? "WITHIN THIS PLACE"
              : place.kind.toUpperCase()}
        </span>
        <button
          className="icon-button close-sheet"
          aria-label="Close place card"
          onClick={onClose}
        >
          <X size={19} />
        </button>
      </div>
      {room ? (
        <>
          <button className="back-link" onClick={() => setRoom(null)}>
            <ArrowLeft size={15} /> Back to the rooms
          </button>
          <h2>{room.name}</h2>
          <p className="sheet-subtitle">
            Every idea deserves a room of its own.
          </p>
          <img
            className="room-illustration"
            src={publicUrl("assets/interior.webp")}
            alt="An imagined ink-drawn interior with a library, courtyard, and stairway"
          />
          <p className="room-note">
            Your room is named and ready. Memory entries will come in the next
            chapter.
          </p>
          <button
            className="back-link"
            onClick={() => {
              onRooms(rooms.filter((r) => r.id !== room.id));
              setRoom(null);
            }}
          >
            Remove this empty room
          </button>
        </>
      ) : (
        <>
          {renaming ? (
            <form className="name-form" onSubmit={rename}>
              <label htmlFor="place-name">What will this place hold?</label>
              <input
                id="place-name"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={60}
                autoFocus
              />
              <div>
                <button type="submit">
                  <Check size={16} /> Save name
                </button>
                <button type="button" onClick={() => setRenaming(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <h2>{alias || place.name}</h2>
          )}
          {alias && <p className="original-name">on the map: {place.name}</p>}
          <p className="sheet-subtitle">
            {unfolded ? "A little larger on the inside." : place.subtitle}
          </p>
          <div className="sheet-visual">
            <div
              className="unfold-content"
              hidden={!unfolded}
              inert={!unfolded}
            >
              <img
                className="interior-illustration"
                src={publicUrl("assets/interior.webp")}
                alt="Illustrative memory rooms: a stairway, courtyard, and library"
              />
              <span className="illustration-caption">
                An imagined interior · yours to give meaning
              </span>
              <div className="room-list">
                {rooms.map((r, i) => (
                  <button key={r.id} onClick={() => setRoom(r)}>
                    <span className="room-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{r.name}</span>
                    <ArrowRight size={16} />
                  </button>
                ))}
                {rooms.length < 30 && !adding && (
                  <button
                    className="add-room"
                    onClick={() => {
                      setAdding(true);
                      setDraft("");
                      setError("");
                    }}
                  >
                    <Plus size={16} />{" "}
                    {rooms.length ? "Add a room" : "Name your first room"}
                  </button>
                )}
              </div>
              {adding && (
                <form className="room-form" onSubmit={addRoom}>
                  <label htmlFor="room-name">Name a subcategory</label>
                  <div>
                    <input
                      id="room-name"
                      autoFocus
                      value={draft}
                      placeholder="e.g. The language library"
                      onChange={(e) => setDraft(e.target.value)}
                      maxLength={60}
                    />
                    <button aria-label="Save room" type="submit">
                      <Check size={18} />
                    </button>
                    <button
                      aria-label="Cancel room"
                      type="button"
                      onClick={() => setAdding(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div
              aria-hidden={unfolded}
              className={`sheet-picture ${illustrationPath(place) ? "" : "no-illustration"}`}
            >
              {illustrationPath(place) ? (
                <InkDrawing
                  key={place.id}
                  open={open}
                  motion={motion}
                  src={publicUrl(illustrationPath(place))}
                  alt={
                    place.source === "personal"
                      ? `Imagined ${place.art} illustration for ${alias || place.name}`
                      : `Ink illustration of ${place.id === "ocean-drive" ? "the Colony Hotel on Ocean Drive" : place.name}`
                  }
                />
              ) : (
                <>
                  <Buildings weight="thin" size={78} />
                  <p>
                    A familiar place.
                    <br />
                    An unwritten story.
                  </p>
                </>
              )}
            </div>
          </div>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="sheet-actions">
            <button
              onClick={() => {
                setRenaming(true);
                setDraft(alias || place.name);
                setError("");
              }}
            >
              <Feather size={18} /> Rename
            </button>
            <button
              className="unfold-button"
              aria-expanded={unfolded}
              onClick={() => setUnfolded(!unfolded)}
            >
              {unfolded ? <ArrowLeft size={18} /> : <DoorOpen size={19} />}{" "}
              {unfolded ? "Refold this place" : "Unfold this place"}{" "}
              {!unfolded && <ArrowRight size={18} />}
            </button>
          </div>
          <div className="sheet-footnote">
            <span>
              {unfolded
                ? `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"} waiting within`
                : "Some places hold more than they let on."}
            </span>
            <span>
              {alias || rooms.length || place.source === "personal"
                ? "Kept in this browser"
                : "Yours to make a little mischief."}
            </span>
          </div>
          {place.source === "snapshot" && (
            <p className="place-provenance">
              Mapped in OpenStreetMap · September 2026 snapshot.{" "}
              <a
                href={publicUrl("map/SOURCE.json")}
                target="_blank"
                rel="noreferrer"
              >
                Map source
              </a>
            </p>
          )}
          {place.source === "personal" && (
            <p className="place-provenance">
              Your location · imagined illustration · kept in this browser
            </p>
          )}
        </>
      )}
    </section>
  );
}
