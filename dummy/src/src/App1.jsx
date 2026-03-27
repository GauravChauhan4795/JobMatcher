import { useState, useEffect, useRef } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import About from "./About";
// import Jobs from "./Jobs";
// import InstantAnalysis from "./InstantAnalysis";
// import Profile from "./Profile";
// import Login from "./Login";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<YourHomepage />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/jobs" element={<Jobs />} />
//         <Route path="/analysis" element={<InstantAnalysis />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

const NAV_LINKS = ["Home", "Jobs", "Instant Analysis", "About"];

const FEATURES = [
  { icon: "🧠", title: "AI Resume Analysis", desc: "Deep-parse resumes to extract skills, projects, certifications, and real experience — beyond surface keywords.", color: "#7c6ff7" },
  { icon: "🏆", title: "Skill-Based Ranking", desc: "Score and rank candidates based on weighted skill alignment to each job's requirements, not arbitrary filters.", color: "#00cec9" },
  { icon: "✨", title: "Personalized Matches", desc: "Curated job matches that evolve as you add skills and projects to your profile over time.", color: "#fd79a8" },
  { icon: "📊", title: "Recruiter Dashboard", desc: "Visual candidate insights, skill heat maps, and pipeline analytics for faster decisions.", color: "#fdcb6e" },
  { icon: "🔍", title: "Skill Gap Analysis", desc: "Identify missing skills for target roles and get learning path recommendations to bridge the gap.", color: "#7c6ff7" },
  { icon: "🗺️", title: "Career Path Mapping", desc: "AI-driven roadmaps showing exactly what skills to develop to land your dream role.", color: "#00cec9" },
];

const CANDIDATES = [
  { initials: "AK", name: "Arjun Kumar", exp: "4 yrs · IIT Delhi", skills: ["React", "TypeScript", "AWS"], match: 97, color: "#7c6ff7" },
  { initials: "PS", name: "Priya Sharma", exp: "3 yrs · NIT Trichy", skills: ["React", "GraphQL", "Redux"], match: 89, color: "#00cec9" },
  { initials: "RV", name: "Rahul Verma", exp: "2 yrs · BITS Pilani", skills: ["Next.js", "Tailwind", "React"], match: 81, color: "#fd79a8" },
];

const STEPS = [
  { n: "01", title: "Upload Resume", desc: "Our AI extracts and structures skills, certifications, and project outcomes automatically." },
  { n: "02", title: "AI Scores Profile", desc: "ML models assign confidence scores to each skill based on demonstrated evidence in your work." },
  { n: "03", title: "Smart Matching", desc: "The engine cross-references your profile against thousands of live job postings in real-time." },
  { n: "04", title: "Apply & Stand Out", desc: "Recruiters see your pre-analyzed skill match score — you get noticed before they even open your resume." },
];

export default function SJMap() {
  const [activeNav, setActiveNav] = useState("Home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setVisibleCards((prev) => [...new Set([...prev, idx])]);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={styles.root}>
      {/* BG MESH */}
      <div style={styles.meshBg} />
      <div style={styles.meshBg2} />

      {/* NAV */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        {/* LOGO */}
        <div style={styles.logo}>
          <span style={styles.logoSJ}>SJ</span>
          <span style={styles.logoUnderscore}>_</span>
          <span style={styles.logoMap}>Map</span>
        </div>

        {/* LINKS */}
        <div style={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => setActiveNav(link)}
              style={{
                ...styles.navLink,
                ...(activeNav === link ? styles.navLinkActive : {}),
              }}
            >
              {link}
              {activeNav === link && <span style={styles.navDot} />}
            </button>
          ))}
        </div>

        {/* RIGHT: Profile Circle + Login */}
        <div style={styles.navRight} ref={dropdownRef}>
          <button style={styles.loginBtn}>Login</button>

          {/* Profile Circle */}
          <div style={styles.profileWrap}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={styles.profileCircle}
              title="Your Profile"
            >
              <span style={styles.profileIcon}>👤</span>
              <span style={styles.profileRing} />
            </button>

            {profileOpen && (
              <div style={styles.profileDropdown}>
                <div style={styles.dropdownHeader}>
                  <div style={styles.dropdownAvatar}>AK</div>
                  <div>
                    <div style={styles.dropdownName}>Arjun Kumar</div>
                    <div style={styles.dropdownEmail}>arjun@email.com</div>
                  </div>
                </div>
                <div style={styles.dropdownDivider} />
                {["My Profile", "Saved Jobs", "Applications", "Settings"].map((item) => (
                  <button key={item} style={styles.dropdownItem}>{item}</button>
                ))}
                <div style={styles.dropdownDivider} />
                <button style={{ ...styles.dropdownItem, color: "#fd79a8" }}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>
          <span style={styles.badgeDot} />
          AI-Powered · HR Tech Platform
        </div>
        <h1 style={styles.heroH1}>
          Match Skills to Jobs,<br />
          <span style={styles.heroGrad}>Not Just Keywords</span>
        </h1>
        <p style={styles.heroSub}>
          An intelligent recruitment platform that connects candidates to opportunities based on real skills,
          certifications, projects, and experience.
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.btnPrimary}>Upload Your Resume →</button>
          <button style={styles.btnOutline}>Post a Job Opening</button>
        </div>
        </section>


      {/* FEATURES */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>Features</div>
        <h2 style={styles.sectionTitle}>Everything you need to hire smarter</h2>
        <p style={styles.sectionSub}>Five intelligent modules working together to eliminate guesswork from recruitment.</p>

        <div style={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              data-idx={i}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                ...styles.featureCard,
                opacity: visibleCards.includes(i) ? 1 : 0,
                transform: visibleCards.includes(i) ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
              }}
            >
              <div style={{ ...styles.featureIcon, background: f.color + "22", border: `1px solid ${f.color}44` }}>
                {f.icon}
              </div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
              <div style={{ ...styles.featureAccent, background: f.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ ...styles.section, background: "rgba(255,255,255,0.02)" }}>
        <div style={styles.howGrid}>
          <div style={styles.howLeft}>
            <div style={styles.sectionLabel}>Process</div>
            <h2 style={styles.sectionTitle}>How SJ_Map works</h2>
            <p style={styles.sectionSub}>From resume upload to perfect match in minutes.</p>
            <div style={styles.steps}>
              {STEPS.map((s, i) => (
                <div key={i} style={styles.step}>
                  <div style={styles.stepNum}>{s.n}</div>
                  <div>
                    <div style={styles.stepTitle}>{s.title}</div>
                    <div style={styles.stepDesc}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div style={styles.dashboard}>
            <div style={styles.dashHeader}>
              <span style={styles.dashTitle}>🗂 Top Candidates — "Senior React Dev"</span>
              <div style={styles.dashTabs}>
                {["All", "Shortlisted"].map((t, i) => (
                  <span key={t} style={{ ...styles.dashTab, ...(i === 0 ? styles.dashTabActive : {}) }}>{t}</span>
                ))}
              </div>
            </div>
            {CANDIDATES.map((c, i) => (
              <div key={i} style={styles.candidateRow}>
                <div style={{ ...styles.avatar, background: c.color + "33", color: c.color }}>{c.initials}</div>
                <div style={styles.candidateInfo}>
                  <div style={styles.candidateName}>{c.name}</div>
                  <div style={styles.candidateExp}>{c.exp}</div>
                  <div style={styles.skillTags}>
                    {c.skills.map((s) => (
                      <span key={s} style={styles.skillTag}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={styles.matchScore}>
                  <div style={{ ...styles.matchPct, color: c.color }}>{c.match}%</div>
                  <div style={styles.matchLabel}>Match</div>
                  <div style={styles.barWrap}>
                    <div style={{ ...styles.barFill, width: `${c.match}%`, background: c.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>Impact</div>
        <h2 style={styles.sectionTitle}>Better outcomes for everyone</h2>
        <div style={styles.impactGrid}>
          {[
            { icon: "⚡", title: "Faster Hiring", desc: "Reduce time-to-hire by up to 60% with pre-ranked, AI-screened candidates." },
            { icon: "🎯", title: "Accurate Matching", desc: "Skill-based matching means fewer mis-hires and better team fit from day one." },
            { icon: "🌱", title: "Career Guidance", desc: "Students and professionals get clear, data-driven roadmaps." },
          ].map((item, i) => (
            <div key={i} style={styles.impactCard}>
              <div style={styles.impactIcon}>{item.icon}</div>
              <h4 style={styles.impactTitle}>{item.title}</h4>
              <p style={styles.impactDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to find your perfect match?</h2>
        <p style={styles.ctaSub}>Join thousands of candidates and recruiters using SJ_Map to transform hiring.</p>
        <div style={styles.ctaRow}>
          <input style={styles.ctaInput} type="email" placeholder="Enter your email" />
          <button style={styles.btnPrimary}>Get Access →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        © 2026 <strong>SJ_Map</strong> · Built for smarter hiring · Privacy · Terms
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0a14; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .profile-circle-btn:hover .profile-ring-inner { opacity:1 !important; transform:scale(1.15) !important; }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'Space Grotesk', sans-serif",
    background: "#0a0a14",
    color: "#e0e0f0",
    minHeight: "100vh",
    overflowX: "hidden",
    position: "relative",
  },
  meshBg: {
    position: "fixed", top: "-200px", left: "50%", transform: "translateX(-50%)",
    width: "900px", height: "900px",
    background: "radial-gradient(circle, rgba(108,92,231,0.12) 0%, transparent 65%)",
    pointerEvents: "none", zIndex: 0,
  },
  meshBg2: {
    position: "fixed", bottom: "-200px", right: "-100px",
    width: "600px", height: "600px",
    background: "radial-gradient(circle, rgba(0,206,201,0.08) 0%, transparent 65%)",
    pointerEvents: "none", zIndex: 0,
  },

  // NAV
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 3.5rem",
    borderBottom: "1px solid rgba(108,92,231,0.2)",
    background: "rgba(10,10,20,0.7)",
    backdropFilter: "blur(16px)",
    position: "sticky", top: 0, zIndex: 200,
    transition: "box-shadow 0.3s",
  },
  navScrolled: {
    boxShadow: "0 4px 40px rgba(108,92,231,0.15)",
  },
  logo: {
    fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-1px", cursor: "default",
    fontFamily: "'DM Mono', monospace",
  },
  logoSJ: { color: "#a29bfe" },
  logoUnderscore: { color: "#00cec9" },
  logoMap: { color: "#e0e0f0" },

  navLinks: { display: "flex", gap: "0.25rem", alignItems: "center" },
  navLink: {
    background: "none", border: "none", color: "#8888aa",
    fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
    padding: "0.5rem 1rem", borderRadius: "8px",
    transition: "color 0.2s, background 0.2s",
    position: "relative", fontFamily: "'Space Grotesk', sans-serif",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
  },
  navLinkActive: { color: "#e0e0f0", background: "rgba(108,92,231,0.12)" },
  navDot: {
    width: "4px", height: "4px", borderRadius: "50%",
    background: "#a29bfe", display: "block",
  },

  navRight: { display: "flex", alignItems: "center", gap: "0.75rem", position: "relative" },
  loginBtn: {
    background: "rgba(108,92,231,0.15)",
    border: "1px solid rgba(108,92,231,0.35)",
    color: "#a29bfe", padding: "0.5rem 1.2rem", borderRadius: "8px",
    cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
    fontFamily: "'Space Grotesk', sans-serif", transition: "background 0.2s",
  },

  profileWrap: { position: "relative" },
  profileCircle: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #7c6ff7, #00cec9)",
    border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", transition: "transform 0.25s, box-shadow 0.25s",
    boxShadow: "0 0 0 2px rgba(124,111,247,0.3)",
    fontSize: "1rem",
    outline: "none",
  },
  profileIcon: { fontSize: "1rem", lineHeight: 1 },
  profileRing: {},

  profileDropdown: {
    position: "absolute", top: "calc(100% + 10px)", right: 0,
    background: "#13131f",
    border: "1px solid rgba(108,92,231,0.3)",
    borderRadius: "14px", padding: "0.75rem",
    minWidth: "210px", zIndex: 999,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    animation: "fadeIn 0.15s ease",
  },
  dropdownHeader: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem" },
  dropdownAvatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, #7c6ff7, #00cec9)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: "0.8rem", color: "#fff", flexShrink: 0,
  },
  dropdownName: { fontWeight: 700, fontSize: "0.9rem" },
  dropdownEmail: { fontSize: "0.75rem", color: "#8888aa" },
  dropdownDivider: { height: "1px", background: "rgba(108,92,231,0.2)", margin: "0.5rem 0" },
  dropdownItem: {
    display: "block", width: "100%", textAlign: "left",
    background: "none", border: "none", color: "#c0c0d8",
    padding: "0.55rem 0.75rem", borderRadius: "8px",
    fontSize: "0.85rem", cursor: "pointer", fontWeight: 500,
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "background 0.15s, color 0.15s",
  },

  // HERO
  hero: {
    textAlign: "center", padding: "7rem 2rem 5rem",
    position: "relative", overflow: "hidden", zIndex: 1,
  },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.3)",
    padding: "0.4rem 1.1rem", borderRadius: "99px",
    fontSize: "0.78rem", fontWeight: 700, color: "#a29bfe",
    letterSpacing: "0.5px", marginBottom: "1.8rem",
    textTransform: "uppercase",
  },
  badgeDot: {
    width: "7px", height: "7px", borderRadius: "50%", background: "#00cec9",
    display: "inline-block", animation: "pulse 1.5s infinite",
  },
  heroH1: {
    fontSize: "clamp(2.4rem, 6vw, 4.2rem)", fontWeight: 800, lineHeight: 1.1,
    letterSpacing: "-1.5px", marginBottom: "1.4rem",
  },
  heroGrad: {
    background: "linear-gradient(135deg, #a29bfe 20%, #00cec9 80%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    maxWidth: "560px", margin: "0 auto 2.8rem",
    color: "#8888aa", fontSize: "1.05rem", lineHeight: 1.75,
  },
  heroBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" },
  btnPrimary: {
    background: "linear-gradient(135deg, #6c5ce7, #7c6ff7)",
    color: "#fff", padding: "0.9rem 2.2rem", borderRadius: "10px",
    border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1rem",
    boxShadow: "0 4px 28px rgba(108,92,231,0.45)",
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  btnOutline: {
    background: "transparent", color: "#e0e0f0",
    padding: "0.9rem 2.2rem", borderRadius: "10px",
    border: "1px solid rgba(108,92,231,0.35)", cursor: "pointer",
    fontWeight: 600, fontSize: "1rem",
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "border-color 0.2s",
  },
  

  // SECTION
  section: { padding: "5.5rem 4rem", position: "relative", zIndex: 1 },
  sectionLabel: {
    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px",
    textTransform: "uppercase", color: "#00cec9", marginBottom: "0.8rem",
  },
  sectionTitle: {
    fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800,
    letterSpacing: "-0.8px", marginBottom: "0.9rem",
  },
  sectionSub: { color: "#8888aa", maxWidth: "500px", lineHeight: 1.75, marginBottom: "3rem", fontSize: "0.95rem" },

  // FEATURES
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.25rem",
  },
  featureCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(108,92,231,0.2)",
    borderRadius: "18px", padding: "2rem",
    position: "relative", overflow: "hidden",
    cursor: "default",
  },
  featureIcon: {
    width: "50px", height: "50px", borderRadius: "13px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.5rem", marginBottom: "1.2rem",
  },
  featureTitle: { fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" },
  featureDesc: { fontSize: "0.875rem", color: "#8888aa", lineHeight: 1.7 },
  featureAccent: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: "2px",
    opacity: 0.5,
  },

  // HOW IT WORKS
  howGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start",
  },
  howLeft: {},
  steps: { display: "flex", flexDirection: "column", gap: "0" },
  step: {
    display: "flex", gap: "1.2rem", alignItems: "flex-start",
    padding: "1.5rem 0", borderBottom: "1px solid rgba(108,92,231,0.15)",
  },
  stepNum: {
    fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", fontWeight: 500,
    color: "#a29bfe", minWidth: "32px", paddingTop: "2px",
  },
  stepTitle: { fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" },
  stepDesc: { color: "#8888aa", fontSize: "0.85rem", lineHeight: 1.65 },

  // DASHBOARD
  dashboard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(108,92,231,0.22)",
    borderRadius: "20px", padding: "1.8rem",
  },
  dashHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "1.3rem", flexWrap: "wrap", gap: "0.75rem",
  },
  dashTitle: { fontSize: "0.85rem", fontWeight: 700, color: "#e0e0f0" },
  dashTabs: { display: "flex", gap: "0.4rem" },
  dashTab: {
    padding: "0.3rem 0.8rem", borderRadius: "6px",
    fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
    border: "1px solid rgba(108,92,231,0.25)", color: "#8888aa",
  },
  dashTabActive: { background: "#6c5ce7", color: "#fff", border: "1px solid #6c5ce7" },

  candidateRow: {
    display: "flex", alignItems: "center", gap: "1rem",
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(108,92,231,0.15)",
    borderRadius: "12px", padding: "1rem 1.2rem", marginBottom: "0.7rem",
  },
  avatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
  },
  candidateInfo: { flex: 1 },
  candidateName: { fontWeight: 700, fontSize: "0.9rem", marginBottom: "1px" },
  candidateExp: { fontSize: "0.75rem", color: "#8888aa", marginBottom: "5px" },
  skillTags: { display: "flex", gap: "0.35rem", flexWrap: "wrap" },
  skillTag: {
    background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)",
    padding: "0.12rem 0.5rem", borderRadius: "99px",
    fontSize: "0.68rem", fontWeight: 700, color: "#a29bfe",
  },
  matchScore: { textAlign: "right", flexShrink: 0 },
  matchPct: { fontSize: "1.25rem", fontWeight: 800 },
  matchLabel: { fontSize: "0.68rem", color: "#8888aa" },
  barWrap: { width: "72px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", marginTop: "4px" },
  barFill: { height: "100%", borderRadius: "99px", transition: "width 1s ease" },

  // IMPACT
  impactGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.2rem", marginTop: "2.5rem",
  },
  impactCard: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)",
    borderRadius: "16px", padding: "2rem", textAlign: "center",
  },
  impactIcon: { fontSize: "2rem", marginBottom: "0.8rem" },
  impactTitle: { fontWeight: 700, marginBottom: "0.45rem" },
  impactDesc: { fontSize: "0.83rem", color: "#8888aa", lineHeight: 1.6 },

  // CTA
  ctaSection: {
    textAlign: "center", padding: "6rem 2rem",
    background: "linear-gradient(135deg, rgba(108,92,231,0.12), rgba(0,206,201,0.06))",
    borderTop: "1px solid rgba(108,92,231,0.2)", zIndex: 1, position: "relative",
  },
  ctaTitle: { fontSize: "clamp(1.9rem, 4vw, 2.9rem)", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "1rem" },
  ctaSub: { color: "#8888aa", maxWidth: "460px", margin: "0 auto 2.5rem", lineHeight: 1.7 },
  ctaRow: { display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" },
  ctaInput: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.3)",
    color: "#e0e0f0", padding: "0.9rem 1.3rem", borderRadius: "10px",
    fontSize: "0.95rem", width: "270px", outline: "none",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  footer: {
    textAlign: "center", padding: "2rem",
    color: "#555577", fontSize: "0.8rem",
    borderTop: "1px solid rgba(108,92,231,0.15)",
    zIndex: 1, position: "relative",
  },
};
