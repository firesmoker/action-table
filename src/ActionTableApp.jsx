import React, { useState, useEffect, useRef } from "react";
import CombatTab from "./CombatTab";
import SavedActorsTab from "./SavedActorsTab";

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
      old.map((actor, i) => {
        if (i === index) {
          const updatedActor = { ...actor, [field]: value };

          // If the actor is unique and the name is being updated, update it in the actors list
          if (field === "actor" && actor.unique) {
            setActors((oldActors) =>
              oldActors.map((a) =>
                a.name === actor.actor ? { ...a, name: value } : a
              )
            );
          }

          return updatedActor;
        }
        return actor;
      })
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
        <CombatTab
          rows={rows}
          actors={actors}
          savedActors={savedActors}
          addActor={addActor}
          updateRow={updateRow}
          updateActorName={updateActorName}
          updateActorType={updateActorType}
          removeActor={removeActor}
          addSavedActorToActors={addSavedActorToActors}
          showSavedActorDropdown={showSavedActorDropdown}
          setShowSavedActorDropdown={setShowSavedActorDropdown}
          dropdownRef={dropdownRef}
          buttonStyle={buttonStyle}
          selectStyle={selectStyle}
          inputStyle={inputStyle}
          actorListStyle={actorListStyle}
          tableStyle={tableStyle}
          thStyle={thStyle}
          tdStyle={tdStyle}
        />
      )}

      {activeTab === "savedActors" && (
        <SavedActorsTab
          savedActors={savedActors}
          addSavedActor={addSavedActor}
          updateSavedActor={updateSavedActor}
          toggleRowExpansion={toggleRowExpansion}
          expandedRows={expandedRows}
          buttonStyle={buttonStyle}
          tableStyle={tableStyle}
          thStyle={thStyle}
          tdStyle={tdStyle}
          inputStyle={inputStyle}
          selectStyle={selectStyle}
          newActorInputRef={newActorInputRef}
        />
      )}
    </div>
  );
}
