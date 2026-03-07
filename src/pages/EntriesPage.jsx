import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEntries } from "../hooks/useEntries";
import EntryList from "../components/EntryList";

const FILTERS = ["all", "feeding", "diaper", "sleep"];

export default function EntriesPage() {
  const { entries, loading, error, remove } = useEntries();
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Entries</h2>
        <button className="btn-primary" onClick={() => navigate("/entries/new")}>
          + New Entry
        </button>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab filter-tab--${f}${filter === f ? " filter-tab--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className="empty-state">Loading...</p>}
      {error && <p className="auth-error">{error}</p>}
      {!loading && <EntryList entries={filtered} onDelete={remove} />}
    </div>
  );
}
