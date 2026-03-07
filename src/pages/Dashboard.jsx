import { useNavigate } from "react-router-dom";
import { useEntries } from "../hooks/useEntries";
import EntryList from "../components/EntryList";

function isToday(ts) {
  if (!ts?.toDate) return false;
  return ts.toDate().toDateString() === new Date().toDateString();
}

function totalFeedingMl(entries) {
  return entries
    .filter((e) => e.feedingType !== "breast")
    .reduce((sum, e) => sum + (e.amount ?? 0), 0);
}

function totalSleepMinutes(entries) {
  return entries.reduce((sum, e) => {
    const start = e.timestamp?.toDate?.();
    const end = e.sleepEnd?.toDate?.();
    if (start && end) return sum + Math.round((end - start) / 60000);
    return sum;
  }, 0);
}

function formatSleep(mins) {
  if (mins === 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function Dashboard() {
  const { entries, loading, remove } = useEntries();
  const navigate = useNavigate();

  const todayEntries = entries.filter((e) => isToday(e.timestamp));
  const feedings = todayEntries.filter((e) => e.type === "feeding");
  const diapers = todayEntries.filter((e) => e.type === "diaper");
  const sleeps = todayEntries.filter((e) => e.type === "sleep");

  const today = new Date().toLocaleDateString([], {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p className="dashboard-date">{today}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/entries/new")}>
          + New Entry
        </button>
      </div>

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : (
        <>
          <div className="summary-grid">
            <div className="summary-card summary-card--feeding">
              <div className="summary-icon">🍼</div>
              <div className="summary-body">
                <div className="summary-label">Feedings</div>
                <div className="summary-value">{feedings.length}</div>
                <div className="summary-sub">
                  {totalFeedingMl(feedings) > 0 ? `${totalFeedingMl(feedings)} ml total` : ""}
                </div>
              </div>
            </div>

            <div className="summary-card summary-card--diaper">
              <div className="summary-icon">🧷</div>
              <div className="summary-body">
                <div className="summary-label">Diapers</div>
                <div className="summary-value">{diapers.length}</div>
                <div className="summary-sub">
                  {diapers.filter((e) => e.diaperType === "dirty" || e.diaperType === "both").length > 0
                    ? `${diapers.filter((e) => e.diaperType === "dirty" || e.diaperType === "both").length} dirty`
                    : ""}
                </div>
              </div>
            </div>

            <div className="summary-card summary-card--sleep">
              <div className="summary-icon">😴</div>
              <div className="summary-body">
                <div className="summary-label">Sleep</div>
                <div className="summary-value">{sleeps.length}</div>
                <div className="summary-sub">{formatSleep(totalSleepMinutes(sleeps))} total</div>
              </div>
            </div>
          </div>

          <h3 className="dashboard-section-title">Today&apos;s entries</h3>
          <EntryList entries={todayEntries} onDelete={remove} />

          {todayEntries.length === 0 && (
            <p className="empty-state">No entries logged today yet.</p>
          )}
        </>
      )}
    </div>
  );
}
