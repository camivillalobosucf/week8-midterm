import { useState } from "react";

const TYPE_OPTIONS = [
  { value: "feeding", label: "Feeding", icon: "🍼" },
  { value: "diaper",  label: "Diaper",  icon: "🧷" },
  { value: "sleep",   label: "Sleep",   icon: "😴" },
];

const FEEDING_TYPES = [
  { value: "bottle", label: "Bottle",      icon: "🍼" },
  { value: "breast", label: "Breastfeed",  icon: "🤱" },
  { value: "solid",  label: "Solid food",  icon: "🥄" },
];

const DIAPER_TYPES = [
  { value: "wet",   label: "Wet",   icon: "💧" },
  { value: "dirty", label: "Dirty", icon: "💩" },
  { value: "both",  label: "Both",  icon: "🔄" },
  { value: "dry",   label: "Dry",   icon: "✨" },
];

function toDateTimeLocal(ts) {
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function EntryForm({ initialData, onSubmit, onCancel }) {
  const isEdit = !!initialData;

  const [type, setType] = useState(initialData?.type ?? "feeding");
  const [timestamp, setTimestamp] = useState(
    initialData?.timestamp ? toDateTimeLocal(initialData.timestamp) : toDateTimeLocal(new Date())
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  // Feeding
  const [feedingType, setFeedingType] = useState(initialData?.feedingType ?? "bottle");
  const [amount, setAmount] = useState(initialData?.amount ?? "");
  const [duration, setDuration] = useState(initialData?.duration ?? "");

  // Diaper
  const [diaperType, setDiaperType] = useState(initialData?.diaperType ?? "wet");

  // Sleep
  const [sleepEnd, setSleepEnd] = useState(
    initialData?.sleepEnd ? toDateTimeLocal(initialData.sleepEnd) : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = { type, timestamp, notes };

    if (type === "feeding") {
      data.feedingType = feedingType;
      if (feedingType === "breast") {
        data.duration = Number(duration) || 0;
      } else {
        data.amount = Number(amount) || 0;
      }
    } else if (type === "diaper") {
      data.diaperType = diaperType;
    } else if (type === "sleep") {
      if (sleepEnd) data.sleepEnd = sleepEnd;
    }

    try {
      await onSubmit(data);
    } catch {
      setError("Failed to save. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      {error && <p className="auth-error">{error}</p>}

      <div className="form-group">
        <label>Type</label>
        <div className="type-selector">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`type-btn type-btn--${opt.value}${type === opt.value ? " type-btn--active" : ""}`}
              onClick={() => setType(opt.value)}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>{type === "sleep" ? "Sleep start" : "Time"}</label>
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          required
          className="auth-input"
        />
      </div>

      {type === "feeding" && (
        <>
          <div className="form-group">
            <label>Feeding type</label>
            <div className="option-group option-group--feeding">
              {FEEDING_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`option-btn${feedingType === opt.value ? " option-btn--active" : ""}`}
                  onClick={() => setFeedingType(opt.value)}
                >
                  <span className="option-icon">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {feedingType === "breast" ? (
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="0"
                className="auth-input"
                placeholder="e.g. 15"
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Amount (ml)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                className="auth-input"
                placeholder="e.g. 120"
              />
            </div>
          )}
        </>
      )}

      {type === "diaper" && (
        <div className="form-group">
          <label>Diaper type</label>
          <div className="option-group option-group--diaper">
            {DIAPER_TYPES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`option-btn${diaperType === opt.value ? " option-btn--active" : ""}`}
                onClick={() => setDiaperType(opt.value)}
              >
                <span className="option-icon">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === "sleep" && (
        <div className="form-group">
          <label>Wake time (optional)</label>
          <input
            type="datetime-local"
            value={sleepEnd}
            onChange={(e) => setSleepEnd(e.target.value)}
            className="auth-input"
          />
        </div>
      )}

      <div className="form-group">
        <label>Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="auth-input form-textarea"
          placeholder="Any additional notes..."
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Saving..." : isEdit ? "Save changes" : "Add entry"}
        </button>
      </div>
    </form>
  );
}
