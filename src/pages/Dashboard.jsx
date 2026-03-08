import { useNavigate } from "react-router-dom";
import { useEntries } from "../hooks/useEntries";
import EntryList from "../components/EntryList";

// ── Helpers ───────────────────────────────────────────────────────────

function isToday(ts) {
  if (!ts?.toDate) return false;
  return ts.toDate().toDateString() === new Date().toDateString();
}

function isThisWeek(ts) {
  if (!ts?.toDate) return false;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return ts.toDate() >= weekAgo;
}

function formatAgo(date) {
  if (!date) return null;
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m ago` : `${h}h ago`;
}

function formatMins(mins) {
  if (!mins) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function sleepDuration(e) {
  const start = e.timestamp?.toDate?.();
  const end = e.sleepEnd?.toDate?.();
  if (!start || !end) return 0;
  return Math.round((end - start) / 60000);
}

// ── Stats computers ───────────────────────────────────────────────────

function computeSleepStats(sleeps) {
  const durations = sleeps.map(sleepDuration).filter(Boolean);
  const total = durations.reduce((s, d) => s + d, 0);
  const avg = durations.length ? Math.round(total / durations.length) : 0;
  const longest = durations.length ? Math.max(...durations) : 0;
  return { total, avg, longest };
}

function computeFeedingStats(feedings) {
  const totalMl = feedings
    .filter((e) => e.feedingType !== "breast")
    .reduce((sum, e) => sum + (e.amount ?? 0), 0);

  const breast = feedings.filter((e) => e.feedingType === "breast").length;
  const bottle = feedings.filter((e) => e.feedingType === "bottle").length;
  const solid  = feedings.filter((e) => e.feedingType === "solid").length;

  let avgInterval = null;
  if (feedings.length >= 2) {
    const sorted = [...feedings].sort(
      (a, b) => (a.timestamp?.toDate?.() || 0) - (b.timestamp?.toDate?.() || 0)
    );
    let totalGap = 0;
    for (let i = 1; i < sorted.length; i++) {
      const a = sorted[i - 1].timestamp?.toDate?.();
      const b = sorted[i].timestamp?.toDate?.();
      if (a && b) totalGap += (b - a) / 60000;
    }
    avgInterval = Math.round(totalGap / (sorted.length - 1));
  }

  return { totalMl, breast, bottle, solid, avgInterval };
}

function computeDiaperStats(todayDiapers, weekDiapers) {
  const wet   = todayDiapers.filter((e) => e.diaperType === "wet" || e.diaperType === "both").length;
  const dirty = todayDiapers.filter((e) => e.diaperType === "dirty" || e.diaperType === "both").length;
  const weeklyAvg = (weekDiapers.length / 7).toFixed(1);
  return { wet, dirty, weeklyAvg };
}

// ── Sub-components ────────────────────────────────────────────────────

function RatioBar({ a, b, colorA, colorB }) {
  const total = a + b;
  if (!total) return <div className="ratio-bar ratio-bar--empty"><span>No data yet</span></div>;
  const pctA = Math.round((a / total) * 100);
  const pctB = 100 - pctA;
  return (
    <div className="ratio-bar">
      {pctA > 0 && <div className="ratio-segment" style={{ width: `${pctA}%`, background: colorA }} />}
      {pctB > 0 && <div className="ratio-segment" style={{ width: `${pctB}%`, background: colorB }} />}
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function ReminderBanner({ lastFeeding }) {
  if (!lastFeeding) return null;
  const date = lastFeeding.timestamp?.toDate?.();
  if (!date) return null;
  const ago = formatAgo(date);
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  const urgency = mins >= 240 ? "high" : mins >= 150 ? "medium" : "low";
  return (
    <div className={`feeding-reminder feeding-reminder--${urgency}`}>
      <span className="feeding-reminder-icon">🍼</span>
      <span>Last feeding was <strong>{ago}</strong></span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────

export default function Dashboard() {
  const { entries, loading, remove } = useEntries();
  const navigate = useNavigate();

  const todayEntries  = entries.filter((e) => isToday(e.timestamp));
  const feedings      = todayEntries.filter((e) => e.type === "feeding");
  const diapers       = todayEntries.filter((e) => e.type === "diaper");
  const sleeps        = todayEntries.filter((e) => e.type === "sleep");
  const weekDiapers   = entries.filter((e) => e.type === "diaper" && isThisWeek(e.timestamp));
  const lastFeeding   = entries.find((e) => e.type === "feeding");

  const feedStats   = computeFeedingStats(feedings);
  const sleepStats  = computeSleepStats(sleeps);
  const diaperStats = computeDiaperStats(diapers, weekDiapers);

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
          <ReminderBanner lastFeeding={lastFeeding} />

          {/* Summary cards */}
          <div className="summary-grid">
            <div className="summary-card summary-card--feeding">
              <div className="summary-icon">🍼</div>
              <div className="summary-body">
                <div className="summary-label">Feedings</div>
                <div className="summary-value">{feedings.length}</div>
                <div className="summary-sub">
                  {feedStats.totalMl > 0 ? `${feedStats.totalMl} ml total` : ""}
                </div>
              </div>
            </div>

            <div className="summary-card summary-card--diaper">
              <div className="summary-icon">🧷</div>
              <div className="summary-body">
                <div className="summary-label">Diapers</div>
                <div className="summary-value">{diapers.length}</div>
                <div className="summary-sub">
                  {diaperStats.dirty > 0 ? `${diaperStats.dirty} dirty` : ""}
                </div>
              </div>
            </div>

            <div className="summary-card summary-card--sleep">
              <div className="summary-icon">😴</div>
              <div className="summary-body">
                <div className="summary-label">Sleep</div>
                <div className="summary-value">{sleeps.length}</div>
                <div className="summary-sub">{formatMins(sleepStats.total)} total</div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <h3 className="dashboard-section-title" style={{ marginTop: "1.75rem" }}>Analytics</h3>
          <div className="analytics-grid">

            {/* Feeding */}
            <div className="analytics-card analytics-card--feeding">
              <div className="analytics-header">
                <span className="analytics-icon">🍼</span>
                <span className="analytics-title">Feeding</span>
              </div>
              <StatRow
                label="Avg. interval"
                value={feedStats.avgInterval ? formatMins(feedStats.avgInterval) : "—"}
              />
              <StatRow
                label="Total milk today"
                value={feedStats.totalMl > 0 ? `${feedStats.totalMl} ml` : "—"}
              />
              <div className="stat-row">
                <span className="stat-label">Bottle vs breast</span>
                <span className="stat-value">{feedStats.bottle + feedStats.solid} · {feedStats.breast}</span>
              </div>
              <RatioBar a={feedStats.bottle + feedStats.solid} b={feedStats.breast} colorA="#B2FBA5" colorB="#F2B8D9" />
              <div className="ratio-legend">
                <span><span className="legend-dot" style={{ background: "#B2FBA5" }} />Bottle/Solid ({feedStats.bottle + feedStats.solid})</span>
                <span><span className="legend-dot" style={{ background: "#F2B8D9" }} />Breast ({feedStats.breast})</span>
              </div>
            </div>

            {/* Sleep */}
            <div className="analytics-card analytics-card--sleep">
              <div className="analytics-header">
                <span className="analytics-icon">😴</span>
                <span className="analytics-title">Sleep</span>
              </div>
              <StatRow label="Total sleep today" value={formatMins(sleepStats.total)} />
              <StatRow label="Avg. nap length"   value={formatMins(sleepStats.avg)} />
              <StatRow label="Longest session"   value={formatMins(sleepStats.longest)} />
              {sleeps.length > 0 && sleepStats.total > 0 && (
                <div className="sleep-bars">
                  {sleeps.map((s, i) => {
                    const dur = sleepDuration(s);
                    if (!dur) return null;
                    const pct = sleepStats.longest > 0
                      ? Math.round((dur / sleepStats.longest) * 100)
                      : 0;
                    const label = s.timestamp?.toDate?.()?.toLocaleTimeString([], {
                      hour: "2-digit", minute: "2-digit",
                    });
                    return (
                      <div key={s.id || i} className="sleep-bar-row">
                        <span className="sleep-bar-label">{label}</span>
                        <div className="sleep-bar-track">
                          <div className="sleep-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="sleep-bar-val">{formatMins(dur)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Diapers */}
            <div className="analytics-card analytics-card--diaper">
              <div className="analytics-header">
                <span className="analytics-icon">🧷</span>
                <span className="analytics-title">Diapers</span>
              </div>
              <StatRow label="Diapers today"    value={diapers.length || "—"} />
              <StatRow label="Weekly avg. / day" value={diaperStats.weeklyAvg} />
              <div className="stat-row">
                <span className="stat-label">Wet vs dirty</span>
                <span className="stat-value">{diaperStats.wet} · {diaperStats.dirty}</span>
              </div>
              <RatioBar a={diaperStats.wet} b={diaperStats.dirty} colorA="#B6DDFD" colorB="#FBF0A6" />
              <div className="ratio-legend">
                <span><span className="legend-dot" style={{ background: "#B6DDFD" }} />Wet ({diaperStats.wet})</span>
                <span><span className="legend-dot" style={{ background: "#FBF0A6" }} />Dirty ({diaperStats.dirty})</span>
              </div>
            </div>

          </div>

          {/* Today's log */}
          <h3 className="dashboard-section-title" style={{ marginTop: "1.75rem" }}>
            Today&apos;s entries
          </h3>
          <EntryList entries={todayEntries} onDelete={remove} />
          {todayEntries.length === 0 && (
            <p className="empty-state">No entries logged today yet.</p>
          )}
        </>
      )}
    </div>
  );
}
