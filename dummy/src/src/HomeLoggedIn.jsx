// HomeLoggedIn.jsx — personalized home for logged-in users
import Navbar from "./Navbar";

const RECOMMENDED_JOBS = [
  { title: "Senior React Developer", company: "Razorpay", location: "Bangalore", match: 97, type: "Full-time", salary: "₹28–40 LPA", tags: ["React", "TypeScript", "Node.js"] },
  { title: "Frontend Engineer", company: "Zepto", location: "Mumbai", match: 91, type: "Full-time", salary: "₹20–30 LPA", tags: ["React", "Redux", "CSS"] },
  { title: "Full Stack Developer", company: "CRED", location: "Remote", match: 87, type: "Remote", salary: "₹22–35 LPA", tags: ["Node.js", "React", "AWS"] },
];

const ACTIVITY = [
  { icon: "📄", text: "Resume analysed — 94% profile strength", time: "2h ago", color: "#7c6ff7" },
  { icon: "💼", text: "Applied to Senior React Dev at Razorpay", time: "1d ago", color: "#00cec9" },
  { icon: "🔖", text: "Saved Frontend Engineer at Zepto", time: "2d ago", color: "#fd79a8" },
  { icon: "📬", text: "Interview invite from CRED", time: "3d ago", color: "#fdcb6e" },
];

export default function HomeLoggedIn({ navProps, user, onNavigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const initials = user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={S.root}>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Home" />

      {/* WELCOME BANNER */}
      <section style={S.banner}>
        <div style={S.bannerLeft}>
          <div style={S.bannerAvatar}>{initials}</div>
          <div>
            <div style={S.greeting}>{greeting},</div>
            <h1 style={S.welcomeName}>{user.name} 👋</h1>
            <div style={S.welcomeSub}>{user.role} · {user.location}</div>
          </div>
        </div>
        <div style={S.bannerStats}>
          {[
            { v: user.matchScore + "%", l: "Match Score" },
            { v: user.applications, l: "Applications" },
            { v: user.savedJobs, l: "Saved Jobs" },
            { v: user.profileStrength + "%", l: "Profile Strength" },
          ].map((s, i) => (
            <div key={i} style={S.statBox}>
              <div style={S.statVal}>{s.v}</div>
              <div style={S.statLabel}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={S.mainGrid}>
        {/* LEFT COLUMN */}
        <div>
          {/* PROFILE STRENGTH */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Profile Strength</span>
              <span style={S.cardBadge}>{user.profileStrength}%</span>
            </div>
            <div style={S.progressBar}>
              <div style={{ ...S.progressFill, width: `${user.profileStrength}%` }} />
            </div>
            <div style={S.cardHints}>
              {["Add a portfolio link", "Add 2 more skills", "Write a summary"].map((hint, i) => (
                <div key={i} style={S.hint}>
                  <span style={S.hintDot}>+</span> {hint}
                </div>
              ))}
            </div>
            <button style={S.btnSm} onClick={() => onNavigate("Profile")}>
              Complete Profile →
            </button>
          </div>

          {/* SKILLS */}
          <div style={{ ...S.card, marginTop: "1.2rem" }}>
            <div style={S.cardTitle}>Your Skills</div>
            <div style={S.skillGrid}>
              {user.skills.map((sk) => (
                <span key={sk} style={S.skillTag}>{sk}</span>
              ))}
              <span style={S.skillAdd}>+ Add Skill</span>
            </div>
          </div>

          {/* ACTIVITY */}
          <div style={{ ...S.card, marginTop: "1.2rem" }}>
            <div style={S.cardTitle}>Recent Activity</div>
            <div style={S.activityList}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={S.activityItem}>
                  <div style={{ ...S.actDot, background: a.color + "33", border: `1px solid ${a.color}66` }}>
                    {a.icon}
                  </div>
                  <div style={S.actContent}>
                    <div style={S.actText}>{a.text}</div>
                    <div style={S.actTime}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div style={S.recHeader}>
            <div>
              <div style={S.label}>AI Matched For You</div>
              <div style={S.recTitle}>Recommended Jobs</div>
            </div>
            <button style={S.btnSm} onClick={() => onNavigate("Jobs")}>View All →</button>
          </div>

          {RECOMMENDED_JOBS.map((job, i) => (
            <div key={i} style={S.jobCard}>
              <div style={S.jobTop}>
                <div>
                  <div style={S.jobTitle}>{job.title}</div>
                  <div style={S.jobMeta}>{job.company} · {job.location}</div>
                </div>
                <div style={S.matchBadge}>
                  <div style={S.matchPct}>{job.match}%</div>
                  <div style={S.matchLbl}>Match</div>
                </div>
              </div>
              <div style={S.jobTags}>
                {job.tags.map((t) => <span key={t} style={S.tag}>{t}</span>)}
                <span style={{ ...S.tag, background: "rgba(0,206,201,0.1)", color: "#00cec9", borderColor: "rgba(0,206,201,0.3)" }}>
                  {job.type}
                </span>
              </div>
              <div style={S.jobFooter}>
                <span style={S.salary}>{job.salary}</span>
                <div style={S.jobActions}>
                  <button style={S.btnSave}>🔖</button>
                  <button style={S.btnApply}>Apply Now</button>
                </div>
              </div>
            </div>
          ))}

          {/* QUICK ANALYSIS CTA */}
          <div style={S.analysisCta}>
            <div style={S.analysisLeft}>
              <div style={S.analysisIcon}>⚡</div>
              <div>
                <div style={S.analysisTitle}>Run Instant Analysis</div>
                <div style={S.analysisSub}>Upload a job description to get a real-time skill match report</div>
              </div>
            </div>
            <button style={S.btnPrimary} onClick={() => onNavigate("Instant Analysis")}>
              Analyse →
            </button>
          </div>
        </div>
      </div>

      <footer style={S.footer}>© 2026 <strong>SJ_Map</strong> · AI-Powered Recruitment</footer>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "800px", background: "radial-gradient(circle,rgba(108,92,231,0.1) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  banner: { background: "linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,206,201,0.08))", borderBottom: "1px solid rgba(108,92,231,0.2)", padding: "2.5rem 3.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", position: "relative", zIndex: 1 },
  bannerLeft: { display: "flex", alignItems: "center", gap: "1.5rem" },
  bannerAvatar: { width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#6c5ce7,#00cec9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.4rem", color: "#fff", flexShrink: 0, boxShadow: "0 4px 20px rgba(108,92,231,0.4)" },
  greeting: { fontSize: "0.82rem", color: "#8888aa", fontWeight: 500 },
  welcomeName: { fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px" },
  welcomeSub: { fontSize: "0.85rem", color: "#8888aa", marginTop: "2px" },
  bannerStats: { display: "flex", gap: "1.5rem", flexWrap: "wrap" },
  statBox: { textAlign: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", padding: "0.9rem 1.4rem" },
  statVal: { fontSize: "1.5rem", fontWeight: 800, color: "#a29bfe" },
  statLabel: { fontSize: "0.72rem", color: "#8888aa", marginTop: "2px" },
  mainGrid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: "1.5rem", padding: "2rem 3.5rem", position: "relative", zIndex: 1, alignItems: "start" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", padding: "1.5rem" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  cardTitle: { fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.9rem" },
  cardBadge: { background: "rgba(108,92,231,0.2)", color: "#a29bfe", padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 700 },
  progressBar: { height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", marginBottom: "1.2rem" },
  progressFill: { height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)" },
  cardHints: { display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.2rem" },
  hint: { fontSize: "0.82rem", color: "#8888aa", display: "flex", alignItems: "center", gap: "0.5rem" },
  hintDot: { color: "#00cec9", fontWeight: 700, fontSize: "1rem" },
  skillGrid: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" },
  skillTag: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", padding: "0.25rem 0.7rem", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 600, color: "#a29bfe" },
  skillAdd: { background: "rgba(0,206,201,0.1)", border: "1px dashed rgba(0,206,201,0.4)", padding: "0.25rem 0.7rem", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 600, color: "#00cec9", cursor: "pointer" },
  activityList: { display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "0.5rem" },
  activityItem: { display: "flex", gap: "0.75rem", alignItems: "flex-start" },
  actDot: { width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 },
  actContent: {},
  actText: { fontSize: "0.82rem", fontWeight: 500 },
  actTime: { fontSize: "0.72rem", color: "#8888aa", marginTop: "2px" },
  recHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.2rem" },
  label: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "0.3rem" },
  recTitle: { fontWeight: 800, fontSize: "1.2rem" },
  jobCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "14px", padding: "1.4rem", marginBottom: "1rem", transition: "border-color 0.2s" },
  jobTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" },
  jobTitle: { fontWeight: 700, fontSize: "1rem", marginBottom: "3px" },
  jobMeta: { fontSize: "0.8rem", color: "#8888aa" },
  matchBadge: { textAlign: "right", flexShrink: 0, marginLeft: "1rem" },
  matchPct: { fontSize: "1.3rem", fontWeight: 800, color: "#a29bfe" },
  matchLbl: { fontSize: "0.68rem", color: "#8888aa" },
  jobTags: { display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" },
  tag: { background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", padding: "0.2rem 0.55rem", borderRadius: "99px", fontSize: "0.72rem", fontWeight: 600, color: "#a29bfe" },
  jobFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  salary: { fontSize: "0.85rem", fontWeight: 700, color: "#00cec9" },
  jobActions: { display: "flex", gap: "0.5rem" },
  btnSave: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(108,92,231,0.25)", borderRadius: "8px", padding: "0.4rem 0.7rem", cursor: "pointer", fontSize: "0.9rem" },
  btnApply: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.4rem 1rem", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", fontFamily: "'Space Grotesk',sans-serif" },
  analysisCta: { background: "linear-gradient(135deg,rgba(108,92,231,0.12),rgba(0,206,201,0.08))", border: "1px solid rgba(108,92,231,0.25)", borderRadius: "14px", padding: "1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" },
  analysisLeft: { display: "flex", gap: "1rem", alignItems: "center" },
  analysisIcon: { fontSize: "1.8rem" },
  analysisTitle: { fontWeight: 700, fontSize: "0.95rem" },
  analysisSub: { fontSize: "0.8rem", color: "#8888aa", marginTop: "2px" },
  btnSm: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", fontFamily: "'Space Grotesk',sans-serif" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.7rem 1.5rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Space Grotesk',sans-serif", flexShrink: 0 },
  footer: { textAlign: "center", padding: "2rem", color: "#555577", fontSize: "0.8rem", borderTop: "1px solid rgba(108,92,231,0.15)", marginTop: "2rem" },
};
