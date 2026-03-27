import { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";

const FEATURES = [
  { icon: "AI", title: "AI Resume Analysis", desc: "Deep-parse resumes to extract skills, projects, and certifications beyond surface keywords.", color: "#7c6ff7" },
  // { icon: "RANK", title: "Skill-Based Ranking", desc: "Score and rank candidates based on weighted skill alignment, not arbitrary keyword filters.", color: "#00cec9" },
  { icon: "MATCH", title: "Personalized Matches", desc: "Curated job matches that evolve as you grow your skills and build your portfolio.", color: "#fd79a8" },
  // { icon: "DASH", title: "Recruiter Dashboard", desc: "Visual candidate insights and skill heat maps for faster, smarter hiring decisions.", color: "#fdcb6e" },
  { icon: "GAP", title: "Skill Gap Analysis", desc: "Identify missing skills for target roles with personalized learning path recommendations.", color: "#7c6ff7" },
  { icon: "PATH", title: "Career Path Mapping", desc: "AI-driven roadmaps showing exactly what to develop to land your dream role.", color: "#00cec9" },
];

const STEPS = [
  { n: "01", title: "Upload Resume", desc: "Our AI extracts and structures skills, certifications, and project outcomes automatically." },
  { n: "02", title: "AI Scores Your Profile", desc: "ML models assign confidence scores to each skill based on demonstrated evidence." },
  { n: "03", title: "Smart Matching Runs", desc: "The engine cross-references your profile against thousands of live job postings in real-time." },
  { n: "04", title: "Apply and Stand Out", desc: "Recruiters see your pre-analyzed skill match score before they even open your resume." },
];

export default function Home({ navProps }) {
  const [email, setEmail] = useState("");
  const [oauthStep, setOauthStep] = useState(false); // show oauth buttons after email
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const idx = Number(e.target.dataset.idx);
          setVisibleCards((p) => [...new Set([...p, idx])]);
        }
      }),
      { threshold: 0.12 }
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleEmailSubmit = () => {
    if (email.includes("@")) setOauthStep(true);
  };

  const handleOAuth = () => {
    navProps.onNavigate("Login");
  };

  return (
    <div style={S.root}>
      <div style={S.mesh1} />
      <div style={S.mesh2} />
      <Navbar {...navProps} activePage="Home" />

      {/* HERO */}
      <section style={S.hero}>
        <div style={S.badge}><span style={S.badgeDot} />AI-Powered - HR Tech Platform</div>
        <h1 style={S.h1}>
          Match Skills to Jobs,<br />
          <span style={S.grad}>Not Just Keywords</span>
        </h1>
        <p style={S.heroSub}>
          An intelligent recruitment platform connecting candidates to opportunities based on real skills,
          certifications, projects, and experience - not resume buzzwords.
        </p>
        <div style={S.heroBtns}>
          <button style={S.btnPrimary} onClick={() => navProps.onNavigate("Resume Analysis")}>
            Analyze My Resume
          </button>
          <button style={S.btnOutline} onClick={() => navProps.onNavigate("Jobs")}>
            Browse Jobs
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section style={S.section}>
        <div style={S.label}>Features</div>
        <h2 style={S.title}>Everything you need to hire smarter</h2>
        <p style={S.sub}>A few intelligent modules eliminating guesswork from recruitment.</p>
        <div style={S.grid}>
          {FEATURES.map((f, i) => (
            <div key={i} data-idx={i} ref={(el) => (cardRefs.current[i] = el)}
              style={{
                ...S.card,
                opacity: visibleCards.includes(i) ? 1 : 0,
                transform: visibleCards.includes(i) ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`,
              }}>
              <div style={{ ...S.cardIcon, background: f.color + "22", border: `1px solid ${f.color}44` }}>{f.icon}</div>
              <h3 style={S.cardTitle}>{f.title}</h3>
              <p style={S.cardDesc}>{f.desc}</p>
              <div style={{ ...S.cardAccent, background: f.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ ...S.section, background: "rgba(255,255,255,0.015)" }}>
        <div style={S.label}>Process</div>
        <h2 style={S.title}>How SJ_Map works</h2>
        <p style={S.sub}>From resume upload to perfect match in minutes.</p>
        <div style={S.steps}>
          {STEPS.map((s, i) => (
            <div key={i} style={S.step}>
              <div style={S.stepN}>{s.n}</div>
              <div>
                <div style={S.stepTitle}>{s.title}</div>
                <div style={S.stepDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section style={S.section}>
        <div style={S.label}>Impact</div>
        <h2 style={S.title}>Better outcomes for everyone</h2>
        <div style={S.impactGrid}>
          {[
            { icon: "FAST", t: "Faster Hiring", d: "Reduce time-to-hire by pre-rank, AI-screened candidates." },
            { icon: "MATCH", t: "Accurate Matching", d: "Skill-based matching means fewer mis-hires and better team fit from day one." },
            { icon: "GROW", t: "Career Guidance", d: "Students and professionals get clear, data-driven roadmaps - not vague advice." },
          ].map((item, i) => (
            <div key={i} style={S.impactCard}>
              <div style={S.impactIcon}>{item.icon}</div>
              <h4 style={S.impactT}>{item.t}</h4>
              <p style={S.impactD}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA - Email + OAuth */}
      {/* <section style={S.cta}>
        <div style={S.ctaInner}>
          <h2 style={S.ctaTitle}>Ready to find your perfect match?</h2>
          <p style={S.ctaSub}>
            Join thousands of candidates and recruiters already using SJ_Map. Sign in or create an account.
          </p>

          {!oauthStep ? (
            <div style={S.emailRow}>
              <input
                style={S.emailInput}
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              />
              <button style={S.btnPrimary} onClick={handleEmailSubmit}>
                Continue ->
              </button>
            </div>
          ) : (
            <div style={S.oauthBox}>
              <div style={S.oauthEmail}>Signing in as <strong>{email}</strong></div>
              <div style={S.oauthBtns}>
                <button style={{ ...S.oauthBtn, borderColor: "#4285F4" }} onClick={() => handleOAuth("Google")}>G Continue with Google</button>
                <button style={{ ...S.oauthBtn, borderColor: "#5865F2" }} onClick={() => handleOAuth("GitHub")}>GH Continue with GitHub</button>
                <button style={{ ...S.oauthBtn, borderColor: "#0077B5" }} onClick={() => handleOAuth("LinkedIn")}>in Continue with LinkedIn</button>
              </div>
              <button style={S.backLink} onClick={() => setOauthStep(false)}><- Use a different email</button>
            </div>
          )}
        </div>
      </section> */}

      <footer style={S.footer}>
        Copyright 2026 SJ_Map - AI-Powered Recruitment - Privacy - Terms
      </footer>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh", overflowX: "hidden", position: "relative" },
  mesh1: { position: "fixed", top: "-200px", left: "50%", transform: "translateX(-50%)", width: "900px", height: "900px", background: "radial-gradient(circle, rgba(108,92,231,0.13) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 },
  mesh2: { position: "fixed", bottom: "-150px", right: "-100px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,206,201,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 },
  hero: { textAlign: "center", padding: "7rem 2rem 5rem", position: "relative", overflow: "hidden", zIndex: 1 },
  badge: { display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.3)", padding: "0.4rem 1.1rem", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 700, color: "#a29bfe", letterSpacing: "0.5px", marginBottom: "1.8rem", textTransform: "uppercase" },
  badgeDot: { width: "7px", height: "7px", borderRadius: "50%", background: "#00cec9", display: "inline-block", animation: "pulse 1.5s infinite" },
  h1: { fontSize: "clamp(2.4rem,6vw,4.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "1.4rem" },
  grad: { background: "linear-gradient(135deg,#a29bfe 20%,#00cec9 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { maxWidth: "560px", margin: "0 auto 2.8rem", color: "#8888aa", fontSize: "1.05rem", lineHeight: 1.75 },
  heroBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" },
  chip: { position: "absolute", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", padding: "0.45rem 1rem", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 600, color: "#a29bfe", animation: "float 3s ease-in-out infinite", backdropFilter: "blur(8px)" },
  section: { padding: "5rem 4rem", position: "relative", zIndex: 1 },
  label: { fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "0.8rem" },
  title: { fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "0.9rem" },
  sub: { color: "#8888aa", maxWidth: "500px", lineHeight: 1.75, marginBottom: "3rem", fontSize: "0.95rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "18px", padding: "2rem", position: "relative", overflow: "hidden" },
  cardIcon: { width: "50px", height: "50px", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", marginBottom: "1.2rem", fontWeight: 700, color: "#e0e0f0" },
  cardTitle: { fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" },
  cardDesc: { fontSize: "0.875rem", color: "#8888aa", lineHeight: 1.7 },
  cardAccent: { position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", opacity: 0.5 },
  steps: { display: "flex", flexDirection: "column", maxWidth: "640px" },
  step: { display: "flex", gap: "1.2rem", alignItems: "flex-start", padding: "1.5rem 0", borderBottom: "1px solid rgba(108,92,231,0.15)" },
  stepN: { fontFamily: "'DM Mono',monospace", fontSize: "0.8rem", fontWeight: 500, color: "#a29bfe", minWidth: "32px", paddingTop: "2px" },
  stepTitle: { fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" },
  stepDesc: { color: "#8888aa", fontSize: "0.85rem", lineHeight: 1.65 },
  impactGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.2rem", marginTop: "2.5rem" },
  impactCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", padding: "2rem", textAlign: "center" },
  impactIcon: { fontSize: "1.2rem", marginBottom: "0.8rem", fontWeight: 700, color: "#a29bfe" },
  impactT: { fontWeight: 700, marginBottom: "0.4rem" },
  impactD: { fontSize: "0.83rem", color: "#8888aa", lineHeight: 1.6 },
  cta: { padding: "6rem 2rem", background: "linear-gradient(135deg,rgba(108,92,231,0.1),rgba(0,206,201,0.06))", borderTop: "1px solid rgba(108,92,231,0.2)", zIndex: 1, position: "relative" },
  ctaInner: { maxWidth: "520px", margin: "0 auto", textAlign: "center" },
  ctaTitle: { fontSize: "clamp(1.9rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "1rem" },
  ctaSub: { color: "#8888aa", lineHeight: 1.75, marginBottom: "2.5rem" },
  emailRow: { display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" },
  emailInput: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(108,92,231,0.35)", color: "#e0e0f0", padding: "0.9rem 1.3rem", borderRadius: "10px", fontSize: "0.95rem", width: "270px", outline: "none", fontFamily: "'Space Grotesk',sans-serif" },
  oauthBox: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.25)", borderRadius: "16px", padding: "2rem", animation: "slideUp 0.3s ease" },
  oauthEmail: { fontSize: "0.85rem", color: "#8888aa", marginBottom: "1.5rem" },
  oauthBtns: { display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.2rem" },
  oauthBtn: { display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid", borderRadius: "10px", padding: "0.85rem 1.4rem", color: "#e0e0f0", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif", transition: "background 0.2s" },
  oauthLogo: { width: "24px", height: "24px", borderRadius: "6px", background: "#4285F4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "0.8rem", flexShrink: 0 },
  backLink: { background: "none", border: "none", color: "#8888aa", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'Space Grotesk',sans-serif" },
  footer: { textAlign: "center", padding: "2rem", color: "#555577", fontSize: "0.8rem", borderTop: "1px solid rgba(108,92,231,0.15)", zIndex: 1, position: "relative" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.9rem 2rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 4px 24px rgba(108,92,231,0.4)", fontFamily: "'Space Grotesk',sans-serif" },
  btnOutline: { background: "transparent", color: "#e0e0f0", padding: "0.9rem 2rem", borderRadius: "10px", border: "1px solid rgba(108,92,231,0.35)", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif" },
};
