// LoginPage.jsx
import { useState } from "react";
import Navbar from "./Navbar";

export default function LoginPage({ navProps, onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // email | oauth | form
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailNext = () => {
    if (email.includes("@")) setStep("oauth");
  };

  const handleOAuth = (provider) => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: name || "Arjun Kumar",
        email,
        provider,
        role: "Full Stack Developer",
        location: "Bangalore, India",
        skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
        matchScore: 94,
        applications: 12,
        savedJobs: 7,
        profileStrength: 88,
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={S.root}>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="" />

      <div style={S.page}>
        <div style={S.box}>
          {/* Logo */}
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

          {/* MODE TOGGLE */}
          <div style={S.toggle}>
            <button
              style={{ ...S.toggleBtn, ...(mode === "login" ? S.toggleActive : {}) }}
              onClick={() => setMode("login")}
            >Login</button>
            <button
              style={{ ...S.toggleBtn, ...(mode === "signup" ? S.toggleActive : {}) }}
              onClick={() => setMode("signup")}
            >Sign Up</button>
          </div>

          {step === "email" && (
            <div style={S.form}>
              {mode === "signup" && (
                <div style={S.fieldGroup}>
                  <label style={S.label}>Full Name</label>
                  <input
                    style={S.input}
                    placeholder="Arjun Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
              <button style={S.btnPrimary} onClick={handleEmailNext}>
                Continue →
              </button>
            </div>
          )}

          {step === "oauth" && (
            <div style={{ animation: "slideUp 0.3s ease" }}>
              <div style={S.emailDisplay}>
                Continuing as <strong>{email}</strong>
                <button style={S.changeBtn} onClick={() => setStep("email")}>Change</button>
              </div>

              {loading ? (
                <div style={S.loadingWrap}>
                  <div style={S.spinner} />
                  <div style={S.loadingText}>Authenticating…</div>
                </div>
              ) : (
                <div style={S.oauthBtns}>
                  {[
                    { label: "Continue with Google", icon: "G", color: "#4285F4", bg: "#4285F4" },
                    { label: "Continue with GitHub", icon: "⌥", color: "#e0e0f0", bg: "#24292e" },
                    { label: "Continue with LinkedIn", icon: "in", color: "#fff", bg: "#0077B5" },
                  ].map((p) => (
                    <button key={p.label} style={{ ...S.oauthBtn, borderColor: p.bg }}
                      onClick={() => handleOAuth(p.label.split(" ")[2])}>
                      <span style={{ ...S.oIcon, background: p.bg, color: p.color }}>{p.icon}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              )}

              <div style={S.dividerRow}><div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} /></div>

              <div style={S.form}>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Password</label>
                  <input style={S.input} type="password" placeholder="••••••••" />
                </div>
                <button style={S.btnPrimary} onClick={() => handleOAuth("Email")}>
                  {mode === "login" ? "Sign In with Password" : "Create Account"}
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

        {/* SIDE BENEFITS */}
        {/* <div style={S.sidePanel}>
          <div style={S.sideBadge}>✦ Trusted by 50,000+ professionals</div>
          <h2 style={S.sideTitle}>Your skills deserve<br />the right opportunity</h2>
          <div style={S.benefits}>
            {[
              { icon: "🧠", t: "AI-powered resume parsing" },
              { icon: "🎯", t: "94% job match accuracy" },
              { icon: "⚡", t: "Get noticed 3x faster" },
              { icon: "🗺️", t: "Personalised career roadmaps" },
            ].map((b, i) => (
              <div key={i} style={S.benefit}>
                <span style={S.benefitIcon}>{b.icon}</span>
                <span style={S.benefitText}>{b.t}</span>
              </div>
            ))}
          </div>
          <div style={S.testimonial}>
            <div style={S.testText}>"SJ_Map matched me to my dream role in 3 days. The skill analysis was spot-on."</div>
            <div style={S.testAuthor}>— Priya Sharma, SDE @ Zepto</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: "-100px", left: "30%", width: "700px", height: "700px", background: "radial-gradient(circle,rgba(108,92,231,0.12) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 65px)", position: "relative", zIndex: 1 },
  box: { width: "100%", maxWidth: "480px", padding: "3rem 2.5rem", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0,0.03", backdropFilter: "blur(12px)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", animation: "slideUp 0.4s ease",},
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
  oauthBtns: { display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.2rem" },
  oauthBtn: { display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid", borderRadius: "10px", padding: "0.85rem 1.2rem", color: "#e0e0f0", cursor: "pointer", fontWeight: 600, fontSize: "0.92rem", fontFamily: "'Space Grotesk',sans-serif", transition: "background 0.2s" },
  oIcon: { width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.78rem", flexShrink: 0 },
  dividerRow: { display: "flex", alignItems: "center", gap: "0.8rem", margin: "1.2rem 0" },
  divLine: { flex: 1, height: "1px", background: "rgba(108,92,231,0.2)" },
  divText: { color: "#8888aa", fontSize: "0.78rem", fontWeight: 600 },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem 0" },
  spinner: { width: "32px", height: "32px", borderRadius: "50%", border: "3px solid rgba(108,92,231,0.2)", borderTop: "3px solid #a29bfe", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#8888aa", fontSize: "0.85rem" },
  footer: { marginTop: "auto", paddingTop: "2rem", fontSize: "0.85rem", color: "#8888aa", textAlign: "center" },
  link: { background: "none", border: "none", color: "#a29bfe", cursor: "pointer", fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" },
  sidePanel: { flex: 1, padding: "4rem", background: "linear-gradient(135deg,rgba(108,92,231,0.07),rgba(0,206,201,0.04))", display: "flex", flexDirection: "column", justifyContent: "center" },
  sideBadge: { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px", color: "#00cec9", marginBottom: "1.5rem" },
  sideTitle: { fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.8px", marginBottom: "2.5rem" },
  benefits: { display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" },
  benefit: { display: "flex", alignItems: "center", gap: "1rem" },
  benefitIcon: { width: "40px", height: "40px", background: "rgba(108,92,231,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 },
  benefitText: { fontWeight: 600, fontSize: "0.92rem" },
  testimonial: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "14px", padding: "1.5rem", borderLeft: "3px solid #7c6ff7" },
  testText: { fontSize: "0.92rem", lineHeight: 1.7, color: "#c0c0d8", marginBottom: "0.8rem", fontStyle: "italic" },
  testAuthor: { fontSize: "0.78rem", color: "#8888aa", fontWeight: 600 },
};
