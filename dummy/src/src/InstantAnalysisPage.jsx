// InstantAnalysisPage.jsx
import { useState } from "react";
import Navbar from "./Navbar";

const SAMPLE_RESULT = {
  overallScore: 87,
  skills: [
    { name: "React", score: 95, level: "Expert" },
    { name: "TypeScript", score: 88, level: "Advanced" },
    { name: "Node.js", score: 82, level: "Advanced" },
    { name: "AWS", score: 74, level: "Intermediate" },
    { name: "GraphQL", score: 70, level: "Intermediate" },
    { name: "Docker", score: 58, level: "Beginner" },
  ],
  topMatches: [
    { title: "Senior React Developer", company: "Razorpay", match: 97, salary: "₹28–40 LPA" },
    { title: "Frontend Engineer", company: "Zepto", match: 91, salary: "₹20–30 LPA" },
    { title: "Full Stack Developer", company: "CRED", match: 87, salary: "₹22–35 LPA" },
  ],
  gaps: ["Docker / Containerisation", "System Design experience", "CI/CD pipeline knowledge"],
  strengths: ["Modern React ecosystem", "TypeScript proficiency", "Cloud (AWS) basics", "RESTful API design"],
  recommendations: [
    { icon: "📚", text: "Complete AWS Solutions Architect course to boost cloud score" },
    { icon: "🐳", text: "Add a Docker project to demonstrate containerisation skills" },
    { icon: "🏗️", text: "Publish a system design case study to your portfolio" },
  ],
};

const matchColor = (m) => m >= 90 ? "#00cec9" : m >= 75 ? "#a29bfe" : "#fdcb6e";
const levelColor = { Expert: "#00cec9", Advanced: "#a29bfe", Intermediate: "#fdcb6e", Beginner: "#fd79a8" };

export default function InstantAnalysisPage({ navProps, isLoggedIn, onNavigate }) {
  const [stage, setStage] = useState("upload"); // upload | jd | analysing | result
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [jd, setJd] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFile = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) { setFileName(file.name); setStage("jd"); }
  };

  const startAnalysis = () => {
    setStage("analysing");
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(() => setStage("result"), 400); }
      setProgress(Math.round(p));
    }, 280);
  };

  const STEPS_LABEL = ["Upload Resume", "Add Job Description", "AI Analysis", "Results"];
  const stageIdx = { upload: 0, jd: 1, analysing: 2, result: 3 };

  return (
    <div style={S.root}>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Instant Analysis" />

      <div style={S.page}>
        {/* HEADER */}
        <div style={S.header}>
          <div style={S.label}>⚡ Instant Analysis</div>
          <h1 style={S.heading}>AI Resume Analyser</h1>
          <p style={S.sub}>Upload your resume and optionally paste a job description for a real-time skill match report.</p>
        </div>

        {/* STEPPER */}
        <div style={S.stepper}>
          {STEPS_LABEL.map((s, i) => (
            <div key={s} style={S.stepWrap}>
              <div style={{
                ...S.stepCircle,
                background: i <= stageIdx[stage] ? "linear-gradient(135deg,#6c5ce7,#00cec9)" : "rgba(255,255,255,0.05)",
                border: i <= stageIdx[stage] ? "none" : "1px solid rgba(108,92,231,0.3)",
                color: i <= stageIdx[stage] ? "#fff" : "#8888aa",
              }}>
                {i < stageIdx[stage] ? "✓" : i + 1}
              </div>
              <div style={{ ...S.stepLabel, color: i <= stageIdx[stage] ? "#e0e0f0" : "#8888aa" }}>{s}</div>
              {i < 3 && <div style={{ ...S.stepLine, background: i < stageIdx[stage] ? "#6c5ce7" : "rgba(108,92,231,0.2)" }} />}
            </div>
          ))}
        </div>

        {/* UPLOAD STAGE */}
        {stage === "upload" && (
          <div style={S.card}>
            <div
              style={{ ...S.dropzone, borderColor: dragOver ? "#7c6ff7" : "rgba(108,92,231,0.3)", background: dragOver ? "rgba(108,92,231,0.08)" : "rgba(255,255,255,0.02)" }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e); }}
            >
              <div style={S.dropIcon}>📄</div>
              <div style={S.dropTitle}>Drop your resume here</div>
              <div style={S.dropSub}>PDF, DOCX, or TXT · Max 5MB</div>
              <label style={S.uploadBtn}>
                Choose File
                <input type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }} onChange={handleFile} />
              </label>
            </div>
            {!isLoggedIn && (
              <div style={S.guestNote}>
                💡 <span style={{ color: "#a29bfe", fontWeight: 600, cursor: "pointer" }} onClick={() => onNavigate("Login")}>Log in</span> to save your analysis and track skill growth over time.
              </div>
            )}
          </div>
        )}

        {/* JD STAGE */}
        {stage === "jd" && (
          <div style={S.card}>
            <div style={S.fileConfirm}>
              <span style={S.fileIcon}>✅</span>
              <div>
                <div style={{ fontWeight: 700 }}>{fileName}</div>
                <div style={{ fontSize: "0.78rem", color: "#8888aa" }}>Resume uploaded successfully</div>
              </div>
              <button style={S.changeFile} onClick={() => setStage("upload")}>Change</button>
            </div>
            <div style={S.jdSection}>
              <div style={S.jdLabel}>Paste a Job Description <span style={{ color: "#8888aa", fontWeight: 400 }}>(optional)</span></div>
              <textarea
                style={S.textarea}
                placeholder="Paste the job description here for a targeted skill match analysis…"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={6}
              />
            </div>
            <div style={S.jdActions}>
              <button style={S.btnPrimary} onClick={startAnalysis}>Analyse Now ⚡</button>
              <button style={S.btnOutline} onClick={startAnalysis}>Skip & Analyse Generally</button>
            </div>
          </div>
        )}

        {/* ANALYSING STAGE */}
        {stage === "analysing" && (
          <div style={{ ...S.card, textAlign: "center", padding: "4rem" }}>
            <div style={S.analysisAnim}>
              <div style={S.outerRing} />
              <div style={S.innerRing} />
              <div style={S.analysisEmoji}>🧠</div>
            </div>
            <div style={S.analysisTitle}>Analysing your resume…</div>
            <div style={S.analysisSteps}>
              {["Parsing resume content", "Extracting skills & projects", "Cross-referencing job database", "Calculating match scores"].map((s, i) => (
                <div key={s} style={{ ...S.analysisStep, opacity: progress > i * 25 ? 1 : 0.3, color: progress > i * 25 ? "#00cec9" : "#8888aa" }}>
                  {progress > (i + 1) * 25 ? "✓ " : "○ "}{s}
                </div>
              ))}
            </div>
            <div style={S.progressTrack}>
              <div style={{ ...S.progressFill, width: `${progress}%` }} />
            </div>
            <div style={{ color: "#a29bfe", fontWeight: 700, marginTop: "0.5rem" }}>{progress}%</div>
          </div>
        )}

        {/* RESULT STAGE */}
        {stage === "result" && (
          <div style={S.resultGrid}>
            {/* SCORE CARD */}
            <div style={S.scoreCard}>
              <div style={S.scoreLabel}>Overall Profile Score</div>
              <div style={S.scoreBig}>{SAMPLE_RESULT.overallScore}<span style={{ fontSize: "1.5rem" }}>/100</span></div>
              <div style={S.scoreSub}>Strong match for senior frontend roles</div>
              <div style={S.scoreBar}>
                <div style={{ ...S.scoreBarFill, width: `${SAMPLE_RESULT.overallScore}%` }} />
              </div>
              <button style={{ ...S.btnPrimary, marginTop: "1.5rem", width: "100%" }} onClick={() => onNavigate("Jobs")}>
                View Matched Jobs →
              </button>
            </div>

            {/* SKILLS */}
            <div style={S.resultSection}>
              <div style={S.sectionT}>Skills Detected</div>
              {SAMPLE_RESULT.skills.map((sk) => (
                <div key={sk.name} style={S.skillRow}>
                  <div style={S.skillLeft}>
                    <span style={S.skillName}>{sk.name}</span>
                    <span style={{ ...S.levelBadge, background: levelColor[sk.level] + "22", color: levelColor[sk.level], border: `1px solid ${levelColor[sk.level]}44` }}>
                      {sk.level}
                    </span>
                  </div>
                  <div style={S.skillBar}><div style={{ ...S.skillFill, width: `${sk.score}%` }} /></div>
                  <span style={{ ...S.skillPct, color: levelColor[sk.level] }}>{sk.score}%</span>
                </div>
              ))}
            </div>

            {/* TOP MATCHES */}
            <div style={S.resultSection}>
              <div style={S.sectionT}>Top Job Matches</div>
              {SAMPLE_RESULT.topMatches.map((job) => (
                <div key={job.title} style={S.matchCard}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{job.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#8888aa" }}>{job.company} · {job.salary}</div>
                  </div>
                  <div style={{ ...S.matchPill, background: matchColor(job.match) + "22", color: matchColor(job.match), border: `1px solid ${matchColor(job.match)}44` }}>
                    {job.match}%
                  </div>
                </div>
              ))}
            </div>

            {/* STRENGTHS & GAPS */}
            <div style={S.resultSection}>
              <div style={S.sectionT}>Strengths</div>
              {SAMPLE_RESULT.strengths.map((s) => (
                <div key={s} style={S.strengthItem}><span style={{ color: "#00cec9" }}>✓</span> {s}</div>
              ))}
              <div style={{ ...S.sectionT, marginTop: "1.5rem" }}>Skill Gaps</div>
              {SAMPLE_RESULT.gaps.map((g) => (
                <div key={g} style={S.strengthItem}><span style={{ color: "#fd79a8" }}>✗</span> {g}</div>
              ))}
            </div>

            {/* RECOMMENDATIONS */}
            <div style={{ ...S.resultSection, gridColumn: "span 2" }}>
              <div style={S.sectionT}>AI Recommendations</div>
              <div style={S.recGrid}>
                {SAMPLE_RESULT.recommendations.map((r, i) => (
                  <div key={i} style={S.recCard}>
                    <div style={S.recIcon}>{r.icon}</div>
                    <div style={S.recText}>{r.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    <footer style={S.footer}>
        © 2026 <strong>SJ_Map</strong> · AI-Powered Recruitment · Privacy · Terms
      </footer>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh", display: "flex", flexDirection: "column" },
  mesh: { position: "fixed", top: "-50px", right: "-50px", width: "700px", height: "700px", background: "radial-gradient(circle,rgba(108,92,231,0.1) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  page: { maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1, flex: 1 },
  header: { textAlign: "center", marginBottom: "3rem" },
  label: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "0.8rem" },
  heading: { fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.8rem" },
  sub: { color: "#8888aa", fontSize: "1rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" },
  stepper: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "3rem", gap: "0" },
  stepWrap: { display: "flex", alignItems: "center", gap: "0.5rem" },
  stepCircle: { width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0, transition: "all 0.3s" },
  stepLabel: { fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap", transition: "color 0.3s" },
  stepLine: { width: "60px", height: "2px", marginLeft: "0.5rem", transition: "background 0.3s" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "20px", padding: "2.5rem", animation: "slideUp 0.4s ease" },
  dropzone: { border: "2px dashed", borderRadius: "14px", padding: "4rem 2rem", textAlign: "center", transition: "all 0.25s", cursor: "pointer" },
  dropIcon: { fontSize: "3rem", marginBottom: "1rem" },
  dropTitle: { fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.4rem" },
  dropSub: { color: "#8888aa", fontSize: "0.85rem", marginBottom: "1.5rem" },
  uploadBtn: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.75rem 2rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "inline-block", fontFamily: "'Space Grotesk',sans-serif" },
  guestNote: { marginTop: "1.5rem", background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "10px", padding: "0.9rem 1.2rem", fontSize: "0.85rem", color: "#8888aa", textAlign: "center" },
  fileConfirm: { display: "flex", alignItems: "center", gap: "1rem", background: "rgba(0,206,201,0.08)", border: "1px solid rgba(0,206,201,0.25)", borderRadius: "12px", padding: "1rem 1.3rem", marginBottom: "2rem" },
  fileIcon: { fontSize: "1.4rem" },
  changeFile: { marginLeft: "auto", background: "none", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", padding: "0.3rem 0.8rem", borderRadius: "7px", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'Space Grotesk',sans-serif" },
  jdSection: { marginBottom: "1.5rem" },
  jdLabel: { fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", color: "#e0e0f0", padding: "1rem", borderRadius: "12px", fontSize: "0.9rem", resize: "vertical", outline: "none", fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.65 },
  jdActions: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  analysisAnim: { position: "relative", width: "100px", height: "100px", margin: "0 auto 2rem" },
  outerRing: { position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(108,92,231,0.2)", borderTop: "3px solid #6c5ce7", animation: "spin 1.2s linear infinite" },
  innerRing: { position: "absolute", inset: "12px", borderRadius: "50%", border: "2px solid rgba(0,206,201,0.2)", borderTop: "2px solid #00cec9", animation: "spin 0.8s linear infinite reverse" },
  analysisEmoji: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" },
  analysisTitle: { fontWeight: 800, fontSize: "1.3rem", marginBottom: "2rem" },
  analysisSteps: { display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem", textAlign: "left", maxWidth: "320px", margin: "0 auto 2rem" },
  analysisStep: { fontSize: "0.85rem", fontWeight: 600, transition: "all 0.3s" },
  progressTrack: { height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", maxWidth: "400px", margin: "0 auto 0.5rem" },
  progressFill: { height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)", transition: "width 0.3s ease" },
  resultGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", animation: "slideUp 0.4s ease" },
  scoreCard: { background: "linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,206,201,0.08))", border: "1px solid rgba(108,92,231,0.3)", borderRadius: "20px", padding: "2.5rem", textAlign: "center" },
  scoreLabel: { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#a29bfe", marginBottom: "1rem" },
  scoreBig: { fontSize: "5rem", fontWeight: 800, color: "#00cec9", lineHeight: 1 },
  scoreSub: { color: "#8888aa", fontSize: "0.85rem", margin: "0.75rem 0 1rem" },
  scoreBar: { height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "99px" },
  scoreBarFill: { height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)" },
  resultSection: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "16px", padding: "1.8rem" },
  sectionT: { fontWeight: 700, fontSize: "0.82rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#a29bfe", marginBottom: "1.2rem" },
  skillRow: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.9rem" },
  skillLeft: { display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "150px" },
  skillName: { fontWeight: 600, fontSize: "0.85rem" },
  levelBadge: { padding: "0.1rem 0.45rem", borderRadius: "99px", fontSize: "0.65rem", fontWeight: 700 },
  skillBar: { flex: 1, height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "99px" },
  skillFill: { height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)" },
  skillPct: { fontSize: "0.78rem", fontWeight: 700, minWidth: "32px", textAlign: "right" },
  matchCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 0", borderBottom: "1px solid rgba(108,92,231,0.1)" },
  matchPill: { padding: "0.3rem 0.8rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 800, flexShrink: 0 },
  strengthItem: { fontSize: "0.87rem", color: "#c0c0d8", padding: "0.35rem 0", display: "flex", gap: "0.6rem", alignItems: "center" },
  footer: { textAlign: "center", padding: "2rem", color: "#555577", fontSize: "0.8rem", borderTop: "1px solid rgba(108,92,231,0.15)", zIndex: 1, position: "relative" },
  recGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" },
  recCard: { background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", padding: "1.2rem", textAlign: "center" },
  recIcon: { fontSize: "1.8rem", marginBottom: "0.75rem" },
  recText: { fontSize: "0.82rem", color: "#c0c0d8", lineHeight: 1.6 },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.9rem 2rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(108,92,231,0.35)" },
  btnOutline: { background: "transparent", color: "#e0e0f0", padding: "0.9rem 1.5rem", borderRadius: "10px", border: "1px solid rgba(108,92,231,0.3)", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Space Grotesk',sans-serif" },
};
