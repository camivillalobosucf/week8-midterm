import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_ICONS = { feeding: "🍼", diaper: "🧷", sleep: "😴" };
const TYPE_LABELS = { feeding: "Feeding", diaper: "Diaper", sleep: "Sleep" };

function getDetail(entry) {
  if (entry.type === "feeding") {
    if (entry.feedingType === "breast") return `Breastfeeding · ${entry.duration ?? 0} min`;
    const label = entry.feedingType === "bottle" ? "Bottle" : "Solid food";
    return `${label} · ${entry.amount ?? 0} ml`;
  }
  if (entry.type === "diaper") {
    return entry.diaperType?.charAt(0).toUpperCase() + entry.diaperType?.slice(1);
  }
  if (entry.type === "sleep") {
    const start = entry.timestamp?.toDate?.();
    const end = entry.sleepEnd?.toDate?.();
    if (start && end) {
      const mins = Math.round((end - start) / 60000);
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    }
    return "In progress";
  }
  return "";
}

function formatTime(ts) {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  const now = new Date();
  const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Today at ${timeStr}`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + ` at ${timeStr}`;
}

export default function EntryItem({ entry, onDelete }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={`entry-item entry-item--${entry.type}`}>
      <div className="entry-icon">{TYPE_ICONS[entry.type]}</div>
      <div className="entry-body">
        <div className="entry-type">{TYPE_LABELS[entry.type]}</div>
        <div className="entry-detail">{getDetail(entry)}</div>
        <div className="entry-time">{formatTime(entry.timestamp)}</div>
        {entry.notes && <div className="entry-notes">{entry.notes}</div>}
      </div>
      <div className="entry-actions">
        {confirming ? (
          <>
            <span className="delete-confirm-label">Delete?</span>
            <button className="btn-confirm-yes" onClick={() => onDelete(entry.id)}>Yes</button>
            <button className="btn-confirm-no" onClick={() => setConfirming(false)}>No</button>
          </>
        ) : (
          <>
            <button className="btn-edit" onClick={() => navigate(`/entries/${entry.id}/edit`)}>
              Edit
            </button>
            <button className="btn-delete" onClick={() => setConfirming(true)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
