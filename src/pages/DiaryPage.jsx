import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { subscribeToDiary, addDiaryEntry, deleteDiaryEntry } from "../services/diaryService";

const TAGS = [
  "Feeding", "Bottle", "Breastfeeding", "Solid food", "Snack",
  "Diaper change", "Wet diaper", "Dirty diaper",
  "Sleep", "Nap", "Night sleep", "Wake up",
  "Bath", "Medicine", "Doctor visit", "Vaccination",
  "Growth", "Weight check", "Tummy time", "Playtime", "Walk / stroller",
  "Crying", "Fussy", "Happy / good mood", "Teething",
  "Milestone", "Temperature / fever", "Notes / observation",
];

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(dateStr) {
  const today = todayString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr + "T12:00:00").toLocaleDateString([], {
    weekday: "long", month: "long", day: "numeric",
  });
}

function formatEntryTime(ts) {
  if (!ts?.toDate) return "";
  return ts.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Add entry form ──────────────────────────────
function DiaryEntryForm({ date, onSave, onCancel }) {
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await onSave({ content, date, tags: selectedTags });
  };

  return (
    <div className="diary-form">
      <textarea
        className="diary-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write about your baby's day..."
        rows={6}
        autoFocus
      />

      <div className="form-group">
        <label>Tags</label>
        <div className="tag-grid">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-chip${selectedTags.includes(tag) ? " tag-chip--active" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="auth-btn"
          onClick={handleSave}
          disabled={saving || !content.trim()}
        >
          {saving ? "Saving..." : "Save entry"}
        </button>
      </div>
    </div>
  );
}

// ── Expandable entry card ───────────────────────
function DiaryEntryCard({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const time = formatEntryTime(entry.createdAt);
  const snippet = entry.content?.length > 120
    ? entry.content.slice(0, 120) + "..."
    : entry.content;
  const previewTags = entry.tags?.slice(0, 3) ?? [];
  const extraTags = (entry.tags?.length ?? 0) - 3;

  return (
    <div className="diary-entry-card">
      <div className="diary-entry-header" onClick={() => setExpanded(!expanded)}>
        <div className="diary-entry-meta">
          <span className="diary-entry-time">📝 {time}</span>
          {previewTags.map((tag) => (
            <span key={tag} className="tag-chip tag-chip--sm tag-chip--active">{tag}</span>
          ))}
          {extraTags > 0 && <span className="diary-entry-more">+{extraTags}</span>}
        </div>
        {!expanded && <p className="diary-entry-snippet">{snippet}</p>}
        <span className="diary-entry-toggle">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="diary-entry-body">
          <p className="diary-entry-content">{entry.content}</p>

          {entry.tags?.length > 0 && (
            <div className="tag-grid">
              {entry.tags.map((tag) => (
                <span key={tag} className="tag-chip tag-chip--sm tag-chip--active">{tag}</span>
              ))}
            </div>
          )}

          <div className="diary-entry-actions">
            {confirming ? (
              <>
                <span className="delete-confirm-label">Delete?</span>
                <button className="btn-confirm-yes" onClick={() => onDelete(entry.id)}>Yes</button>
                <button className="btn-confirm-no" onClick={() => setConfirming(false)}>No</button>
              </>
            ) : (
              <button className="btn-delete" onClick={() => setConfirming(true)}>Delete</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────
export default function DiaryPage() {
  const { currentUser } = useAuth();
  const [date, setDate] = useState(todayString());
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = subscribeToDiary(
      currentUser.uid,
      (data) => { setAllEntries(data); setLoading(false); },
      () => setLoading(false)
    );
    return unsub;
  }, [currentUser.uid]);

  const entries = allEntries.filter((e) => e.date === date);

  const handleSave = async (data) => {
    await addDiaryEntry(currentUser.uid, data);
    setShowForm(false);
  };

  const handleDelete = (entryId) => deleteDiaryEntry(currentUser.uid, entryId);

  const changeDate = (delta) => {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().slice(0, 10));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Diary</h2>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + New Entry
          </button>
        )}
      </div>

      <div className="diary-nav">
        <button className="diary-nav-btn" onClick={() => changeDate(-1)}>←</button>
        <span className="diary-nav-date">{formatDisplayDate(date)}</span>
        <button className="diary-nav-btn" onClick={() => changeDate(1)} disabled={date >= todayString()}>→</button>
      </div>

      {showForm && (
        <DiaryEntryForm date={date} onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : (
        <>
          {entries.length === 0 && !showForm && (
            <p className="empty-state">No entries for this day yet.</p>
          )}
          {entries.map((entry) => (
            <DiaryEntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </>
      )}
    </div>
  );
}
