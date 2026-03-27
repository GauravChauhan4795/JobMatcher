// Dashboard.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};

const normalizeMatch = (job) => ({
  title: job.title,
  company: job.company_name || job.company || "Company",
  match: job.matchScore ?? 0,
  location: job.location || "Not specified",
});

export default function Dashboard({ navProps, user, onNavigate, mode = "applicant" }) {
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchLoading, setMatchLoading] = useState(true);
  const [matchError, setMatchError] = useState("");

  useEffect(() => {
    let isMounted = true;
    API.get("/applications/me")
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        const mapped = list.map((app) => ({
          title: app.job?.title || "Job",
          company: app.job?.company_name || "Company",
          status: app.status || "PENDING",
          date: formatDate(app.created_at) || "",
        }));
        setApplications(mapped);
        setAppError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        setAppError(getApiError(err));
      })
      .finally(() => {
        if (!isMounted) return;
        setAppLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    API.get("/routes")
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data.map(normalizeMatch) : [];
        setMatches(list.slice(0, 4));
        setMatchError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        setMatchError(getApiError(err));
      })
      .finally(() => {
        if (!isMounted) return;
        setMatchLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewApplications = () => {
    const el = document.getElementById("dashboard-applications");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const name = user?.name || "there";
  const role = user?.role || "";
  const email = user?.email || "";
  const isRecruiter = mode === "recruiter";

  return (
    <div style={S.root}>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Dashboard" />

      <section style={S.hero}>
        <div>
          <div style={S.badge}>{isRecruiter ? "Recruiter Dashboard" : "Dashboard"}</div>
          <h1 style={S.h1}>Welcome back, {name}</h1>
          <p style={S.sub}>{role}{role && email ? " · " : ""}{email}</p>
        </div>
        <div style={S.actionRow}>
          <button style={S.btnPrimary} onClick={() => onNavigate("Jobs")}>
            {isRecruiter ? "Manage Jobs" : "Apply For Jobs"}
          </button>
          <button style={S.btnOutline} onClick={handleViewApplications}>
            View Applications
          </button>
          <button style={S.btnOutline} onClick={() => onNavigate("Resume Analysis")}>
            Resume Analysis
          </button>
        </div>
      </section>

      <div style={S.grid}>
        <div style={S.card} id="dashboard-applications">
          <div style={S.cardTitle}>Recent Applications</div>
          {appError && <div style={S.error}>{appError}</div>}
          {appLoading && <div style={S.empty}>Loading applications...</div>}
          {!appLoading && applications.length === 0 && (
            <div style={S.empty}>No applications yet. Start with a role you like.</div>
          )}
          <div style={S.list}>
            {applications.map((app, i) => (
              <div key={`${app.title}-${i}`} style={S.listRow}>
                <div>
                  <div style={S.listTitle}>{app.title}</div>
                  <div style={S.listSub}>{app.company} · Applied {app.date}</div>
                </div>
                <span style={S.statusPill}>{app.status}</span>
              </div>
            ))}
          </div>
          <button style={S.linkBtn} onClick={() => onNavigate("Jobs")}>Browse All Jobs</button>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Top Matches</div>
          {matchError && <div style={S.error}>{matchError}</div>}
          {matchLoading && <div style={S.empty}>Loading matches...</div>}
          {!matchLoading && matches.length === 0 && (
            <div style={S.empty}>Upload a resume to see matched roles.</div>
          )}
          <div style={S.list}>
            {matches.map((job, i) => (
              <div key={`${job.title}-${i}`} style={S.listRow}>
                <div>
                  <div style={S.listTitle}>{job.title}</div>
                  <div style={S.listSub}>{job.company} · {job.location}</div>
                </div>
                <span style={S.matchPill}>{job.match}%</span>
              </div>
            ))}
          </div>
          <button style={S.linkBtn} onClick={() => onNavigate("Jobs")}>See All Matches</button>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>All Features</div>
          <div style={S.featureGrid}>
            {[
              { title: "Browse Jobs", desc: "Find roles tailored to your skills.", action: () => onNavigate("Jobs") },
              { title: "Resume Analysis", desc: "Upload a resume and get skill insights.", action: () => onNavigate("Resume Analysis") },
              { title: "Profile", desc: "Add details, skills, and links.", action: () => onNavigate("Profile") },
              { title: "About", desc: "Learn about SJ_Map and our mission.", action: () => onNavigate("About") },
            ].map((item) => (
              <button key={item.title} style={S.featureCard} onClick={item.action}>
                <div style={S.featureTitle}>{item.title}</div>
                <div style={S.featureDesc}>{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer style={S.footer}>© 2026 <strong>SJ_Map</strong> · AI-Powered Recruitment</footer>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: "-120px", right: "-120px", width: "700px", height: "700px", background: "radial-gradient(circle,rgba(0,206,201,0.08) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  hero: { padding: "3rem 3.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", position: "relative", zIndex: 1 },
  badge: { fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, color: "#00cec9" },
  h1: { fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.8px", marginTop: "0.4rem" },
  sub: { color: "#8888aa", marginTop: "0.5rem", fontSize: "0.9rem" },
  actionRow: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.8rem 1.6rem", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" },
  btnOutline: { background: "transparent", color: "#e0e0f0", border: "1px solid rgba(108,92,231,0.35)", borderRadius: "10px", padding: "0.8rem 1.4rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" },
  grid: { display: "grid", gap: "1.5rem", padding: "1rem 3.5rem 3rem", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", position: "relative", zIndex: 1 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", padding: "1.5rem" },
  cardTitle: { fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" },
  list: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  listRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(108,92,231,0.15)" },
  listTitle: { fontWeight: 600, fontSize: "0.9rem" },
  listSub: { color: "#8888aa", fontSize: "0.78rem", marginTop: "0.2rem" },
  statusPill: { padding: "0.25rem 0.7rem", borderRadius: "99px", fontSize: "0.75rem", background: "rgba(162,155,254,0.18)", color: "#a29bfe", fontWeight: 600 },
  matchPill: { padding: "0.25rem 0.7rem", borderRadius: "99px", fontSize: "0.75rem", background: "rgba(0,206,201,0.18)", color: "#00cec9", fontWeight: 700 },
  linkBtn: { marginTop: "1rem", background: "none", border: "none", color: "#a29bfe", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", textAlign: "left" },
  featureGrid: { display: "grid", gap: "0.75rem" },
  featureCard: { textAlign: "left", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", padding: "1rem", cursor: "pointer" },
  featureTitle: { fontWeight: 700, marginBottom: "0.35rem" },
  featureDesc: { color: "#8888aa", fontSize: "0.82rem" },
  error: { background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "0.9rem" },
  empty: { color: "#8888aa", fontSize: "0.82rem" },
  footer: { textAlign: "center", padding: "2rem", color: "#555577", fontSize: "0.8rem", borderTop: "1px solid rgba(108,92,231,0.15)" },
};



