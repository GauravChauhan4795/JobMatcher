// LoginPage.jsx
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

export default function Login({ navProps, onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("JOB_SEEKER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailNext = () => {
    setError("");
    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    setStep("oauth");
  };

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let userPayload = { name: name || email.split("@")[0], email, role };
      if (mode === "signup") {
        const reg = await API.post("/auth/register", {
          name,
          email,
          password,
          role,
        });
        userPayload = { ...userPayload, ...reg.data };
      }

      const res = await API.post("/auth/login", { email, password });
      if (!res.data?.token) {
        throw new Error("Login failed");
      }

      onLogin(userPayload, res.data.token);
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
            <span style={{ color: "#a29bfe" }}>SJ</span>
            <span style={{ color: "#00cec9" }}>_</span>
            <span>Map</span>
          </div>

          <h1 style={S.heading}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={S.sub}>
            {mode === "login"
              ? "Sign in to access your personalized job matches."
              : "Start matching your skills to the right opportunities."}
          </p>

          <div style={S.toggle}>
            <button
              style={{ ...S.toggleBtn, ...(mode === "login" ? S.toggleActive : {}) }}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              style={{ ...S.toggleBtn, ...(mode === "signup" ? S.toggleActive : {}) }}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {step === "email" && (
            <div style={S.form}>
              {mode === "signup" && (
                <>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Full Name</label>
                    <input
                      style={S.input}
                      placeholder="Arjun Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Account Type</label>
                    <select
                      style={S.input}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="JOB_SEEKER">Job Seeker</option>
                      <option value="RECRUITER">Recruiter</option>
                    </select>
                  </div>
                </>
              )}
              <div style={S.fieldGroup}>
                <label style={S.label}>Email Address</label>
                <input
                  style={S.input}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailNext()}
                />
              </div>
              {error && <div style={S.error}>{error}</div>}
              <button style={S.btnPrimary} onClick={handleEmailNext}>
                Continue
              </button>
            </div>
          )}

          {step === "oauth" && (
            <div style={{ animation: "slideUp 0.3s ease" }}>
              <div style={S.emailDisplay}>
                Continuing as <strong>{email}</strong>
                <button style={S.changeBtn} onClick={() => setStep("email")}>Change</button>
              </div>

              <div style={S.form}>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Password</label>
                  <input
                    style={S.input}
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
                {error && <div style={S.error}>{error}</div>}
                <button style={S.btnPrimary} onClick={handleSubmit} disabled={loading}>
                  {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                </button>
              </div>
            </div>
          )}

          <div style={S.footer}>
            {mode === "login" ? (
              <>Don't have an account? <button style={S.link} onClick={() => setMode("signup")}>Sign up free</button></>
            ) : (
              <>Already have an account? <button style={S.link} onClick={() => setMode("login")}>Login</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: "-100px", left: "30%", width: "700px", height: "700px", background: "radial-gradient(circle,rgba(108,92,231,0.12) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 65px)", position: "relative", zIndex: 1 },
  box: { width: "100%", maxWidth: "480px", padding: "3rem 2.5rem", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0,0.03", backdropFilter: "blur(12px)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", animation: "slideUp 0.4s ease" },
  logo: { fontFamily: "'DM Mono',monospace", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-1px", marginBottom: "2rem" },
  heading: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "0.5rem" },
  sub: { color: "#8888aa", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.8rem" },
  toggle: { display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "10px", padding: "3px", marginBottom: "1.8rem", width: "fit-content" },
  toggleBtn: { padding: "0.4rem 1.2rem", borderRadius: "7px", border: "none", background: "transparent", color: "#8888aa", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", transition: "all 0.2s" },
  toggleActive: { background: "rgba(108,92,231,0.3)", color: "#e0e0f0" },
  form: { display: "flex", flexDirection: "column", gap: "1.1rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.8rem", fontWeight: 600, color: "#a29bfe", letterSpacing: "0.5px" },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)", color: "#e0e0f0", padding: "0.85rem 1rem", borderRadius: "10px", fontSize: "0.95rem", outline: "none", fontFamily: "'Space Grotesk',sans-serif", transition: "border-color 0.2s" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.9rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(108,92,231,0.35)", marginTop: "0.3rem" },
  emailDisplay: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", borderRadius: "10px", padding: "0.8rem 1rem", fontSize: "0.85rem", color: "#a29bfe", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  changeBtn: { background: "none", border: "none", color: "#8888aa", cursor: "pointer", fontSize: "0.78rem", fontFamily: "'Space Grotesk',sans-serif" },
  error: { background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem" },
  footer: { marginTop: "auto", paddingTop: "2rem", fontSize: "0.85rem", color: "#8888aa", textAlign: "center" },
  link: { background: "none", border: "none", color: "#a29bfe", cursor: "pointer", fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" },
};




