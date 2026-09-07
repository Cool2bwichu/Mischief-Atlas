import { useEffect, useRef, useState } from "react";
import { Check, Crosshair, MapPinPlus, X } from "@phosphor-icons/react";
import { personalArt } from "./data/personal-art.js";
import { publicUrl } from "./public-url.js";

export default function LandmarkTool({
  open,
  coordinates,
  initialArt,
  onCenter,
  onCancel,
  onSave,
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (open) {
      setName("");
      setArt(initialArt);
      setError("");
    }
    const frame = requestAnimationFrame(() => setEntered(open));
    return () => cancelAnimationFrame(frame);
  }, [open]);
  const [name, setName] = useState("");
  const [art, setArt] = useState(initialArt);
  const [error, setError] = useState("");
  const input = useRef(null);
  const hasLocation = !!coordinates;
  useEffect(() => {
    if (hasLocation && open) input.current?.focus();
  }, [hasLocation, open]);
  async function save(e) {
    e.preventDefault();
    try {
      await onSave(name, coordinates, art);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <section
      className={`landmark-tool ${entered && open ? "tool-open" : "tool-closed"}`}
      inert={!open}
      aria-hidden={!open}
      role="region"
      aria-labelledby="landmark-tool-title"
    >
      <div className="tool-heading">
        <MapPinPlus size={21} weight="light" />
        <h2 id="landmark-tool-title">A place of your own</h2>
        <button
          className="icon-button"
          aria-label="Cancel landmark"
          onClick={onCancel}
        >
          <X size={19} />
        </button>
      </div>
      <p id="placement-hint" className="placement-hint">
        {hasLocation
          ? "Your pin is placed. Give it a name and a little character."
          : "Click or tap a spot on the map. Or move the map beneath the crosshair."}
      </p>
      {!hasLocation ? (
        <>
          <button className="center-location" onClick={onCenter}>
            <Crosshair size={18} /> Use map centre
          </button>
          <p className="keyboard-hint">
            On the map: arrow keys move, Enter places, Escape cancels.
          </p>
        </>
      ) : (
        <form onSubmit={save}>
          <label htmlFor="landmark-name">Landmark name</label>
          <input
            id="landmark-name"
            ref={input}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            maxLength={60}
            placeholder="A name that means something to you"
            aria-describedby={error ? "landmark-error" : undefined}
          />
          <fieldset className="art-choices">
            <legend>Choose its illustration</legend>
            {personalArt.map((a) => (
              <label key={a.id} className={art === a.id ? "chosen" : ""}>
                <input
                  type="radio"
                  name="landmark-art"
                  value={a.id}
                  checked={art === a.id}
                  onChange={() => setArt(a.id)}
                />
                <img src={publicUrl(`assets/personal/${a.id}.webp`)} alt="" />
                <span>{a.name}</span>
              </label>
            ))}
          </fieldset>
          <p className="tool-caption">
            An imagined illustration. The location is yours.
          </p>
          {error && (
            <p className="form-error" id="landmark-error" role="alert">
              {error}
            </p>
          )}
          <div className="tool-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-landmark">
              <Check size={18} /> Save landmark
            </button>
          </div>
          <small>Kept in this browser, on this device.</small>
        </form>
      )}
    </section>
  );
}
