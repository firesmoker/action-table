import React from "react";

export default function SavedActorsTab({
  savedActors,
  addSavedActor,
  updateSavedActor,
  toggleRowExpansion,
  expandedRows,
  buttonStyle,
  tableStyle,
  thStyle,
  tdStyle,
  inputStyle,
  selectStyle,
  newActorInputRef,
}) {
  return (
    <div>
      <h2>Saved Actors</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}></th>
            <th style={thStyle}>Actor</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Hostility</th>
            <th style={thStyle}>Unique</th>
          </tr>
        </thead>
        <tbody>
          {savedActors.map((actor, index) => (
            <tr key={index}>
              <td style={tdStyle}>
                <button
                  onClick={() => toggleRowExpansion(index)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                  aria-label={`Toggle details for ${actor.actor || "Unnamed"}`}
                >
                  {expandedRows.includes(index) ? "▼" : "▶"}
                </button>
              </td>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={actor.actor}
                  onChange={(e) =>
                    updateSavedActor(index, "actor", e.target.value)
                  }
                  placeholder="Actor Name"
                  style={inputStyle}
                  ref={
                    index === savedActors.length - 1
                      ? newActorInputRef
                      : null
                  } // Attach ref to the last actor
                />
              </td>
              <td style={tdStyle}>
                <select
                  value={actor.type}
                  onChange={(e) =>
                    updateSavedActor(index, "type", e.target.value)
                  }
                  style={selectStyle}
                >
                  <option value="NPC">NPC</option>
                  <option value="Player">Player</option>
                </select>
              </td>
              <td style={tdStyle}>
                <select
                  value={actor.hostility}
                  onChange={(e) =>
                    updateSavedActor(index, "hostility", e.target.value)
                  }
                  style={selectStyle}
                >
                  <option value="Neutral">Neutral</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Hostile">Hostile</option>
                </select>
              </td>
              <td style={tdStyle}>
                <label
                  style={{
                    display: "inline-block",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={actor.unique || false}
                    onChange={(e) =>
                      updateSavedActor(index, "unique", e.target.checked)
                    }
                    style={{
                      opacity: 0, // Hide the default checkbox
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                      zIndex: 1, // Ensure it is clickable
                    }}
                  />
                  <span
                    style={{
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      backgroundColor: "white", // White background when unchecked
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      position: "relative",
                    }}
                  >
                    {actor.unique && (
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 10, // Adjusted size for better fit
                          height: 10, // Adjusted size for better fit
                          backgroundColor: "#1e90ff", // Blue checkmark
                          borderRadius: 2, // Slight rounding for better appearance
                        }}
                      ></span>
                    )}
                  </span>
                </label>
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => {
                    // Remove the actor at the given index
                    const updatedActors = savedActors.filter((_, i) => i !== index);
                    // Directly update the savedActors state
                    updateSavedActor(updatedActors);
                  }}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    padding: "4px 8px",
                    fontSize: 14,
                  }}
                  aria-label={`Remove saved actor ${actor.actor || "Unnamed"}`}
                >
                  &minus;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addSavedActor}
        style={{ ...buttonStyle, marginTop: 12 }}
        type="button"
      >
        + Add Saved Actor
      </button>
    </div>
  );
}