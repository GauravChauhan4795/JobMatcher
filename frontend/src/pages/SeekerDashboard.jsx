import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import API from "../api/Api";

export default function SeekerDashboard({ navProps, user, onNavigate }) {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const initials = (user?.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    Promise.all([
      API.get("/applications/me").catch(() => ({ data: [] })),
      API.get("/jobs")
    ]).then(([appRes, jobRes]) => {
      setApplications(appRes.data || []);
      setJobs((jobRes.data || []).slice(0, 3));
      setLoading(false);
    });
  }, []);

  const statusColor = { PENDING: "#fdcb6e", REVIEWING: "#a29bfe", ACCEPTED: "#00cec9", REJECTED: "#fd79a8" };

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0a14; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        button { font-family:'Space Grotesk',sans-serif; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0a14; }
        ::-webkit-scrollbar-thumb { background:#3a3a5c; border-radius:99px; }
      `}</style>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Dashboard" />

      {/* WELCOME BANNER */}
      <div style={S.banner}>
        <div style={S.bannerLeft}>
          <div style={S.avatar}>{initials}</div>
          <div>
            <div style={S.greeting}>{greeting},</div>
            <h1 style={S.welcomeName}>{user?.name || "there"} 👋</h1>
            <div style={S.welcomeSub}>Job Seeker · {user?.email}</div>
          </div>
        </div>
        <div style={S.bannerStats}>
          {[
            { v: applications.length, l: "Applications", c: "#00cec9" },
            { v: applications.filter(a => a.status === "ACCEPTED").length, l: "Accepted", c: "#a29bfe" },
            { v: applications.filter(a => a.status === "REVIEWING").length, l: "In Review", c: "#fdcb6e" },
          ].map((s, i) => (
            <div key={i} style={S.statBox}>
              <div style={{ ...S.statVal, color: s.c }}>{loading ? "—" : s.v}</div>
              <div style={S.statLabel}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.mainGrid}>
        {/* LEFT — Quick actions + recent applications */}
        <div>
          {/* Quick Actions */}
          <div style={S.card}>
            <div style={S.cardTitle}>Quick Actions</div>
            <div style={S.actionGrid}>
              {[
                { icon: "🔍", label: "Browse Jobs", page: "Jobs", color: "#a29bfe" },
                { icon: "📄", label: "My Applications", page: "Applications", color: "#00cec9" },
                { icon: "⚡", label: "Resume Analysis", page: "Resume Analysis", color: "#fd79a8" },
                { icon: "👤", label: "My Profile", page: "Profile", color: "#fdcb6e" },
              ].map((a, i) => (
                <button key={i} style={{ ...S.actionBtn, borderColor: a.color + "44", background: a.color + "0d" }}
                  onClick={() => onNavigate(a.page)}>
                  <span style={{ fontSize: "1.5rem" }}>{a.icon}</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: a.color }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div style={{ ...S.card, marginTop: "1.2rem" }}>
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Recent Applications</span>
              <button style={S.btnSm} onClick={() => onNavigate("Applications")}>View All</button>
            </div>
            {loading ? <div style={S.empty}>Loading…</div> :
              applications.length === 0 ? (
                <div style={S.emptyState}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</div>
                  <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>No applications yet</div>
                  <div style={{ fontSize: "0.82rem", color: "#8888aa" }}>Browse jobs and start applying!</div>
                  <button style={{ ...S.btnPrimary, marginTop: "1rem" }} onClick={() => onNavigate("Jobs")}>Browse Jobs →</button>
                </div>
              ) : (
                applications.slice(0, 4).map((app, i) => (
                  <div key={i} style={S.appRow}>
                    <div>
                      <div style={S.appTitle}>{app.job?.title || "Job Position"}</div>
                      <div style={S.appMeta}>{app.job?.company_name || "Company"} · {new Date(app.created_at).toLocaleDateString()}</div>
                    </div>
                    <div style={{ ...S.statusBadge, background: (statusColor[app.status] || "#8888aa") + "22", color: statusColor[app.status] || "#8888aa", border: `1px solid ${(statusColor[app.status] || "#8888aa")}44` }}>
                      {app.status || "PENDING"}
                    </div>
                  </div>
                ))
              )
            }
          </div>
        </div>

        {/* RIGHT — Recommended jobs */}
        <div>
          <div style={S.recHeader}>
            <div>
              <div style={S.recLabel}>AI Matched</div>
              <div style={S.recTitle}>Recommended Jobs</div>
            </div>
            <button style={S.btnSm} onClick={() => onNavigate("Jobs")}>View All →</button>
          </div>

          {jobs.map((job, i) => (
            <div key={job.id || i} style={S.jobCard}>
              <div style={S.jobTop}>
                <div>
                  <div style={S.jobTitle}>{job.title}</div>
                  <div style={S.jobMeta}>{job.company_name} · {job.location || "Remote"}</div>
                </div>
                {job.match && (
                  <div style={S.matchBadge}>
                    <div style={S.matchPct}>{job.match}%</div>
                    <div style={S.matchLbl}>Match</div>
                  </div>
                )}
              </div>
              <div style={S.jobTags}>
                {(job.skills || []).slice(0, 3).map(t => <span key={t} style={S.tag}>{t}</span>)}
              </div>
              <div style={S.jobFooter}>
                <span style={S.salary}>{job.salary || ""}</span>
                <button style={S.btnApply} onClick={() => onNavigate("Jobs")}>View & Apply →</button>
              </div>
            </div>
          ))}

          {/* Career tips */}
          <div style={S.tipCard}>
            <div style={S.tipIcon}>💡</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.3rem" }}>Boost your profile</div>
              <div style={{ fontSize: "0.8rem", color: "#8888aa", lineHeight: 1.6 }}>Upload your resume to unlock AI-powered skill analysis and better job matches.</div>
              <button style={{ ...S.btnSm, marginTop: "0.75rem", color: "#00cec9", borderColor: "rgba(0,206,201,0.3)" }} onClick={() => onNavigate("Resume Analysis")}>
                Analyse Resume →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "800px", background: "radial-gradient(circle,rgba(0,206,201,0.08) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  banner: { background: "linear-gradient(135deg,rgba(0,206,201,0.1),rgba(108,92,231,0.06))", borderBottom: "1px solid rgba(0,206,201,0.15)", padding: "2.5rem 3.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", position: "relative", zIndex: 1 },
  bannerLeft: { display: "flex", alignItems: "center", gap: "1.5rem" },
  avatar: { width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg,#00cec9,#6c5ce7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.3rem", color: "#fff", flexShrink: 0, boxShadow: "0 4px 20px rgba(0,206,201,0.3)" },
  greeting: { fontSize: "0.78rem", color: "#8888aa", fontWeight: 500 },
  welcomeName: { fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.4px" },
  welcomeSub: { fontSize: "0.8rem", color: "#8888aa", marginTop: "2px" },
  bannerStats: { display: "flex", gap: "1.2rem", flexWrap: "wrap" },
  statBox: { textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,206,201,0.15)", borderRadius: "12px", padding: "0.9rem 1.3rem" },
  statVal: { fontSize: "1.6rem", fontWeight: 800 },
  statLabel: { fontSize: "0.68rem", color: "#8888aa", marginTop: "2px" },
  mainGrid: { display: "grid", gridTemplateColumns: "340px 1fr", gap: "1.5rem", padding: "2rem 3.5rem", position: "relative", zIndex: 1, alignItems: "start" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "16px", padding: "1.5rem" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  cardTitle: { fontWeight: 700, fontSize: "0.92rem", marginBottom: "1rem" },
  actionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" },
  actionBtn: { padding: "1rem 0.75rem", borderRadius: "12px", border: "1px solid", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", background: "transparent", transition: "opacity 0.2s" },
  appRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 0", borderBottom: "1px solid rgba(108,92,231,0.1)" },
  appTitle: { fontWeight: 600, fontSize: "0.88rem", marginBottom: "2px" },
  appMeta: { fontSize: "0.74rem", color: "#8888aa" },
  statusBadge: { padding: "0.2rem 0.65rem", borderRadius: "99px", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 },
  emptyState: { textAlign: "center", padding: "2rem 1rem", color: "#8888aa" },
  empty: { color: "#8888aa", padding: "1rem", fontSize: "0.85rem" },
  recHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.2rem" },
  recLabel: { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "0.3rem" },
  recTitle: { fontWeight: 800, fontSize: "1.15rem" },
  jobCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "14px", padding: "1.3rem", marginBottom: "1rem" },
  jobTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" },
  jobTitle: { fontWeight: 700, fontSize: "0.95rem", marginBottom: "3px" },
  jobMeta: { fontSize: "0.78rem", color: "#8888aa" },
  matchBadge: { textAlign: "right", flexShrink: 0 },
  matchPct: { fontSize: "1.2rem", fontWeight: 800, color: "#a29bfe" },
  matchLbl: { fontSize: "0.66rem", color: "#8888aa" },
  jobTags: { display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.9rem" },
  tag: { background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", padding: "0.15rem 0.5rem", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 600, color: "#a29bfe" },
  jobFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  salary: { fontSize: "0.82rem", fontWeight: 700, color: "#00cec9" },
  btnApply: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.4rem 1rem", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", fontFamily: "'Space Grotesk',sans-serif" },
  tipCard: { background: "linear-gradient(135deg,rgba(0,206,201,0.08),rgba(108,92,231,0.05))", border: "1px solid rgba(0,206,201,0.2)", borderRadius: "14px", padding: "1.3rem", display: "flex", gap: "1rem", marginTop: "1rem" },
  tipIcon: { fontSize: "1.5rem", flexShrink: 0 },
  btnSm: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", padding: "0.4rem 0.9rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", fontFamily: "'Space Grotesk',sans-serif" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.7rem 1.5rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Space Grotesk',sans-serif" },
};
