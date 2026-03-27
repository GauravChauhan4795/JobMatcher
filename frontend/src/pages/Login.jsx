import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

export default function Login({ navProps, onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("JOB_SEEKER");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await API.post("/auth/register", { name, email, password, role });
      }
      const res = await API.post("/auth/login", { email, password });
      if (!res.data?.token || !res.data?.user) throw new Error("Login failed");
      if (onLogin) onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.root}>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="" />

      <div style={S.page}>
        <div style={S.box}>
          <div style={S.logo}>
            <span style={{ color: "#a29bfe" }}>SJ</span><span style={{ color: "#00cec9" }}>_</span><span>Map</span>
          </div>

          <h1 style={S.heading}>{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p style={S.sub}>{mode === "login" ? "Sign in to your account" : "Start your journey on SJ_Map"}</p>

          <div style={S.orDivider}><div style={S.divLine} /><span style={S.divTxt}>or sign in manually</span><div style={S.divLine} /></div>

          <div style={S.toggle}>
            {["login", "signup"].map(m => (
              <button key={m} style={{ ...S.toggleBtn, ...(mode === m ? S.toggleActive : {}) }} onClick={() => setMode(m)}>
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          <div style={S.form}>
            {mode === "signup" && (
              <>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Full Name</label>
                  <input style={S.input} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Account Type</label>
                  <div style={S.roleSelector}>
                    {[{ val: "JOB_SEEKER", label: "Job Seeker", icon: "👤" }, { val: "RECRUITER", label: "Recruiter", icon: "🏢" }].map(r => (
                      <button key={r.val} style={{ ...S.roleBtn, ...(role === r.val ? S.roleBtnActive : {}) }} onClick={() => setRole(r.val)}>
                        <span>{r.icon}</span> {r.label}
                        {r.val === "RECRUITER" && <span style={S.approvalNote}>Requires approval</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div style={S.fieldGroup}>
              <label style={S.label}>Email Address</label>
              <input style={S.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>Password</label>
              <input style={S.input} type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>

            {error && <div style={S.error}>{error}</div>}

            <button style={S.btnPrimary} onClick={handleSubmit} disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In ?" : "Create Account ?"}
            </button>
          </div>

          <div style={S.footer}>
            {mode === "login" ? <>Don't have an account? <button style={S.link} onClick={() => setMode("signup")}>Sign up free</button></>
              : <>Already have an account? <button style={S.link} onClick={() => setMode("login")}>Login</button></>}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: "-100px", left: "30%", width: "700px", height: "700px", background: "radial-gradient(circle,rgba(108,92,231,0.12) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 65px)", padding: "2rem", position: "relative", zIndex: 1 },
  box: { width: "100%", maxWidth: "500px", padding: "2.5rem 2.5rem", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "20px", background: "rgba(13,13,28,0.9)", backdropFilter: "blur(12px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", animation: "slideUp 0.4s ease" },
  logo: { fontFamily: "'DM Mono',monospace", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-1px", marginBottom: "1.5rem" },
  heading: { fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "0.4rem" },
  sub: { color: "#8888aa", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.5rem" },
  demoSection: { marginBottom: "1.2rem" },
  demoLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#8888aa", marginBottom: "0.75rem" },
  demoGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem" },
  demoBtn: { padding: "0.65rem 0.5rem", borderRadius: "10px", border: "1px solid", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", background: "transparent", transition: "opacity 0.2s" },
  orDivider: { display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.2rem 0" },
  divLine: { flex: 1, height: "1px", background: "rgba(108,92,231,0.2)" },
  divTxt: { fontSize: "0.72rem", color: "#8888aa", fontWeight: 600, whiteSpace: "nowrap" },
  toggle: { display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "10px", padding: "3px", marginBottom: "1.5rem", width: "fit-content" },
  toggleBtn: { padding: "0.4rem 1.2rem", borderRadius: "7px", border: "none", background: "transparent", color: "#8888aa", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", transition: "all 0.2s" },
  toggleActive: { background: "rgba(108,92,231,0.3)", color: "#e0e0f0" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.78rem", fontWeight: 600, color: "#a29bfe", letterSpacing: "0.5px" },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#e0e0f0", padding: "0.8rem 1rem", borderRadius: "10px", fontSize: "0.92rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif" },
  roleSelector: { display: "flex", gap: "0.6rem" },
  roleBtn: { flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid rgba(108,92,231,0.25)", background: "rgba(255,255,255,0.02)", color: "#8888aa", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", fontFamily: "'Space Grotesk',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", transition: "all 0.2s" },
  roleBtnActive: { borderColor: "#7c6ff7", background: "rgba(108,92,231,0.2)", color: "#e0e0f0" },
  approvalNote: { fontSize: "0.62rem", color: "#fdcb6e", fontWeight: 500 },
  error: { background: "rgba(253,121,168,0.1)", border: "1px solid rgba(253,121,168,0.3)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.9rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(108,92,231,0.35)", marginTop: "0.3rem" },
  footer: { marginTop: "1.5rem", fontSize: "0.85rem", color: "#8888aa", textAlign: "center" },
  link: { background: "none", border: "none", color: "#a29bfe", cursor: "pointer", fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" },
};

