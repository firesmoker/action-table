import React from "react";

export default function CombatTab({
  rows,
  actors,
  savedActors,
  addActor,
  updateRow,
  updateActorName,
  updateActorType,
  removeActor,
  addSavedActorToActors,
  showSavedActorDropdown,
  setShowSavedActorDropdown,
  dropdownRef,
  buttonStyle,
  selectStyle,
  inputStyle,
  actorListStyle,
  tableStyle,
  thStyle,
  tdStyle,
  sortRows, // Receive sortRows as a prop
}) {
  return (
    <div style={{ display: "flex", gap: 24, padding: 20 }}>
      {/* Left: Table */}
      <div style={{ flex: 1 }}>
        {/* Sort Rows Button */}
        <button
          onClick={sortRows} // Call the sortRows function
          style={{
            ...buttonStyle,
            marginBottom: 12,
            backgroundColor: "#1e90ff",
            color: "white",
          }}
          type="button"
        >
          Sort Rows
        </button>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}></th>
              <th style={thStyle}>Actor</th>
              <th style={thStyle}>Initiative</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Target</th>
              <th style={thStyle}>Speed</th>
              <th style={thStyle}>Standstill / Moving</th>
              <th style={thStyle} aria-label="Remove row"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={tdStyle}>
                  {actors.find((a) => a.name === row.actor)?.type || ""}
                </td>
                <td style={tdStyle}>
                  <select
                    value={row.actor}
                    onChange={(e) => updateRow(row.id, "actor", e.target.value)}
                    style={selectStyle}
                  >
                    <option value="" disabled>
                      Select actor
                    </option>
                    {actors.map((a, i) => (
                      <option key={i} value={a.name}>
                        {a.name || "(empty)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={tdStyle}>
                  <select
                    value={row.initiative}
                    onChange={(e) =>
                      updateRow(row.id, "initiative", e.target.value)
                    }
                    style={selectStyle}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </td>
                <td style={tdStyle}>
                  <input
                    type="text"
                    value={row.action}
                    onChange={(e) =>
                      updateRow(row.id, "action", e.target.value)
                    }
                    placeholder="Action"
                    style={inputStyle}
                  />
                </td>
                <td style={tdStyle}>
                  <input
                    type="text"
                    value={row.target}
                    onChange={(e) =>
                      updateRow(row.id, "target", e.target.value)
                    }
                    placeholder="Target"
                    style={inputStyle}
                  />
                </td>
                <td style={tdStyle}>
                  <select
                    value={row.speed}
                    onChange={(e) => updateRow(row.id, "speed", e.target.value)}
                    style={selectStyle}
                  >
                    <option value="fast">fast</option>
                    <option value="normal">normal</option>
                    <option value="slow">slow</option>
                  </select>
                </td>
                <td style={tdStyle}>
                  <select
                    value={row.moveState}
                    onChange={(e) =>
                      updateRow(row.id, "moveState", e.target.value)
                    }
                    style={selectStyle}
                  >
                    <option value="standstill">standstill</option>
                    <option value="moving">moving</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: Actor List */}
      <div style={actorListStyle}>
        <h2 style={{ marginTop: 0 }}>
          <b>Actors</b>
        </h2>
        {actors.map((actor, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
              gap: 8,
            }}
          >
            <input
              type="text"
              value={actor.name}
              onChange={(e) => updateActorName(i, e.target.value)}
              placeholder={`Actor ${i + 1} name`}
              style={{
                ...inputStyle,
                flexGrow: 1,
                backgroundColor: savedActors.some(
                  (savedActor) =>
                    savedActor.unique && savedActor.actor === actor.name
                )
                  ? "#f0f0f0" // Light grey background for disabled fields
                  : "white", // Default background for editable fields
                cursor: savedActors.some(
                  (savedActor) =>
                    savedActor.unique && savedActor.actor === actor.name
                )
                  ? "not-allowed" // Show "not-allowed" cursor for disabled fields
                  : "text", // Default cursor for editable fields
                userSelect: savedActors.some(
                  (savedActor) =>
                    savedActor.unique && savedActor.actor === actor.name
                )
                  ? "none" // Prevent text selection for disabled fields
                  : "auto", // Allow text selection for editable fields
              }}
              disabled={savedActors.some(
                (savedActor) =>
                  savedActor.unique && savedActor.actor === actor.name
              )} // Disable if the actor is unique
            />
            <select
              value={actor.type}
              onChange={(e) => updateActorType(i, e.target.value)}
              style={{ ...selectStyle, width: 90 }}
            >
              <option value="NPC">NPC</option>
              <option value="Player">Player</option>
            </select>
            <button
              onClick={() => removeActor(i)}
              aria-label={`Remove actor ${actor.name || "empty"}`}
              style={{
                ...buttonStyle,
                backgroundColor: "#ff4d4f",
                padding: "4px 8px",
              }}
              type="button"
            >
              &minus;
            </button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={addActor}
            style={{ ...buttonStyle, flexGrow: 1 }}
            type="button"
          >
            + Add Actor
          </button>

          {!showSavedActorDropdown ? (
            <button
              onClick={() => {
                if (
                  savedActors.some(
                    (actor) =>
                      actor.actor && // Exclude unnamed actors
                      !(actor.unique && rows.some((row) => row.actor === actor.actor)) // Exclude unique actors already in the table
                  )
                ) {
                  setShowSavedActorDropdown(true);
                }
              }}
              style={{
                ...buttonStyle,
                flexGrow: 1,
                backgroundColor: savedActors.some(
                  (actor) =>
                    actor.actor && // Exclude unnamed actors
                    !(actor.unique && rows.some((row) => row.actor === actor.actor)) // Exclude unique actors already in the table
                )
                  ? "#1e90ff" // Enabled color
                  : "#ccc", // Disabled grey color
                cursor: savedActors.some(
                  (actor) =>
                    actor.actor && // Exclude unnamed actors
                    !(actor.unique && rows.some((row) => row.actor === actor.actor)) // Exclude unique actors already in the table
                )
                  ? "pointer"
                  : "not-allowed", // Change cursor when disabled
              }}
              type="button"
              disabled={
                !savedActors.some(
                  (actor) =>
                    actor.actor && // Exclude unnamed actors
                    !(actor.unique && rows.some((row) => row.actor === actor.actor)) // Exclude unique actors already in the table
                )
              }
            >
              + Add a Saved Actor
            </button>
          ) : (
            <div ref={dropdownRef} style={{ position: "relative", flexGrow: 1 }}>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  backgroundColor: "white",
                  position: "absolute",
                  zIndex: 10,
                  width: "100%",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {savedActors
                  .filter(
                    (actor) =>
                      actor.actor && // Exclude unnamed actors
                      !(actor.unique && rows.some((row) => row.actor === actor.actor)) // Exclude unique actors already in the table
                  )
                  .map((actor, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        addSavedActorToActors(actor);
                      }}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        backgroundColor: "white", // Default background
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f0f0f0"; // Highlight on hover
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white"; // Reset background
                      }}
                    >
                      {actor.actor || "(Unnamed)"} - {actor.type}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}