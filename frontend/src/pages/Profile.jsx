// Profile.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

const statusColors = {
  PENDING: "#fdcb6e",
  ACCEPTED: "#00cec9",
  REJECTED: "#fd79a8",
};

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};

export default function Profile({ navProps, user, onNavigate }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState(user?.skills || []);
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeStatus, setResumeStatus] = useState({ loading: false, error: "", success: "" });
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    location: user?.location || "",
    headline: user?.headline || "",
    summary: user?.summary || "",
    linkedin: user?.linkedin || "",
    portfolio: user?.portfolio || "",
  });

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
          statusColor: statusColors[app.status] || "#a29bfe",
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

  const initials = profile.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "NA";

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (sk) => setSkills(skills.filter((s) => s !== sk));

  const skillProficiency = skills.slice(0, 6).map((name, i) => ({
    name,
    score: Math.max(50, 95 - i * 7),
  }));

  const handleProfileChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setResumeStatus({ loading: false, error: "Select a resume file first.", success: "" });
      return;
    }
    setResumeStatus({ loading: true, error: "", success: "" });
    try {
      const form = new FormData();
      form.append("resume", resumeFile);
      await API.post("/resume/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeStatus({ loading: false, error: "", success: "Resume uploaded successfully." });
    } catch (err) {
      setResumeStatus({ loading: false, error: getApiError(err), success: "" });
    }
  };

  const TABS = ["overview", "applications", "saved", "settings"];

  return (
    <div style={S.root}>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Profile" />

      {/* PROFILE HEADER */}
      <div style={S.profileHeader}>
        <div style={S.profileTop}>
          <div style={S.avatarWrap}>
            <div style={S.avatar}>{initials}</div>
            <div style={S.avatarBadge}>PRO</div>
          </div>
          <div style={S.profileInfo}>
            <h1 style={S.profileName}>{profile.name || "Add your name"}</h1>
            <div style={S.profileRole}>{profile.role || "Add your role"}</div>
            <div style={S.profileMeta}>
              <span>Location: {profile.location || "Add location"}</span>
              <span>Email: {profile.email || "Add email"}</span>
              <span>LinkedIn: {profile.linkedin || "Add LinkedIn"}</span>
            </div>
          </div>
          <div style={S.profileActions}>
            <button style={S.btnPrimary} onClick={() => onNavigate("Resume Analysis")}>
              Run Analysis
            </button>
            <button style={S.btnOutline} onClick={() => setEditMode(!editMode)}>
              {editMode ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* PROFILE STATS */}
        <div style={S.profileStats}>
          {[
            { v: user?.matchScore ? user.matchScore + "%" : "--", l: "AI Match Score", c: "#a29bfe" },
            { v: user?.applications ?? applications.length, l: "Applications", c: "#00cec9" },
            { v: user?.savedJobs ?? 0, l: "Saved Jobs", c: "#fd79a8" },
            { v: user?.profileStrength ? user.profileStrength + "%" : "--", l: "Profile Strength", c: "#fdcb6e" },
          ].map((s, i) => (
            <div key={i} style={S.pStat}>
              <div style={{ ...S.pStatV, color: s.c }}>{s.v}</div>
              <div style={S.pStatL}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {TABS.map((t) => (
          <button key={t} style={{ ...S.tab, ...(activeTab === t ? S.tabActive : {}) }}
            onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={S.body}>
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div style={S.grid}>
            {/* SKILLS */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <span style={S.cardTitle}>Skills</span>
                <span style={S.skillCount}>{skills.length} skills</span>
              </div>
              <div style={S.skillGrid}>
                {skills.length ? skills.map((sk) => (
                  <div key={sk} style={S.skillTag}>
                    {sk}
                    {editMode && (
                      <button style={S.removeSkill} onClick={() => removeSkill(sk)}>x</button>
                    )}
                  </div>
                )) : (
                  <div style={S.emptyText}>No skills added yet.</div>
                )}
              </div>
              {editMode && (
                <div style={S.addSkillRow}>
                  <input
                    style={S.skillInput}
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                  <button style={S.addSkillBtn} onClick={addSkill}>Add</button>
                </div>
              )}
            </div>

            {/* PROFILE DETAILS */}
            <div style={S.card}>
              <div style={S.cardTitle}>Profile Details</div>
              <div style={S.detailRow}>
                <label style={S.detailLabel}>Headline</label>
                <input
                  style={S.detailInput}
                  placeholder="e.g., Frontend Engineer"
                  value={profile.headline}
                  onChange={handleProfileChange("headline")}
                  disabled={!editMode}
                />
              </div>
              <div style={S.detailRow}>
                <label style={S.detailLabel}>Summary</label>
                <textarea
                  style={S.detailTextarea}
                  placeholder="Write a short summary about your experience..."
                  value={profile.summary}
                  onChange={handleProfileChange("summary")}
                  disabled={!editMode}
                  rows={4}
                />
              </div>
            </div>

            {/* SKILL CHART */}
            <div style={{ ...S.card, gridColumn: "span 2" }}>
              <div style={S.cardTitle}>Skill Proficiency</div>
              {skillProficiency.length ? (
                <div style={S.skillBars}>
                  {skillProficiency.map((sk) => (
                    <div key={sk.name} style={S.skillBarRow}>
                      <span style={S.sbName}>{sk.name}</span>
                      <div style={S.sbTrack}>
                        <div style={{ ...S.sbFill, width: `${sk.score}%` }} />
                      </div>
                      <span style={S.sbPct}>{sk.score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={S.emptyText}>Upload a resume to see proficiency scores.</div>
              )}
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === "applications" && (
          <div style={S.fullCard}>
            <div style={S.cardTitle}>My Applications ({applications.length})</div>
            {appError && <div style={S.error}>{appError}</div>}
            {appLoading && <div style={S.emptyText}>Loading applications...</div>}
            {!appLoading && applications.length === 0 && !appError && (
              <div style={S.emptyText}>No applications yet.</div>
            )}
            <div style={S.appList}>
              {applications.map((app, i) => (
                <div key={i} style={S.appRow}>
                  <div>
                    <div style={S.appTitle}>{app.title}</div>
                    <div style={S.appCompany}>{app.company} • Applied {app.date}</div>
                  </div>
                  <div style={{ ...S.statusBadge, background: app.statusColor + "22", color: app.statusColor, border: `1px solid ${app.statusColor}44` }}>
                    {app.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SAVED JOBS TAB */}
        {activeTab === "saved" && (
          <div style={S.fullCard}>
            <div style={S.cardTitle}>Saved Jobs (0)</div>
            <div style={S.emptyText}>No saved jobs yet.</div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div style={S.fullCard}>
            <div style={S.cardTitle}>Account Settings</div>
            <div style={S.settingsGrid}>
              {[
                { label: "Full Name", val: profile.name, field: "name" },
                { label: "Email", val: profile.email, field: "email" },
                { label: "Role / Title", val: profile.role, field: "role" },
                { label: "Location", val: profile.location, field: "location" },
                { label: "LinkedIn", val: profile.linkedin, field: "linkedin" },
                { label: "Portfolio", val: profile.portfolio, field: "portfolio" },
              ].map((f) => (
                <div key={f.label} style={S.settingField}>
                  <label style={S.settingLabel}>{f.label}</label>
                  <input style={S.settingInput} value={f.val} onChange={handleProfileChange(f.field)} />
                </div>
              ))}
            </div>

            <div style={S.settingSection}>Resume Upload</div>
            <div style={S.uploadBox}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <button style={S.btnPrimary} onClick={handleResumeUpload} disabled={resumeStatus.loading}>
                {resumeStatus.loading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
            {resumeStatus.error && <div style={S.error}>{resumeStatus.error}</div>}
            {resumeStatus.success && <div style={S.success}>{resumeStatus.success}</div>}

            <div style={S.settingSection}>Notification Preferences</div>
            {["Job match alerts", "Application status updates", "New job recommendations", "Weekly career digest"].map((n) => (
              <div key={n} style={S.notifRow}>
                <span style={S.notifLabel}>{n}</span>
                <div style={S.toggle}><div style={S.toggleDot} /></div>
              </div>
            ))}
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button style={S.btnPrimary}>Save Changes</button>
              <button style={{ ...S.btnOutline, color: "#fd79a8", borderColor: "rgba(253,121,168,0.3)" }}>
                Delete Account
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
  mesh: { position: "fixed", top: 0, right: 0, width: "600px", height: "600px", background: "radial-gradient(circle,rgba(108,92,231,0.09) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  profileHeader: { background: "linear-gradient(135deg,rgba(108,92,231,0.12),rgba(0,206,201,0.06))", borderBottom: "1px solid rgba(108,92,231,0.2)", padding: "2.5rem 3.5rem", position: "relative", zIndex: 1 },
  profileTop: { display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" },
  avatarWrap: { position: "relative", flexShrink: 0 },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#6c5ce7,#00cec9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.8rem", color: "#fff", boxShadow: "0 4px 24px rgba(108,92,231,0.5)" },
  avatarBadge: { position: "absolute", bottom: 0, right: 0, width: "22px", height: "22px", background: "#00cec9", borderRadius: "50%", border: "2px solid #0a0a14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#0a0a14" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "0.3rem" },
  profileRole: { color: "#a29bfe", fontWeight: 600, fontSize: "1rem", marginBottom: "0.6rem" },
  profileMeta: { display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#8888aa" },
  profileActions: { display: "flex", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap" },
  profileStats: { display: "flex", gap: "1.5rem", flexWrap: "wrap" },
  pStat: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", padding: "0.9rem 1.4rem", textAlign: "center" },
  pStatV: { fontSize: "1.5rem", fontWeight: 800 },
  pStatL: { fontSize: "0.72rem", color: "#8888aa", marginTop: "2px" },
  tabs: { display: "flex", borderBottom: "1px solid rgba(108,92,231,0.2)", padding: "0 3.5rem", position: "relative", zIndex: 1 },
  tab: { background: "none", border: "none", color: "#8888aa", padding: "1rem 1.3rem", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", borderBottom: "2px solid transparent", transition: "all 0.2s" },
  tabActive: { color: "#e0e0f0", borderBottom: "2px solid #7c6ff7" },
  body: { padding: "2.5rem 3.5rem", position: "relative", zIndex: 1 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", padding: "1.8rem" },
  fullCard: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", padding: "1.8rem" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  cardTitle: { fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" },
  skillCount: { fontSize: "0.75rem", color: "#8888aa", fontWeight: 600 },
  skillGrid: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" },
  skillTag: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", padding: "0.3rem 0.75rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 600, color: "#a29bfe", display: "flex", alignItems: "center", gap: "0.4rem" },
  removeSkill: { background: "none", border: "none", color: "#fd79a8", cursor: "pointer", fontWeight: 700, fontSize: "1rem", lineHeight: 1, padding: 0 },
  addSkillRow: { display: "flex", gap: "0.5rem", marginTop: "0.5rem" },
  skillInput: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#e0e0f0", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif" },
  addSkillBtn: { background: "rgba(108,92,231,0.3)", border: "1px solid rgba(108,92,231,0.4)", color: "#a29bfe", padding: "0.5rem 0.9rem", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", fontFamily: "'Space Grotesk',sans-serif" },
  detailRow: { display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem" },
  detailLabel: { fontSize: "0.78rem", color: "#a29bfe", fontWeight: 600 },
  detailInput: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#e0e0f0", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", outline: "none" },
  detailTextarea: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#e0e0f0", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", outline: "none", resize: "vertical" },
  strengthScore: { fontSize: "3rem", fontWeight: 800, color: "#00cec9", marginBottom: "0.5rem" },
  strengthBar: { height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", marginBottom: "1.5rem" },
  strengthFill: { height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)" },
  completionItems: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  completionItem: { display: "flex", gap: "0.75rem", fontSize: "0.85rem", alignItems: "center" },
  skillBars: { display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" },
  skillBarRow: { display: "flex", alignItems: "center", gap: "1rem" },
  sbName: { fontWeight: 600, fontSize: "0.85rem", minWidth: "90px" },
  sbTrack: { flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px" },
  sbFill: { height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)" },
  sbPct: { fontSize: "0.8rem", fontWeight: 700, color: "#a29bfe", minWidth: "36px", textAlign: "right" },
  appList: { display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" },
  appRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.2rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.15)", borderRadius: "12px", flexWrap: "wrap", gap: "0.75rem" },
  appTitle: { fontWeight: 700, fontSize: "0.92rem", marginBottom: "2px" },
  appCompany: { fontSize: "0.78rem", color: "#8888aa" },
  statusBadge: { padding: "0.3rem 0.9rem", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 700 },
  savedList: { display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" },
  savedRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.2rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.15)", borderRadius: "12px", flexWrap: "wrap", gap: "0.75rem" },
  savedActions: { display: "flex", alignItems: "center", gap: "0.75rem" },
  matchPill: { padding: "0.2rem 0.65rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 700 },
  settingsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "2rem" },
  settingField: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  settingLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#a29bfe", letterSpacing: "0.5px" },
  settingInput: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", color: "#e0e0f0", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.9rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif" },
  settingSection: { fontWeight: 700, fontSize: "0.88rem", color: "#a29bfe", letterSpacing: "0.5px", marginBottom: "1.2rem" },
  uploadBox: { display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" },
  notifRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 0", borderBottom: "1px solid rgba(108,92,231,0.1)" },
  notifLabel: { fontSize: "0.88rem", fontWeight: 500 },
  toggle: { width: "44px", height: "24px", background: "rgba(108,92,231,0.4)", borderRadius: "99px", padding: "3px", cursor: "pointer" },
  toggleDot: { width: "18px", height: "18px", background: "#a29bfe", borderRadius: "50%", marginLeft: "auto" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.8rem 1.8rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(108,92,231,0.35)" },
  btnOutline: { background: "transparent", color: "#e0e0f0", padding: "0.8rem 1.5rem", borderRadius: "10px", border: "1px solid rgba(108,92,231,0.3)", cursor: "pointer", fontWeight: 600, fontSize: "0.88rem", fontFamily: "'Space Grotesk',sans-serif" },
  btnSm: { background: "rgba(108,92,231,0.2)", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", padding: "0.35rem 0.8rem", borderRadius: "7px", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", fontFamily: "'Space Grotesk',sans-serif" },
  error: { background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "1rem" },
  success: { background: "rgba(0,206,201,0.12)", border: "1px solid rgba(0,206,201,0.35)", color: "#00cec9", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "1rem" },
  emptyText: { color: "#8888aa", fontSize: "0.82rem" },
};


