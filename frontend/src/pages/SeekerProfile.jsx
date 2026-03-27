import { useState } from "react";
import Navbar from "../components/layout/Navbar";

export default function SeekerProfile({ navProps, user, onNavigate, onUserUpdate }) {
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
    title: user?.title || ""
    });
  const [saved, setSaved] = useState(false);

  const initials = (user?.name || "")
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleSave = () => {
    if (onUserUpdate) onUserUpdate(form);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

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
      <Navbar {...navProps} activePage="Profile" />

      <div style={S.page}>
        {saved && <div style={S.savedToast}>✅ Profile saved successfully!</div>}

        {/* PROFILE HEADER */}
        <div style={S.profileHeader}>
          <div style={S.profileLeft}>
            <div style={S.avatar}>{initials}</div>
            <div>
              {editMode ? (
                <input style={S.nameInput} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              ) : (
                <h1 style={S.name}>{form.name}</h1>
              )}
              {editMode ? (
                <input style={S.subInput} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Your title/role" />
              ) : (
                <div style={S.title}>{form.title}</div>
              )}
              <div style={S.metaRow}>
                <span>📧 {form.email}</span>
                {editMode ? (
                  <input style={S.metaInput} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" />
                ) : (
                  <span>📍 {form.location}</span>
                )}
              </div>
            </div>
          </div>
          <div style={S.headerActions}>
            {editMode ? (
              <>
                <button style={S.btnSave} onClick={handleSave}>Save Changes</button>
                <button style={S.btnCancel} onClick={() => setEditMode(false)}>Cancel</button>
              </>
            ) : (
              <button style={S.btnEdit} onClick={() => setEditMode(true)}>Edit Profile</button>
            )}
          </div>
        </div>

        <div style={S.grid}>
          {/* SKILLS */}
          <div style={S.card}>
            <div style={S.cardTitle}>Skills</div>
            <div style={S.skillGrid}>
              {skills.map(sk => (
                <div key={sk} style={S.skillTag}>
                  {sk}
                  {editMode && <button style={S.removeBtn} onClick={() => setSkills(skills.filter(s => s !== sk))}>×</button>}
                </div>
              ))}
            </div>
            {editMode && (
              <div style={S.addSkillRow}>
                <input style={S.skillInput} placeholder="Add a skill…" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} />
                <button style={S.addBtn} onClick={addSkill}>Add</button>
              </div>
            )}
          </div>

          {/* QUICK LINKS */}
          <div style={S.card}>
            <div style={S.cardTitle}>Profile Completeness</div>
            <div style={S.progressBar}>
              <div style={{ ...S.progressFill, width: `${Math.min(100, 40 + skills.length * 8)}%` }} />
            </div>
            <div style={{ fontSize: "0.82rem", color: "#a29bfe", fontWeight: 700, marginBottom: "1rem" }}>{Math.min(100, 40 + skills.length * 8)}% complete</div>
            {[
              { done: !!form.name, label: "Name added" },
              { done: !!form.email, label: "Email verified" },
              { done: skills.length >= 3, label: "3+ skills added" },
              { done: !!form.location, label: "Location set" },
              { done: !!form.title, label: "Job title added" },
            ].map((item, i) => (
              <div key={i} style={S.checkItem}>
                <span style={{ color: item.done ? "#00cec9" : "#fd79a8" }}>{item.done ? "✓" : "○"}</span>
                <span style={{ color: item.done ? "#e0e0f0" : "#8888aa" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ ...S.card, gridColumn: "span 2" }}>
            <div style={S.cardTitle}>Quick Actions</div>
            <div style={S.actionRow}>
              {[
                { icon: "🔍", label: "Browse Jobs", sub: "Find your next opportunity", page: "Jobs", color: "#a29bfe" },
                { icon: "📄", label: "My Applications", sub: "Track your applications", page: "Applications", color: "#00cec9" },
                { icon: "⚡", label: "Resume Analysis", sub: "AI-powered skill analysis", page: "Resume Analysis", color: "#fd79a8" },
              ].map((a, i) => (
                <button key={i} style={{ ...S.actionCard, borderColor: a.color + "44", background: a.color + "0d" }} onClick={() => onNavigate(a.page)}>
                  <span style={{ fontSize: "1.8rem" }}>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: a.color, fontSize: "0.88rem" }}>{a.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "#8888aa", marginTop: "2px" }}>{a.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: 0, right: 0, width: "600px", height: "600px", background: "radial-gradient(circle,rgba(0,206,201,0.07) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  page: { maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1 },
  savedToast: { position: "fixed", top: "80px", right: "2rem", background: "rgba(0,206,201,0.15)", border: "1px solid rgba(0,206,201,0.4)", color: "#00cec9", padding: "0.75rem 1.5rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.88rem", zIndex: 999 },
  profileHeader: { background: "linear-gradient(135deg,rgba(0,206,201,0.08),rgba(108,92,231,0.06))", border: "1px solid rgba(0,206,201,0.15)", borderRadius: "20px", padding: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1.5rem" },
  profileLeft: { display: "flex", gap: "1.5rem", alignItems: "flex-start" },
  avatar: { width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,#00cec9,#6c5ce7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.5rem", color: "#fff", flexShrink: 0, boxShadow: "0 4px 20px rgba(0,206,201,0.3)" },
  name: { fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.4px", marginBottom: "0.3rem" },
  nameInput: { fontSize: "1.5rem", fontWeight: 800, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(108,92,231,0.4)", color: "#e0e0f0", borderRadius: "8px", padding: "0.3rem 0.6rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif", marginBottom: "0.3rem", width: "100%" },
  title: { color: "#a29bfe", fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.6rem" },
  subInput: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", borderRadius: "8px", padding: "0.25rem 0.6rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.9rem", marginBottom: "0.5rem", width: "100%" },
  metaRow: { display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.8rem", color: "#8888aa", alignItems: "center" },
  metaInput: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#e0e0f0", borderRadius: "6px", padding: "0.2rem 0.5rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.8rem", width: "150px" },
  headerActions: { display: "flex", gap: "0.75rem", flexShrink: 0 },
  btnEdit: { background: "rgba(108,92,231,0.2)", border: "1px solid rgba(108,92,231,0.4)", color: "#a29bfe", padding: "0.65rem 1.5rem", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "0.88rem" },
  btnSave: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.65rem 1.5rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.88rem" },
  btnCancel: { background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#8888aa", padding: "0.65rem 1.2rem", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "0.88rem" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "16px", padding: "1.5rem" },
  cardTitle: { fontWeight: 700, fontSize: "0.92rem", marginBottom: "1rem" },
  skillGrid: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" },
  skillTag: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", padding: "0.3rem 0.75rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 600, color: "#a29bfe", display: "flex", alignItems: "center", gap: "0.4rem" },
  removeBtn: { background: "none", border: "none", color: "#fd79a8", cursor: "pointer", fontWeight: 700, fontSize: "1rem", lineHeight: 1, padding: 0 },
  addSkillRow: { display: "flex", gap: "0.5rem", marginTop: "0.5rem" },
  skillInput: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#e0e0f0", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif" },
  addBtn: { background: "rgba(108,92,231,0.3)", border: "1px solid rgba(108,92,231,0.4)", color: "#a29bfe", padding: "0.5rem 0.9rem", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem" },
  progressBar: { height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", marginBottom: "0.5rem" },
  progressFill: { height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)", transition: "width 0.5s ease" },
  checkItem: { display: "flex", gap: "0.75rem", alignItems: "center", fontSize: "0.85rem", padding: "0.35rem 0" },
  actionRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem" },
  actionCard: { padding: "1.2rem", borderRadius: "12px", border: "1px solid", cursor: "pointer", display: "flex", gap: "0.9rem", alignItems: "center", background: "transparent", textAlign: "left" },
};
