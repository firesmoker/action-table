import React, { useState, useEffect, useRef } from "react";

export default function ActionTableApp() {
  const [actors, setActors] = useState([
    { name: "Alice", type: "Player" },
    { name: "Bob", type: "Player" },
  ]);
  const [rows, setRows] = useState([]);
  const [activeTab, setActiveTab] = useState("combat"); // Manage active tab
  const [savedActors, setSavedActors] = useState([]); // State for saved actors
  const [showSavedActorDropdown, setShowSavedActorDropdown] = useState(false); // Toggle dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown expanded state
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows

  const dropdownRef = useRef(null); // Reference for the dropdown
  const newActorInputRef = useRef(null); // Ref for the new actor input field

  // Synchronize rows with actors
  useEffect(() => {
    setRows((oldRows) => {
      // Create a new row for each actor with a name that is not already in the rows
      const newRows = actors
        .filter((actor) => actor.name.trim() !== "") // Only include actors with a name
        .map((actor) => {
          const existingRow = oldRows.find((row) => row.actor === actor.name);
          return (
            existingRow || {
              id: Date.now() + Math.random(), // Unique ID
              actor: actor.name,
              action: "",
              target: "",
              speed: "normal",
              moveState: "standstill",
              initiative: "0",
            }
          );
        });

      // Remove rows for actors that no longer exist
      return newRows.filter((row) =>
        actors.some((actor) => actor.name === row.actor)
      );
    });
  }, [actors]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSavedActorDropdown(false); // Hide dropdown when clicking outside
        setDropdownOpen(false); // Close dropdown
      }
    }

    if (showSavedActorDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSavedActorDropdown]);

  // Load saved actors from localStorage on component mount
  useEffect(() => {
    const storedSavedActors = localStorage.getItem("savedActors");
    if (storedSavedActors) {
      setSavedActors(JSON.parse(storedSavedActors));
    }
  }, []);

  // Save saved actors to localStorage whenever it changes
  useEffect(() => {
    if (savedActors.length > 0) {
      localStorage.setItem("savedActors", JSON.stringify(savedActors));
    } else {
      localStorage.removeItem("savedActors"); // Clean up if no saved actors
    }
  }, [savedActors]);

  function addActor() {
    setActors((old) => [...old, { name: "", type: "NPC" }]);
  }

  function removeActor(index) {
    setActors((old) => old.filter((_, i) => i !== index));
  }

  function updateActorName(index, val) {
    setActors((old) => {
      const copy = [...old];
      const oldName = copy[index].name;
      copy[index] = { ...copy[index], name: val };

      // Update the corresponding row in the action list
      setRows((oldRows) =>
        oldRows.map((row) =>
          row.actor === oldName ? { ...row, actor: val } : row
        )
      );

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

  const inputStyle = {
    width: "100%",
    padding: "6px 8px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
    backgroundColor: "white",
    color: "black",
  };

  const selectStyle = {
    ...inputStyle,
    minHeight: 32,
    backgroundColor: "white",
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

  const tabContainerStyle = {
    display: "flex",
    justifyContent: "flex-start", // Align tabs horizontally
    borderBottom: "2px solid #ccc",
    marginBottom: 16,
  };

  const tabButtonStyle = (isActive) => ({
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: isActive ? "#1e90ff" : "white",
    color: isActive ? "white" : "black",
    border: "none",
    borderBottom: isActive ? "2px solid #1e90ff" : "2px solid transparent",
    fontSize: 16,
    fontWeight: "bold",
  });

  function addSavedActor() {
    setSavedActors((old) => {
      const updatedActors = [
        ...old,
        { actor: "", type: "NPC", hostility: "Neutral", unique: false },
      ];
      return updatedActors;
    });

    // Delay focusing to ensure the new actor is rendered
    setTimeout(() => {
      if (newActorInputRef.current) {
        newActorInputRef.current.focus();
      }
    }, 0);
  }

  function updateSavedActor(index, field, value) {
    setSavedActors((old) =>
      old.map((actor, i) =>
        i === index ? { ...actor, [field]: value } : actor
      )
    );
  }

  function addSavedActorToActors(savedActor) {
    setActors((old) => [...old, { name: savedActor.actor, type: savedActor.type }]);
    setShowSavedActorDropdown(false); // Hide dropdown after adding
    setDropdownOpen(false); // Close dropdown
  }

  function toggleRowExpansion(index) {
    setExpandedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // Collapse if already expanded
        : [...prev, index] // Expand if not already expanded
    );
  }

  return (
    <div>
      {/* Tabs at the top */}
      <div style={tabContainerStyle}>
        <button
          style={tabButtonStyle(activeTab === "combat")}
          onClick={() => setActiveTab("combat")}
        >
          Combat
        </button>
        <button
          style={tabButtonStyle(activeTab === "savedActors")}
          onClick={() => setActiveTab("savedActors")}
        >
          Saved Actors
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "combat" && (
        <div style={containerStyle}>
          {/* Left: Table */}
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}></th>
                  <th style={thStyle}>Actor</th>
                  <th style={thStyle}>Initiative</th> {/* Moved Initiative column */}
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
                        onChange={(e) =>
                          updateRow(row.id, "actor", e.target.value)
                        }
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
                        value={row.initiative} // Initiative field
                        onChange={(e) => updateRow(row.id, "initiative", e.target.value)}
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
                        onChange={(e) => updateRow(row.id, "moveState", e.target.value)}
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
                  style={{ ...inputStyle, flexGrow: 1 }}
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
                  style={removeButtonStyle}
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
                    if (savedActors.some((actor) => !(actor.unique && rows.some((row) => row.actor === actor.actor)))) {
                      setShowSavedActorDropdown(true);
                    }
                  }}
                  style={{
                    ...buttonStyle,
                    flexGrow: 1,
                    backgroundColor: savedActors.some(
                      (actor) => !(actor.unique && rows.some((row) => row.actor === actor.actor))
                    )
                      ? "#1e90ff" // Enabled color
                      : "#ccc", // Disabled grey color
                    cursor: savedActors.some(
                      (actor) => !(actor.unique && rows.some((row) => row.actor === actor.actor))
                    )
                      ? "pointer"
                      : "not-allowed", // Change cursor when disabled
                  }}
                  type="button"
                  disabled={
                    !savedActors.some(
                      (actor) => !(actor.unique && rows.some((row) => row.actor === actor.actor))
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
                          !(actor.unique && rows.some((row) => row.actor === actor.actor))
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
      )}

      {activeTab === "savedActors" && (
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
                    <label style={{ display: "inline-block", position: "relative", cursor: "pointer" }}>
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
                        setSavedActors((old) => old.filter((_, i) => i !== index));
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
      )}
    </div>
  );
}
