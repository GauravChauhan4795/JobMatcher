// JobsPage.jsx
import { useState } from "react";
import Navbar from "./Navbar";

const ALL_JOBS = [
  { id: 1, title: "Senior React Developer", company: "Razorpay", location: "Bangalore", type: "Full-time", salary: "₹28–40 LPA", match: 97, tags: ["React", "TypeScript", "Node.js", "AWS"], posted: "2d ago", desc: "Build scalable payment UIs for millions of users. Lead the frontend architecture team." },
  { id: 2, title: "Frontend Engineer", company: "Zepto", location: "Mumbai", type: "Full-time", salary: "₹20–30 LPA", match: 91, tags: ["React", "Redux", "CSS", "GraphQL"], posted: "1d ago", desc: "Own the customer-facing web experience for India's fastest grocery delivery platform." },
  { id: 3, title: "Full Stack Developer", company: "CRED", location: "Remote", type: "Remote", salary: "₹22–35 LPA", match: 87, tags: ["Node.js", "React", "AWS", "MongoDB"], posted: "3d ago", desc: "Work across the stack to build premium fintech experiences for high-credit users." },
  { id: 4, title: "Software Engineer II", company: "Swiggy", location: "Bangalore", type: "Full-time", salary: "₹18–28 LPA", match: 83, tags: ["Java", "Microservices", "Kafka", "React"], posted: "5d ago", desc: "Build real-time order management and delivery tracking systems at massive scale." },
  { id: 5, title: "React Native Developer", company: "PhonePe", location: "Bangalore", type: "Full-time", salary: "₹24–36 LPA", match: 79, tags: ["React Native", "TypeScript", "Redux"], posted: "1w ago", desc: "Craft seamless mobile payment experiences for 500M+ PhonePe users." },
  { id: 6, title: "DevOps Engineer", company: "Groww", location: "Bangalore", type: "Full-time", salary: "₹20–32 LPA", match: 74, tags: ["AWS", "Kubernetes", "Terraform", "CI/CD"], posted: "4d ago", desc: "Design and maintain cloud infrastructure for India's leading investment platform." },
  { id: 7, title: "Backend Engineer", company: "Meesho", location: "Remote", type: "Remote", salary: "₹16–26 LPA", match: 70, tags: ["Python", "Django", "PostgreSQL", "Redis"], posted: "6d ago", desc: "Scale backend systems powering 150M+ users on India's social commerce platform." },
  { id: 8, title: "ML Engineer", company: "Flipkart", location: "Bangalore", type: "Full-time", salary: "₹30–50 LPA", match: 65, tags: ["Python", "TensorFlow", "MLOps", "Spark"], posted: "2d ago", desc: "Build recommendation and ranking models that personalise shopping for 400M users." },
];

const FILTERS = ["All", "Full-time", "Remote", "Internship"];
const LOCATIONS = ["All Locations", "Bangalore", "Mumbai", "Remote"];

export default function JobsPage({ navProps, isLoggedIn, onNavigate }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState(ALL_JOBS[0]);

  const filtered = ALL_JOBS.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "All" || j.type === filter;
    const matchLoc = location === "All Locations" || j.location === location;
    return matchSearch && matchFilter && matchLoc;
  });

  const toggleSave = (id) =>
    setSaved((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  const matchColor = (m) => m >= 90 ? "#00cec9" : m >= 75 ? "#a29bfe" : "#fdcb6e";

  return (
    <div style={S.root}>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Jobs" />

      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={S.label}>Opportunities</div>
          <h1 style={S.heading}>Browse Jobs</h1>
          <p style={S.sub}>{ALL_JOBS.length} live positions · AI-ranked by your skill match</p>
        </div>
        {!isLoggedIn && (
          <div style={S.loginBanner}>
            <span>🔐 Log in to see your personalised match scores</span>
            <button style={S.btnSm} onClick={() => onNavigate("Login")}>Login →</button>
          </div>
        )}
      </div>

      {/* SEARCH + FILTERS */}
      <div style={S.filterBar}>
        <input
          style={S.search}
          placeholder="🔍  Search by role, company, or skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={S.filters}>
          {FILTERS.map((f) => (
            <button key={f} style={{ ...S.chip, ...(filter === f ? S.chipActive : {}) }}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <select style={S.select} value={location} onChange={(e) => setLocation(e.target.value)}>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* SPLIT LAYOUT */}
      <div style={S.split}>
        {/* LIST */}
        <div style={S.list}>
          <div style={S.listCount}>{filtered.length} results</div>
          {filtered.map((job) => (
            <div key={job.id}
              style={{ ...S.jobCard, ...(selected?.id === job.id ? S.jobCardActive : {}) }}
              onClick={() => setSelected(job)}
            >
              <div style={S.jobTop}>
                <div style={S.jobInfo}>
                  <div style={S.jobTitle}>{job.title}</div>
                  <div style={S.jobMeta}>{job.company} · {job.location}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {isLoggedIn && (
                    <div style={{ ...S.matchPill, background: matchColor(job.match) + "22", color: matchColor(job.match), border: `1px solid ${matchColor(job.match)}44` }}>
                      {job.match}% match
                    </div>
                  )}
                  <div style={S.jobPosted}>{job.posted}</div>
                </div>
              </div>
              <div style={S.tagRow}>
                {job.tags.slice(0, 3).map((t) => <span key={t} style={S.tag}>{t}</span>)}
                {job.tags.length > 3 && <span style={S.tag}>+{job.tags.length - 3}</span>}
              </div>
              <div style={S.jobBottom}>
                <span style={S.salary}>{job.salary}</span>
                <button style={S.saveBtn} onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}>
                  {saved.includes(job.id) ? "🔖" : "🤍"}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={S.empty}>No jobs match your search. Try different keywords.</div>
          )}
        </div>

        {/* DETAIL */}
        {selected && (
          <div style={S.detail}>
            <div style={S.detailHeader}>
              <div>
                <h2 style={S.detailTitle}>{selected.title}</h2>
                <div style={S.detailMeta}>{selected.company} · {selected.location} · {selected.type}</div>
              </div>
              {isLoggedIn && (
                <div style={S.matchCircle}>
                  <div style={{ ...S.matchNum, color: matchColor(selected.match) }}>{selected.match}%</div>
                  <div style={S.matchLbl}>Match</div>
                </div>
              )}
            </div>

            <div style={S.detailSalary}>{selected.salary} · Posted {selected.posted}</div>

            <div style={S.detailSection}>
              <div style={S.detailSectionTitle}>About the Role</div>
              <p style={S.detailDesc}>{selected.desc} This is an exciting opportunity to work with a high-performing engineering team, contributing to systems used by millions of users across India. You'll collaborate closely with product, design, and data teams to ship impactful features.</p>
            </div>

            <div style={S.detailSection}>
              <div style={S.detailSectionTitle}>Required Skills</div>
              <div style={S.tagRow}>
                {selected.tags.map((t) => (
                  <span key={t} style={S.detailTag}>{t}</span>
                ))}
              </div>
            </div>

            {isLoggedIn && (
              <div style={S.skillMatch}>
                <div style={S.skillMatchTitle}>Your Skill Match</div>
                {selected.tags.map((t, i) => (
                  <div key={t} style={S.skillRow}>
                    <span style={S.skillName}>{t}</span>
                    <div style={S.skillBar}>
                      <div style={{ ...S.skillFill, width: `${Math.max(50, 95 - i * 8)}%` }} />
                    </div>
                    <span style={{ ...S.skillPct, color: matchColor(95 - i * 8) }}>{Math.max(50, 95 - i * 8)}%</span>
                  </div>
                ))}
              </div>
            )}

            <div style={S.detailActions}>
              <button style={S.btnPrimary}
                onClick={() => !isLoggedIn && onNavigate("Login")}>
                {isLoggedIn ? "Apply Now →" : "Login to Apply →"}
              </button>
              <button style={S.btnOutline} onClick={() => toggleSave(selected.id)}>
                {saved.includes(selected.id) ? "🔖 Saved" : "🤍 Save Job"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: 0, right: 0, width: "600px", height: "600px", background: "radial-gradient(circle,rgba(0,206,201,0.08) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  header: { padding: "3rem 3.5rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", position: "relative", zIndex: 1 },
  label: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "0.4rem" },
  heading: { fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.8px" },
  sub: { color: "#8888aa", fontSize: "0.9rem", marginTop: "0.4rem" },
  loginBanner: { background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.25)", borderRadius: "12px", padding: "0.9rem 1.4rem", display: "flex", alignItems: "center", gap: "1.2rem", fontSize: "0.85rem", color: "#a29bfe" },
  filterBar: { padding: "0 3.5rem 1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", position: "relative", zIndex: 1 },
  search: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#e0e0f0", padding: "0.75rem 1.2rem", borderRadius: "10px", fontSize: "0.9rem", width: "300px", outline: "none", fontFamily: "'Space Grotesk',sans-serif" },
  filters: { display: "flex", gap: "0.4rem" },
  chip: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.2)", color: "#8888aa", padding: "0.45rem 1rem", borderRadius: "99px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" },
  chipActive: { background: "rgba(108,92,231,0.25)", borderColor: "#7c6ff7", color: "#a29bfe" },
  select: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", color: "#8888aa", padding: "0.45rem 0.9rem", borderRadius: "10px", fontSize: "0.82rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif" },
  split: { display: "grid", gridTemplateColumns: "360px 1fr", gap: "0", height: "calc(100vh - 220px)", overflow: "hidden", position: "relative", zIndex: 1 },
  list: { borderRight: "1px solid rgba(108,92,231,0.2)", overflowY: "auto", padding: "0 1rem 1rem 3.5rem" },
  listCount: { fontSize: "0.78rem", color: "#8888aa", padding: "0.75rem 0", fontWeight: 600 },
  jobCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(108,92,231,0.15)", borderRadius: "12px", padding: "1.1rem", marginBottom: "0.75rem", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" },
  jobCardActive: { borderColor: "#6c5ce7", background: "rgba(108,92,231,0.08)" },
  jobTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.7rem" },
  jobInfo: {},
  jobTitle: { fontWeight: 700, fontSize: "0.92rem", marginBottom: "2px" },
  jobMeta: { fontSize: "0.76rem", color: "#8888aa" },
  matchPill: { padding: "0.15rem 0.55rem", borderRadius: "99px", fontSize: "0.72rem", fontWeight: 700, display: "inline-block", marginBottom: "3px" },
  jobPosted: { fontSize: "0.7rem", color: "#8888aa", textAlign: "right" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" },
  tag: { background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", padding: "0.15rem 0.5rem", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 600, color: "#a29bfe" },
  jobBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  salary: { fontSize: "0.82rem", fontWeight: 700, color: "#00cec9" },
  saveBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "1rem" },
  empty: { color: "#8888aa", textAlign: "center", padding: "3rem", fontSize: "0.9rem" },
  detail: { overflowY: "auto", padding: "2rem 3.5rem 2rem 2rem" },
  detailHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "1rem" },
  detailTitle: { fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.5px" },
  detailMeta: { fontSize: "0.88rem", color: "#8888aa", marginTop: "4px" },
  matchCircle: { textAlign: "center", background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.25)", borderRadius: "12px", padding: "1rem 1.4rem", flexShrink: 0 },
  matchNum: { fontSize: "2rem", fontWeight: 800 },
  matchLbl: { fontSize: "0.72rem", color: "#8888aa" },
  detailSalary: { fontSize: "0.88rem", color: "#00cec9", fontWeight: 600, marginBottom: "2rem" },
  detailSection: { marginBottom: "2rem" },
  detailSectionTitle: { fontWeight: 700, fontSize: "0.82rem", letterSpacing: "1px", textTransform: "uppercase", color: "#a29bfe", marginBottom: "0.75rem" },
  detailDesc: { color: "#c0c0d8", fontSize: "0.92rem", lineHeight: 1.75 },
  detailTag: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", padding: "0.3rem 0.8rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 600, color: "#a29bfe" },
  skillMatch: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "14px", padding: "1.5rem", marginBottom: "2rem" },
  skillMatchTitle: { fontWeight: 700, fontSize: "0.88rem", marginBottom: "1.2rem", color: "#a29bfe" },
  skillRow: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.8rem" },
  skillName: { fontSize: "0.82rem", fontWeight: 600, minWidth: "90px" },
  skillBar: { flex: 1, height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "99px" },
  skillFill: { height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)" },
  skillPct: { fontSize: "0.78rem", fontWeight: 700, minWidth: "36px", textAlign: "right" },
  detailActions: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.9rem 2rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(108,92,231,0.35)" },
  btnOutline: { background: "transparent", color: "#e0e0f0", padding: "0.9rem 1.5rem", borderRadius: "10px", border: "1px solid rgba(108,92,231,0.3)", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Space Grotesk',sans-serif" },
  btnSm: { background: "rgba(108,92,231,0.2)", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", padding: "0.4rem 0.9rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", fontFamily: "'Space Grotesk',sans-serif" },
};
