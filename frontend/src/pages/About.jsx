import Navbar from "../components/layout/Navbar";

const TEAM = [
  { name: "Gaurav Chauhan", role: "Team Leader", emoji: "TL" },
  { name: "Ronit Kumar", role: "Team Frontend", emoji: "FE" },
  { name: "Heramb Singh", role: "Backend Head", emoji: "BE" },
  { name: "Saksham Sharma", role: "Head of AI/ML", emoji: "AI" },
];

const VALUES = [
  { icon: "SKILL", title: "Skills Over Keywords", desc: "We believe what you can do matters more than how you describe it. Our AI digs deeper." },
  { icon: "CLEAR", title: "Radical Transparency", desc: "Every match score comes with a full breakdown. No black boxes, no mystery algorithms." },
  { icon: "GROW", title: "Growth-First", desc: "We do not just match you to jobs today - we help you build the skills for where you want to be tomorrow." },
  { icon: "FAST", title: "Speed and Efficiency", desc: "Hiring is slow. We are obsessed with cutting every unnecessary step for both candidates and recruiters." },
];

export default function About({ navProps, onNavigate, isLoggedIn }) {
  const handleGetStarted = () => {
    if (isLoggedIn) {
      onNavigate("Dashboard");
    } else {
      onNavigate("Login");
    }
  };

  return (
    <div style={S.root}>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="About" />

      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroLabel}>Our Story</div>
        <h1 style={S.heroH1}>
          We are fixing <span style={S.grad}>broken hiring</span>,<br />one skill at a time.
        </h1>
        <p style={S.heroSub}>
          SJ_Map was born from frustration. Too many great engineers were rejected by ATS bots
          scanning for keywords. Too many companies wasted months filtering the wrong candidates.
          We built the platform we wished existed.
        </p>
        <div style={S.heroBtns}>
          <button style={S.btnPrimary} onClick={handleGetStarted}>Join SJ_Map</button>
          <button style={S.btnOutline} onClick={() => onNavigate("Jobs")}>Browse Jobs</button>
        </div>
      </section>

      {/* MISSION */}
      <section style={S.section}>
        <div style={S.missionGrid}>
          <div>
            <div style={S.label}>Mission</div>
            <h2 style={S.secTitle}>Connecting talent<br />to opportunity, fairly.</h2>
            <p style={S.secSub}>
              Every year, millions of qualified candidates are passed over because their resumes
              do not have the right buzzwords. Meanwhile, companies make expensive mis-hires from
              polished CVs that do not reflect real capability. SJ_Map eliminates both problems.
            </p>
            <p style={{ ...S.secSub, color: "#c0c0d8", lineHeight: 1.8 }}>
              Our AI analyzes skills, certifications, projects, and real experience - not surface-level
              keywords. We give candidates a fair shot and companies a better signal.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ ...S.section, background: "rgba(255,255,255,0.015)" }}>
        <div style={S.label}>Values</div>
        <h2 style={S.secTitle}>What we believe in</h2>
        <div style={S.valuesGrid}>
          {VALUES.map((v, i) => (
            <div key={i} style={S.valueCard}>
              <div style={S.valueIcon}>{v.icon}</div>
              <h3 style={S.valueTitle}>{v.title}</h3>
              <p style={S.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section style={{ ...S.section, background: "rgba(255,255,255,0.015)" }}>
        <div style={S.label}>Team</div>
        <h2 style={S.secTitle}>The people behind SJ_Map</h2>
        <div style={S.teamGrid}>
          {TEAM.map((t, i) => (
            <div key={i} style={S.teamCard}>
              <div style={S.teamEmoji}>{t.emoji}</div>
              <div style={S.teamName}>{t.name}</div>
              <div style={S.teamRole}>{t.role}</div>
              <div style={S.teamDesc}>{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={S.cta}>
        <h2 style={S.ctaTitle}>Ready to experience smarter hiring?</h2>
        <p style={S.ctaSub}>Join other professionals using SJ_Map to find their perfect match.</p>
        <button style={S.btnPrimary} onClick={handleGetStarted}>
          Get Started Free
        </button>
      </section>

      <footer style={S.footer}>Copyright 2026 SJ_Map - AI-Powered Recruitment - Privacy - Terms</footer>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh", overflowX: "hidden" },
  mesh: { position: "fixed", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "800px", background: "radial-gradient(circle,rgba(108,92,231,0.1) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  hero: { textAlign: "center", padding: "7rem 2rem 5rem", position: "relative", zIndex: 1 },
  heroLabel: { fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "1.2rem" },
  heroH1: { fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-1.2px", marginBottom: "1.4rem" },
  grad: { background: "linear-gradient(135deg,#a29bfe 20%,#fd79a8 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { maxWidth: "600px", margin: "0 auto 2.5rem", color: "#8888aa", fontSize: "1.05rem", lineHeight: 1.8 },
  heroBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" },
  section: { padding: "5rem 4rem", position: "relative", zIndex: 1 },
  label: { fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "0.8rem" },
  secTitle: { fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "1.2rem" },
  secSub: { color: "#8888aa", lineHeight: 1.8, fontSize: "0.95rem", maxWidth: "540px", marginBottom: "1rem" },
  missionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" },
  missionLeft: {},
  statsBlock: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", padding: "2rem", textAlign: "center" },
  statV: { fontSize: "2.2rem", fontWeight: 800, color: "#a29bfe", marginBottom: "0.3rem" },
  statL: { fontSize: "0.82rem", color: "#8888aa", fontWeight: 600 },
  valuesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem", marginTop: "2.5rem" },
  valueCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", padding: "2rem" },
  valueIcon: { fontSize: "1.1rem", marginBottom: "1rem", fontWeight: 700, color: "#a29bfe" },
  valueTitle: { fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" },
  valueDesc: { fontSize: "0.87rem", color: "#8888aa", lineHeight: 1.7 },
  timeline: { maxWidth: "640px", marginTop: "2.5rem" },
  tlItem: { display: "grid", gridTemplateColumns: "80px 20px 1fr", gap: "1rem", alignItems: "flex-start", paddingBottom: "2rem", position: "relative" },
  tlYear: { fontFamily: "'DM Mono',monospace", fontWeight: 700, color: "#a29bfe", fontSize: "0.88rem", paddingTop: "3px", textAlign: "right" },
  tlDot: { width: "12px", height: "12px", borderRadius: "50%", background: "linear-gradient(135deg,#6c5ce7,#00cec9)", marginTop: "4px", flexShrink: 0, boxShadow: "0 0 12px rgba(108,92,231,0.6)" },
  tlEvent: { color: "#c0c0d8", fontSize: "0.9rem", lineHeight: 1.7, paddingTop: "2px" },
  teamGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem", marginTop: "2.5rem" },
  teamCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "16px", padding: "2rem", textAlign: "center" },
  teamEmoji: { fontSize: "1.2rem", marginBottom: "1rem", fontWeight: 700, color: "#a29bfe" },
  teamName: { fontWeight: 800, fontSize: "1rem", marginBottom: "0.3rem" },
  teamRole: { color: "#a29bfe", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.75rem" },
  teamDesc: { color: "#8888aa", fontSize: "0.82rem", lineHeight: 1.65 },
  cta: { textAlign: "center", padding: "6rem 2rem", background: "linear-gradient(135deg,rgba(108,92,231,0.1),rgba(253,121,168,0.06))", borderTop: "1px solid rgba(108,92,231,0.2)", position: "relative", zIndex: 1 },
  ctaTitle: { fontSize: "clamp(1.9rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "1rem" },
  ctaSub: { color: "#8888aa", maxWidth: "420px", margin: "0 auto 2.5rem", lineHeight: 1.75 },
  footer: { textAlign: "center", padding: "2rem", color: "#555577", fontSize: "0.8rem", borderTop: "1px solid rgba(108,92,231,0.15)", zIndex: 1, position: "relative" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.9rem 2rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 24px rgba(108,92,231,0.4)" },
  btnOutline: { background: "transparent", color: "#e0e0f0", padding: "0.9rem 2rem", borderRadius: "10px", border: "1px solid rgba(108,92,231,0.35)", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif" },
};
