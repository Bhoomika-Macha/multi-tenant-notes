import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "../App.css";

function Notes({ token, setToken }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [plan, setPlan] = useState("free");
  const [tenantSlug, setTenantSlug] = useState("");

  // Decode token to get tenant slug
  useEffect(() => {
    try {
      const decoded = jwtDecode(token);
      setTenantSlug(decoded.tenantSlug);
    } catch (err) {
      console.error("Failed to decode token:", err.message);
    }
  }, [token]);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes || []);
      setPlan(res.data.plan || "free");
    } catch (err) {
      console.error("Error fetching notes:", err.message);
    }
  }, [token]);

  useEffect(() => {
    if (tenantSlug) fetchNotes();
  }, [fetchNotes, tenantSlug]);

  const createNote = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([res.data, ...notes]);
      setTitle("");
      setContent("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error creating note";
      alert(errorMsg);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err.message);
      alert("Failed to delete note.");
    }
  };

  const upgradePlan = async () => {
    try {
      await axios.post(
        `http://localhost:3000/tenants/${tenantSlug}/upgrade`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Upgraded to Pro! Now you can add unlimited notes.");
      setPlan("pro");
    } catch (err) {
      console.error("Upgrade failed:", err.message);
      alert("Upgrade failed. Only Admins can upgrade.");
    }
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2 className="notes-title">My Notes</h2>
        <button className="logout-btn" onClick={() => setToken(null)}>
          Logout
        </button>
      </div>

      {plan === "free" && notes.length >= 3 ? (
        <div className="upgrade-box">
          <p>Free plan allows max 3 notes. Upgrade for unlimited notes.</p>
          <button onClick={upgradePlan}>Upgrade to Pro</button>
        </div>
      ) : (
        <div className="note-form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={createNote}>Add Note</button>
        </div>
      )}

      <div className="notes-grid">
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div className="note-card" key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => deleteNote(note.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
