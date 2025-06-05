import React, { useState } from "react";

const SPEED_ORDER = { fast: 3, normal: 2, slow: 1 };
const MOVE_ORDER = { standstill: 2, moving: 1 };

export default function ActionTableApp() {
  // Actor list state
  const [actors, setActors] = useState([
    { name: "Alice", type: "Player" },
    { name: "Bob", type: "Player" },
  ]);

  // Action rows state
  const [rows, setRows] = useState([
    {
      id: 1,
      actor: "Alice",
      action: "",
      target: "",
      speed: "normal",
      moveState: "standstill",
      initiative: "0",
    },
    {
      id: 2,
      actor: "Bob",
      action: "",
      target: "",
      speed: "fast",
      moveState: "moving",
      initiative: "1",
    },
  ]);

  function addActor() {
    setActors((old) => [...old, { name: "", type: "Player" }]);
  }
  function removeActor(index) {
    setActors((old) => old.filter((_, i) => i !== index));
    setRows((old) =>
      old.map((r) =>
        r.actor === actors[index].name ? { ...r, actor: "" } : r
      )
    );
  }
  function updateActorName(index, val) {
    setActors((old) => {
      const copy = [...old];
      copy[index] = { ...copy[index], name: val };
      return copy;
    });
  }
  function updateActorType(index, val) {
    setActors((old) => {
      const copy = [...old];
      copy[index] = { ...copy[index], type: val };
      return copy;
    });
  }

  function updateRow(id, field, val) {
    setRows((old) =>
      old.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  }

  function addRow() {
    setRows((old) => [
      ...old,
      {
        id: Date.now(),
        actor: actors[0] || "",
        action: "",
        target: "",
        speed: "normal",
        moveState: "standstill",
        initiative: "0",
      },
    ]);
  }
  function removeRow(id) {
    setRows((old) => old.filter((r) => r.id !== id));
  }

  function sortRows() {
    const sorted = [...rows].sort((a, b) => {
      if (SPEED_ORDER[b.speed] !== SPEED_ORDER[a.speed]) {
        return SPEED_ORDER[b.speed] - SPEED_ORDER[a.speed];
      }
      if (MOVE_ORDER[b.moveState] !== MOVE_ORDER[a.moveState]) {
        return MOVE_ORDER[b.moveState] - MOVE_ORDER[a.moveState];
      }
      if (Number(b.initiative) !== Number(a.initiative)) {
        return Number(b.initiative) - Number(a.initiative);
      }
      // If tied, Players before NPCs
      const actorA = actors.find((actor) => actor.name === a.actor);
      const actorB = actors.find((actor) => actor.name === b.actor);
      if (actorA && actorB) {
        if (actorA.type !== actorB.type) {
          return actorA.type === "Player" ? -1 : 1;
        }
      }
      return 0;
    });
    setRows(sorted);
  }

  const inputStyle = {
    width: "100%",
    padding: "6px 8px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
    backgroundColor: "white", // <-- white background
    color: "black",
  };

  const selectStyle = {
    ...inputStyle,
    minHeight: 32,
    backgroundColor: "white", // <-- white background for selects too
  };

  const buttonStyle = {
    backgroundColor: "#1e90ff",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    padding: "6px 12px",
    fontSize: 14,
  };

  const containerStyle = {
    display: "flex",
    gap: 24,
    padding: 20,
    fontFamily: "sans-serif",
    backgroundColor: "#f9f9f9",
    height: "100vh",
    boxSizing: "border-box",
  };

  const tableContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const actorListStyle = {
    width: 260,
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: 12,
    boxSizing: "border-box",
    height: "fit-content",
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const thStyle = {
    borderBottom: "2px solid #ccc",
    textAlign: "left",
    padding: 8,
    backgroundColor: "#eee",
  };

  const tdStyle = {
    borderBottom: "1px solid #ddd",
    padding: 8,
  };

  const removeButtonStyle = {
    ...buttonStyle,
    padding: "4px 8px",
    backgroundColor: "#ff4d4f",
  };

  return (
    <div style={containerStyle}>
      {/* Left: Table */}
      <div style={tableContainerStyle}>
        <div
          style={{
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button style={buttonStyle} onClick={sortRows}>
            Sort
          </button>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Actor</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Target</th>
              <th style={thStyle}>Speed</th>
              <th style={thStyle}>Standstill / Moving</th>
              <th style={thStyle}>Initiative</th>
              <th style={thStyle} aria-label="Remove row"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
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
                  <input
                    type="text"
                    value={row.action}
                    onChange={(e) => updateRow(row.id, "action", e.target.value)}
                    placeholder="Action"
                    style={inputStyle}
                  />
                </td>

                <td style={tdStyle}>
                  <input
                    type="text"
                    value={row.target}
                    onChange={(e) => updateRow(row.id, "target", e.target.value)}
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
                    onChange={(e) => updateRow(row.id, "moveState", e.target.value)}
                    style={selectStyle}
                  >
                    <option value="standstill">standstill</option>
                    <option value="moving">moving</option>
                  </select>
                </td>

                <td style={tdStyle}>
                  <select
                    value={row.initiative}
                    onChange={(e) => updateRow(row.id, "initiative", e.target.value)}
                    style={selectStyle}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </td>

                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button
                    onClick={() => removeRow(row.id)}
                    style={removeButtonStyle}
                    aria-label={`Remove action row for actor ${row.actor || "unknown"}`}
                    type="button"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addRow}
          style={{ ...buttonStyle, marginTop: 12, width: 120 }}
          type="button"
        >
          + Add Action
        </button>
      </div>

      {/* Right: Actor List */}
      <div style={actorListStyle}>
        <h2 style={{ marginTop: 0 }}>Actors</h2>

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
              style={{ ...inputStyle, flexGrow: 1 }}
            />
            <select
              value={actor.type}
              onChange={(e) => updateActorType(i, e.target.value)}
              style={{ ...selectStyle, width: 90 }}
            >
              <option value="Player">Player</option>
              <option value="NPC">NPC</option>
            </select>
            <button
              onClick={() => removeActor(i)}
              aria-label={`Remove actor ${actor.name || "empty"}`}
              style={removeButtonStyle}
              type="button"
            >
              &minus;
            </button>
          </div>
        ))}

        <button
          onClick={addActor}
          style={{ ...buttonStyle, marginTop: 12, width: "100%" }}
          type="button"
        >
          + Add Actor
        </button>
      </div>
    </div>
  );
}
