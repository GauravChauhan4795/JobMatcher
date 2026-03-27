import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import API from "../api/Api";

const STATUS_CONFIG = {
    PENDING:   { color: "#fdcb6e", bg: "rgba(253,203,110,0.12)", border: "rgba(253,203,110,0.3)", label: "Pending Review", icon: "⏳" },
    REVIEWING: { color: "#a29bfe", bg: "rgba(162,155,254,0.12)", border: "rgba(162,155,254,0.3)", label: "Under Review", icon: "🔍" },
    ACCEPTED:  { color: "#00cec9", bg: "rgba(0,206,201,0.12)", border: "rgba(0,206,201,0.3)", label: "Accepted!", icon: "✅" },
    REJECTED:  { color: "#fd79a8", bg: "rgba(253,121,168,0.12)", border: "rgba(253,121,168,0.3)", label: "Not Selected", icon: "❌" },
};

export default function SeekerApplications({ navProps, user, onNavigate }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    API.get("/applications/me")
        .then(res => {
        if (!Array.isArray(res.data)) {
            throw new Error("Invalid response");
        }
        setApplications(res.data);
        })
        .catch(err => {
        console.error("Failed to fetch applications:", err);
        setApplications([]);
        })
        .finally(() => setLoading(false));
    }, []);

  const filtered = filter === "ALL" ? applications : applications.filter(a => a.status === filter);

  const counts = { ALL: applications.length, ...Object.keys(STATUS_CONFIG).reduce((acc, k) => ({ ...acc, [k]: applications.filter(a => a.status === k).length }), {}) };

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0a14; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        button { font-family:'Space Grotesk',sans-serif; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0a14; }
        ::-webkit-scrollbar-thumb { background:#3a3a5c; border-radius:99px; }
      `}</style>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Applications" />

      <div style={S.page}>
        {/* HEADER */}
        <div style={S.header}>
          <div>
            <div style={S.headerLabel}>Track Your Journey</div>
            <h1 style={S.heading}>My Applications</h1>
            <p style={S.sub}>{applications.length} total applications</p>
          </div>
          <button style={S.btnPrimary} onClick={() => onNavigate("Jobs")}>Browse More Jobs →</button>
        </div>

        {/* STATUS SUMMARY CARDS */}
        <div style={S.summaryGrid}>
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <div key={status} style={{ ...S.summaryCard, borderColor: cfg.border, background: cfg.bg }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{cfg.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: cfg.color }}>{counts[status] || 0}</div>
              <div style={{ fontSize: "0.75rem", color: "#8888aa", fontWeight: 600 }}>{cfg.label}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={S.filterRow}>
          {["ALL", ...Object.keys(STATUS_CONFIG)].map(f => (
            <button key={f} style={{ ...S.filterBtn, ...(filter === f ? S.filterActive : {}) }} onClick={() => setFilter(f)}>
              {f === "ALL" ? "All" : STATUS_CONFIG[f].label} {counts[f] > 0 && <span style={S.countBadge}>{counts[f]}</span>}
            </button>
          ))}
        </div>

        {/* APPLICATIONS LIST */}
        {loading ? (
          <div style={S.loadingState}>Loading your applications…</div>
        ) : filtered.length === 0 ? (
          <div style={S.emptyState}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>No applications {filter !== "ALL" ? `with status "${STATUS_CONFIG[filter]?.label}"` : "yet"}</div>
            <div style={{ color: "#8888aa", fontSize: "0.9rem" }}>Browse jobs and start applying to track your progress here.</div>
            <button style={{ ...S.btnPrimary, marginTop: "1.5rem" }} onClick={() => onNavigate("Jobs")}>Browse Jobs →</button>
          </div>
        ) : (
          <div style={S.appList}>
            {filtered.map((app, i) => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={app.id || i} style={{ ...S.appCard, animation: `slideUp 0.3s ease ${i * 0.05}s both` }}>
                  <div style={S.appCardInner}>
                    <div style={S.appLeft}>
                      <div style={S.appCompanyDot} />
                      <div>
                        <div style={S.appTitle}>{app.job?.title || "Position"}</div>
                        <div style={S.appCompany}>{app.job?.company_name || "Company"}</div>
                        <div style={S.appMeta}>
                          <span>📍 {app.job?.location || "Remote"}</span>
                          {app.job?.salary && <span>💰 {app.job.salary}</span>}
                          <span>📅 Applied {new Date(app.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div style={S.appRight}>
                      <div style={{ ...S.statusPill, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {cfg.icon} {cfg.label}
                      </div>

                      {/* Progress bar */}
                      <div style={S.progressWrap}>
                        {["PENDING", "REVIEWING", "ACCEPTED"].map((s, idx) => (
                          <div key={s} style={S.progressStep}>
                            <div style={{
                              ...S.progressDot,
                              background: ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"].indexOf(app.status) >= idx || app.status === "ACCEPTED"
                                ? cfg.color : "rgba(255,255,255,0.1)",
                              boxShadow: app.status === s ? `0 0 8px ${cfg.color}` : "none",
                            }} />
                            {idx < 2 && <div style={{ ...S.progressLine, background: ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"].indexOf(app.status) > idx ? cfg.color : "rgba(255,255,255,0.1)" }} />}
                          </div>
                        ))}
                      </div>
                      <div style={S.progressLabels}>
                        <span>Applied</span><span>Review</span><span>Decision</span>
                      </div>
                    </div>
                  </div>

                  {app.note && (
                    <div style={{ ...S.noteBox, borderColor: cfg.border, background: cfg.bg }}>
                      <span style={{ fontSize: "0.85rem" }}>💬</span>
                      <div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: cfg.color, marginBottom: "2px" }}>Recruiter Note</div>
                        <div style={{ fontSize: "0.85rem", color: "#c0c0d8", lineHeight: 1.6 }}>{app.note}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: 0, right: 0, width: "600px", height: "600px", background: "radial-gradient(circle,rgba(0,206,201,0.06) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  page: { maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" },
  headerLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "0.4rem" },
  heading: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px" },
  sub: { color: "#8888aa", fontSize: "0.88rem", marginTop: "0.3rem" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" },
  summaryCard: { background: "rgba(255,255,255,0.03)", border: "1px solid", borderRadius: "14px", padding: "1.2rem", textAlign: "center" },
  filterRow: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" },
  filterBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.2)", color: "#8888aa", padding: "0.45rem 1rem", borderRadius: "99px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif", display: "flex", alignItems: "center", gap: "0.4rem" },
  filterActive: { background: "rgba(108,92,231,0.2)", borderColor: "#7c6ff7", color: "#e0e0f0" },
  countBadge: { background: "rgba(108,92,231,0.4)", borderRadius: "99px", padding: "0.1rem 0.4rem", fontSize: "0.68rem", fontWeight: 700 },
  appList: { display: "flex", flexDirection: "column", gap: "1rem" },
  appCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "16px", padding: "1.5rem", overflow: "hidden" },
  appCardInner: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" },
  appLeft: { display: "flex", gap: "1rem", alignItems: "flex-start", flex: 1 },
  appCompanyDot: { width: "10px", height: "10px", borderRadius: "50%", background: "linear-gradient(135deg,#6c5ce7,#00cec9)", flexShrink: 0, marginTop: "6px" },
  appTitle: { fontWeight: 700, fontSize: "1rem", marginBottom: "3px" },
  appCompany: { fontSize: "0.85rem", color: "#a29bfe", fontWeight: 600, marginBottom: "6px" },
  appMeta: { display: "flex", gap: "1.2rem", flexWrap: "wrap", fontSize: "0.75rem", color: "#8888aa" },
  appRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem", flexShrink: 0 },
  statusPill: { padding: "0.35rem 0.9rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 700 },
  progressWrap: { display: "flex", alignItems: "center" },
  progressStep: { display: "flex", alignItems: "center" },
  progressDot: { width: "10px", height: "10px", borderRadius: "50%", transition: "all 0.3s" },
  progressLine: { width: "30px", height: "2px", transition: "all 0.3s" },
  progressLabels: { display: "flex", gap: "0", fontSize: "0.62rem", color: "#8888aa" },
  noteBox: { marginTop: "1rem", padding: "0.9rem", borderRadius: "10px", border: "1px solid", display: "flex", gap: "0.75rem", alignItems: "flex-start" },
  loadingState: { color: "#8888aa", textAlign: "center", padding: "4rem" },
  emptyState: { textAlign: "center", padding: "5rem 2rem", color: "#8888aa" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.8rem 1.8rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(108,92,231,0.35)" },
};
