import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import API from "../api/Api";

export default function RecruiterDashboard({ navProps, user, onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const isPendingApproval = user?.recruiterStatus === "PENDING";

  useEffect(() => {
    API.get("/jobs")
      .then(res => {
        if (!Array.isArray(res.data)) {
          throw new Error("Invalid response");
        }
        setJobs(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch jobs:", err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalApps = jobs.reduce((sum, j) => sum + (j._count?.applications || 0), 0);

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
      <Navbar {...navProps} activePage="Dashboard" />

      {/* APPROVAL WARNING */}
      {isPendingApproval && (
        <div style={S.warningBanner}>
          ⚠️ <strong>Account pending admin approval.</strong> You can view the dashboard but cannot post jobs until approved.
        </div>
      )}

      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={S.headerLabel}>Recruiter Dashboard</div>
          <h1 style={S.heading}>Job Management</h1>
          <p style={S.sub}>Manage your job listings and review applicants</p>
        </div>
        <button style={{ ...S.btnPrimary, opacity: isPendingApproval ? 0.5 : 1 }}
          onClick={() => !isPendingApproval && onNavigate("Post Job")}>
          + Post New Job
        </button>
      </div>

      {/* STATS */}
      <div style={S.statsGrid}>
        {[
          { v: jobs.length, l: "Total Jobs", c: "#a29bfe", icon: "📋" },
          { v: totalApps, l: "Total Applicants", c: "#00cec9", icon: "👥" },
        ].map((s, i) => (
          <div key={i} style={S.statCard}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: s.c }}>{loading ? "—" : s.v}</div>
            <div style={{ fontSize: "0.75rem", color: "#8888aa", fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* JOB LIST */}
      <div style={S.section}>
        <div style={S.sectionHeader}>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>Your Job Listings</div>
        </div>

        {loading ? (
          <div style={S.empty}>Loading jobs…</div>
        ) : jobs.length === 0 ? (
          <div style={S.emptyState}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>No jobs yet</div>
            <div style={{ color: "#8888aa" }}>Post your first job listing to start receiving applications.</div>
            {!isPendingApproval && <button style={{ ...S.btnPrimary, marginTop: "1.5rem" }} onClick={() => onNavigate("Post Job")}>Post a Job →</button>}
          </div>
        ) : (
          jobs.map((job, i) => (
            <div key={job.id || i} style={{ ...S.jobRow, animation: `slideUp 0.3s ease ${i * 0.04}s both` }}>
              <div style={S.jobLeft}>
                <div style={S.jobDot} />
                <div>
                  <div style={S.jobTitle}>{job.title}</div>
                  <div style={S.jobMeta}>
                    <span>🏢 {job.company_name}</span>
                    <span>📍 {job.location || "Remote"}</span>
                    <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div style={S.jobRight}>
                <div style={S.appCount}>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#a29bfe" }}>{job._count?.applications || 0}</span>
                  <span style={{ fontSize: "0.7rem", color: "#8888aa" }}>Applicants</span>
                </div>
                <div style={S.jobActions}>
                  <button style={S.btnView} onClick={() => onNavigate("Applicants", { jobId: job.id })}>
                    View Applicants
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: 0, right: 0, width: "600px", height: "600px", background: "radial-gradient(circle,rgba(162,155,254,0.07) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  warningBanner: { background: "rgba(253,203,110,0.1)", border: "1px solid rgba(253,203,110,0.3)", color: "#fdcb6e", padding: "1rem 3.5rem", fontSize: "0.9rem" },
  header: { padding: "2.5rem 3.5rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", position: "relative", zIndex: 1 },
  headerLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#a29bfe", marginBottom: "0.4rem" },
  heading: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px" },
  sub: { color: "#8888aa", fontSize: "0.88rem", marginTop: "0.3rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem", padding: "0 3.5rem 2rem", position: "relative", zIndex: 1 },
  statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "14px", padding: "1.5rem", textAlign: "center" },
  section: { padding: "0 3.5rem 3rem", position: "relative", zIndex: 1 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.75rem" },
  jobRow: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.15)", borderRadius: "14px", padding: "1.3rem 1.5rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" },
  jobLeft: { display: "flex", gap: "1rem", alignItems: "center", flex: 1 },
  jobDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, background: "#a29bfe" },
  jobTitle: { fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" },
  jobMeta: { display: "flex", gap: "1.2rem", flexWrap: "wrap", fontSize: "0.76rem", color: "#8888aa" },
  jobRight: { display: "flex", alignItems: "center", gap: "1.2rem", flexShrink: 0, flexWrap: "wrap" },
  appCount: { textAlign: "center" },
  jobActions: { display: "flex", gap: "0.5rem", alignItems: "center" },
  btnView: { background: "rgba(162,155,254,0.15)", border: "1px solid rgba(162,155,254,0.3)", color: "#a29bfe", padding: "0.45rem 0.9rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" },
  emptyState: { textAlign: "center", padding: "5rem 2rem", color: "#8888aa" },
  empty: { color: "#8888aa", padding: "2rem" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.8rem 1.8rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(108,92,231,0.35)" },
};
