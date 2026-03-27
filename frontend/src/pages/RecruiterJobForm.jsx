// RecruiterJobForm.jsx — post a new job
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import API from "../api/Api";

export default function RecruiterJobForm({ navProps, user, onNavigate }) {
  const [form, setForm] = useState({ title: "", company_name: user?.company || "", description: "", location: "", job_type: "Full-time", salary: "", skills: [] });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isPending = user?.recruiterStatus === "PENDING";

  const addSkill = (skill) => {
    const s = skill || skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput("");
    }
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter(sk => sk !== s) });

  const handleSubmit = async () => {
    setError("");
    if (!form.title || !form.company_name || !form.description) {
      setError("Please fill all required fields (Title, Company, Description)");
      return;
    }
    if (isPending) { setError("Your account is pending admin approval."); return; }

    setLoading(true);
    try {
      await API.post("/jobs", form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={S.root}>
        <Navbar {...navProps} activePage="Post Job" />
        <div style={S.successPage}>
          <div style={S.successIcon}>🎉</div>
          <h1 style={S.successTitle}>Job Posted!</h1>
          <p style={S.successSub}>Your job listing has been submitted for admin review. It will be visible to candidates once approved.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button style={S.btnPrimary} onClick={() => onNavigate("Dashboard")}>Back to Dashboard</button>
            <button style={S.btnOutline} onClick={() => { setSuccess(false); setForm({ title: "", company_name: user?.company || "", description: "", location: "", job_type: "Full-time", salary: "", skills: [] }); }}>Post Another Job</button>
          </div>
        </div>
      </div>
    );
  }

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
        input:focus, textarea:focus, select:focus { border-color: rgba(162,155,254,0.5) !important; }
      `}</style>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Post Job" />

      <div style={S.page}>
        <div style={S.header}>
          <button style={S.backBtn} onClick={() => onNavigate("Dashboard")}>← Back to Dashboard</button>
          <div style={S.headerLabel}>Create Listing</div>
          <h1 style={S.heading}>Post a New Job</h1>
          <p style={S.sub}>Fill in the details below. New listings are reviewed by admins before going live.</p>
        </div>

        {isPending && (
          <div style={S.warningBox}>⚠️ Your recruiter account is pending admin approval. You can draft a job, but it won't be submitted until you're approved.</div>
        )}

        <div style={S.formCard}>
          {/* BASIC INFO */}
          <div style={S.section}>
            <div style={S.sectionTitle}>Basic Information</div>
            <div style={S.fieldGrid}>
              <div style={S.field}>
                <label style={S.label}>Job Title <span style={S.req}>*</span></label>
                <input style={S.input} placeholder="e.g. Senior React Developer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Company Name <span style={S.req}>*</span></label>
                <input style={S.input} placeholder="Your company name" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Location</label>
                <input style={S.input} placeholder="e.g. Bangalore / Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Job Type</label>
                <select style={S.input} value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}>
                  {["Full-time", "Part-time", "Remote", "Contract", "Internship"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ ...S.field, gridColumn: "span 2" }}>
                <label style={S.label}>Salary Range</label>
                <input style={S.input} placeholder="e.g. ₹20–30 LPA or $80K–100K" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div style={S.section}>
            <div style={S.sectionTitle}>Job Description <span style={S.req}>*</span></div>
            <textarea style={S.textarea} placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={8} />
            <div style={{ fontSize: "0.75rem", color: "#8888aa", marginTop: "0.4rem" }}>{form.description.length} characters</div>
          </div>

          {/* SKILLS */}
          <div style={S.section}>
            <div style={S.sectionTitle}>Required Skills</div>
            <div style={S.skillsWrap}>
              {form.skills.map(sk => (
                <div key={sk} style={S.skillTag}>
                  {sk}
                  <button style={S.removeSkill} onClick={() => removeSkill(sk)}>×</button>
                </div>
              ))}
            </div>
            <div style={S.skillInputRow}>
              <input style={S.skillInput} placeholder="Type a skill and press Enter…" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} />
              <button style={S.addBtn} onClick={() => addSkill()}>Add</button>
            </div>
          </div>

          {error && <div style={S.errorBox}>{error}</div>}

          <div style={S.actions}>
            <button style={S.btnOutline} onClick={() => onNavigate("Dashboard")}>Cancel</button>
            <button style={S.btnPrimary} onClick={handleSubmit} disabled={loading || isPending}>
              {loading ? "Submitting…" : "Submit for Review →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: 0, right: 0, width: "600px", height: "600px", background: "radial-gradient(circle,rgba(162,155,254,0.07) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  page: { maxWidth: "820px", margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1 },
  header: { marginBottom: "2rem" },
  backBtn: { background: "none", border: "none", color: "#8888aa", cursor: "pointer", fontSize: "0.85rem", fontFamily: "'Space Grotesk',sans-serif", marginBottom: "1.2rem", padding: 0 },
  headerLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#a29bfe", marginBottom: "0.4rem" },
  heading: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px" },
  sub: { color: "#8888aa", fontSize: "0.88rem", marginTop: "0.4rem" },
  warningBox: { background: "rgba(253,203,110,0.08)", border: "1px solid rgba(253,203,110,0.3)", color: "#fdcb6e", padding: "1rem 1.3rem", borderRadius: "12px", fontSize: "0.88rem", marginBottom: "1.5rem" },
  formCard: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "20px", overflow: "hidden" },
  section: { padding: "2rem", borderBottom: "1px solid rgba(108,92,231,0.1)" },
  sectionTitle: { fontWeight: 700, fontSize: "0.9rem", marginBottom: "1.2rem", color: "#a29bfe" },
  fieldGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.78rem", fontWeight: 600, color: "#c0c0d8", letterSpacing: "0.3px" },
  req: { color: "#fd79a8" },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", color: "#e0e0f0", padding: "0.8rem 1rem", borderRadius: "10px", fontSize: "0.9rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif", transition: "border-color 0.2s" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", color: "#e0e0f0", padding: "1rem", borderRadius: "12px", fontSize: "0.9rem", resize: "vertical", outline: "none", fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.7, transition: "border-color 0.2s" },
  skillsWrap: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem", minHeight: "32px" },
  skillTag: { background: "rgba(162,155,254,0.15)", border: "1px solid rgba(162,155,254,0.3)", padding: "0.3rem 0.75rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 600, color: "#a29bfe", display: "flex", alignItems: "center", gap: "0.4rem" },
  removeSkill: { background: "none", border: "none", color: "#fd79a8", cursor: "pointer", fontWeight: 700, fontSize: "1rem", lineHeight: 1, padding: 0 },
  skillInputRow: { display: "flex", gap: "0.5rem", marginBottom: "1rem" },
  skillInput: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", color: "#e0e0f0", padding: "0.7rem 1rem", borderRadius: "10px", fontSize: "0.88rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif" },
  addBtn: { background: "rgba(108,92,231,0.3)", border: "1px solid rgba(108,92,231,0.4)", color: "#a29bfe", padding: "0.7rem 1.2rem", borderRadius: "10px", cursor: "pointer", fontWeight: 700 },
  errorBox: { margin: "1.5rem 2rem 0", background: "rgba(253,121,168,0.1)", border: "1px solid rgba(253,121,168,0.3)", color: "#fd79a8", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.85rem" },
  actions: { display: "flex", gap: "1rem", justifyContent: "flex-end", padding: "1.5rem 2rem" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.85rem 2rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 4px 20px rgba(108,92,231,0.35)" },
  btnOutline: { background: "transparent", color: "#8888aa", padding: "0.85rem 1.5rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" },
  successPage: { textAlign: "center", padding: "8rem 2rem", position: "relative", zIndex: 1 },
  successIcon: { fontSize: "4rem", marginBottom: "1.5rem" },
  successTitle: { fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "1rem" },
  successSub: { color: "#8888aa", maxWidth: "480px", margin: "0 auto 2.5rem", lineHeight: 1.8 },
};
