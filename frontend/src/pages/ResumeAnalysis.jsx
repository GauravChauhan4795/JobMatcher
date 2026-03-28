import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

const matchColor = (m) => m >= 90 ? "#00cec9" : m >= 75 ? "#a29bfe" : "#fdcb6e";
const levelColor = { Expert: "#00cec9", Advanced: "#a29bfe", Intermediate: "#fdcb6e", Beginner: "#fd79a8" };

export default function ResumeAnalysis({ navProps, isLoggedIn, onNavigate }) {
  const [stage, setStage] = useState("upload");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
      setStage("jd");
    }
  };

  const startAnalysis = async () => {
    if (!file) {
      setStage("upload");
      return;
    }
    let bumpTimer;
    try {
      setError("");
      setStage("analysing");
      setProgress(30);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jd);

      bumpTimer = setTimeout(() => setProgress(60), 1500);

      const res = await API.post("/resume/upload-analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 45000,
      });

      clearTimeout(bumpTimer);
      setProgress(100);

      if (!res.data) {
        throw new Error("Invalid response");
      }

      setAnalysisResult(res.data);
      setError("");
      setStage("result");

    } catch (err) {
      if (bumpTimer) clearTimeout(bumpTimer);
      console.error("Analysis failed:", err);
      if (err?.code === "ECONNABORTED") {
        setError("Analysis is taking too long. Please try again or use a smaller PDF.");
      } else {
        setError(getApiError(err));
      }
      setProgress(0);
      setStage("jd");
    }
  };

  const STEPS_LABEL = ["Upload Resume", "Add Job Description", "AI Analysis", "Results"];
  const stageIdx = { upload: 0, jd: 1, analysing: 2, result: 3 };

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0a14; }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        button { font-family:'Space Grotesk',sans-serif; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0a14; }
        ::-webkit-scrollbar-thumb { background:#3a3a5c; border-radius:99px; }
      `}</style>
      <div style={S.mesh} />
      <Navbar {...navProps} activePage="Resume Analysis" />

      <div style={S.page}>
        <div style={S.header}>
          <div style={S.label}>⚡ AI-Powered</div>
          <h1 style={S.heading}>Resume Analyser</h1>
          <p style={S.sub}>Upload your resume and optionally paste a job description for a real-time skill match report.</p>
        </div>

        {/* STEPPER */}
        <div style={S.stepper}>
          {STEPS_LABEL.map((s, i) => (
            <div key={s} style={S.stepWrap}>
              <div style={{ ...S.stepCircle, background: i <= stageIdx[stage] ? "linear-gradient(135deg,#6c5ce7,#00cec9)" : "rgba(255,255,255,0.05)", border: i <= stageIdx[stage] ? "none" : "1px solid rgba(108,92,231,0.3)", color: i <= stageIdx[stage] ? "#fff" : "#8888aa" }}>
                {i < stageIdx[stage] ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: i <= stageIdx[stage] ? "#e0e0f0" : "#8888aa" }}>{s}</div>
              {i < 3 && <div style={{ ...S.stepLine, background: i < stageIdx[stage] ? "#6c5ce7" : "rgba(108,92,231,0.2)" }} />}
            </div>
          ))}
        </div>

        {/* UPLOAD STAGE */}
        {stage === "upload" && (
          <div style={S.card}>
            <div style={{ ...S.dropzone, borderColor: dragOver ? "#7c6ff7" : "rgba(108,92,231,0.3)", background: dragOver ? "rgba(108,92,231,0.08)" : "rgba(255,255,255,0.02)" }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e); }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.4rem" }}>Drop your resume here</div>
              <div style={{ color: "#8888aa", fontSize: "0.85rem", marginBottom: "1.5rem" }}>PDF only · Max 5MB</div>
              <label style={S.uploadBtn}>
                Choose File
                <input type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFile} />
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
              <span style={{ fontSize: "1.4rem" }}>✅</span>
              <div><div style={{ fontWeight: 700 }}>{fileName}</div><div style={{ fontSize: "0.78rem", color: "#8888aa" }}>Resume uploaded successfully</div></div>
              <button style={S.changeBtn} onClick={() => setStage("upload")}>Change</button>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem" }}>Job Description <span style={{ color: "#8888aa", fontWeight: 400 }}>(optional)</span></div>
              <textarea style={S.textarea} placeholder="Paste the job description for targeted analysis…" value={jd} onChange={e => setJd(e.target.value)} rows={5} />
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button style={S.btnPrimary} onClick={startAnalysis}>Analyse Now ⚡</button>
              <button style={S.btnOutline} onClick={startAnalysis}>Skip & Analyse Generally</button>
            </div>
            {error && <div style={S.error}>{error}</div>}
          </div>
        )}

        {/* ANALYSING STAGE */}
        {stage === "analysing" && (
          <div style={{ ...S.card, textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 2rem" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(108,92,231,0.2)", borderTop: "3px solid #6c5ce7", animation: "spin 1.2s linear infinite" }} />
              <div style={{ position: "absolute", inset: "12px", borderRadius: "50%", border: "2px solid rgba(0,206,201,0.2)", borderTop: "2px solid #00cec9", animation: "spin 0.8s linear infinite reverse" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🧠</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "2rem" }}>Analysing your resume…</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem", maxWidth: "320px", margin: "0 auto 2rem", textAlign: "left" }}>
              {["Parsing resume content", "Extracting skills & projects", "Cross-referencing job database", "Calculating match scores"].map((s, i) => (
                <div key={s} style={{ fontSize: "0.85rem", fontWeight: 600, color: progress > i * 25 ? "#00cec9" : "#8888aa", opacity: progress > i * 25 ? 1 : 0.3 }}>
                  {progress > (i + 1) * 25 ? "✓ " : "○ "}{s}
                </div>
              ))}
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", maxWidth: "400px", margin: "0 auto 0.5rem" }}>
              <div style={{ height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)", width: `${progress}%`, transition: "width 0.3s ease" }} />
            </div>
            <div style={{ color: "#a29bfe", fontWeight: 700 }}>{progress}%</div>
          </div>
        )}

        {/* RESULT STAGE */}
        {stage === "result" && analysisResult && (
          <div style={{ animation: "slideUp 0.4s ease" }}>
            <div style={S.resultGrid}>
              {/* SCORE */}
              <div style={S.scoreCard}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#a29bfe", marginBottom: "1rem" }}>Overall Score</div>
                <div style={{ fontSize: "5rem", fontWeight: 800, color: "#00cec9", lineHeight: 1 }}>{analysisResult.overallScore}<span style={{ fontSize: "1.5rem" }}>/100</span></div>
                <div style={{ color: "#8888aa", fontSize: "0.85rem", margin: "0.75rem 0 1rem" }}>Strong match for senior frontend roles</div>
                <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "99px" }}>
                  <div style={{ height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)", width: `${analysisResult.overallScore}%` }} />
                </div>
                <button style={{ ...S.btnPrimary, marginTop: "1.5rem", width: "100%" }} onClick={() => onNavigate("Jobs")}>View Matched Jobs →</button>
              </div>

              {/* SKILLS */}
              <div style={S.resultSection}>
                <div style={S.sectionT}>Skills Detected</div>
                {analysisResult.skills.map(sk => (
                  <div key={sk.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.9rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "160px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{sk.name}</span>
                      <span style={{ padding: "0.1rem 0.4rem", borderRadius: "99px", fontSize: "0.62rem", fontWeight: 700, background: (levelColor[sk.level] || "#a29bfe") + "22", color: levelColor[sk.level] || "#a29bfe", border: `1px solid ${(levelColor[sk.level] || "#a29bfe")}44` }}>{sk.level}</span>
                    </div>
                    <div style={{ flex: 1, height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "99px" }}>
                      <div style={{ height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#6c5ce7,#00cec9)", width: `${sk.score}%` }} />
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: levelColor[sk.level] || "#a29bfe", minWidth: "32px" }}>{sk.score}%</span>
                  </div>
                ))}
              </div>

              {/* TOP MATCHES */}
              <div style={S.resultSection}>
                <div style={S.sectionT}>Top Job Matches</div>
                {analysisResult.topMatches.map(job => (
                  <div key={job.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 0", borderBottom: "1px solid rgba(108,92,231,0.1)" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{job.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#8888aa" }}>{job.company} · {job.salary}</div>
                    </div>
                    <div style={{ padding: "0.3rem 0.8rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 800, background: matchColor(job.match) + "22", color: matchColor(job.match), border: `1px solid ${matchColor(job.match)}44`, flexShrink: 0 }}>{job.match}%</div>
                  </div>
                ))}
              </div>

              {/* STRENGTHS & GAPS */}
              <div style={S.resultSection}>
                <div style={S.sectionT}>Strengths</div>
                {analysisResult.strengths.map(s => <div key={s} style={{ fontSize: "0.87rem", color: "#c0c0d8", padding: "0.3rem 0", display: "flex", gap: "0.6rem" }}><span style={{ color: "#00cec9" }}>✓</span> {s}</div>)}
                <div style={{ ...S.sectionT, marginTop: "1.5rem" }}>Skill Gaps</div>
                {analysisResult.gaps.map(g => <div key={g} style={{ fontSize: "0.87rem", color: "#c0c0d8", padding: "0.3rem 0", display: "flex", gap: "0.6rem" }}><span style={{ color: "#fd79a8" }}>✗</span> {g}</div>)}
              </div>

              {/* RECOMMENDATIONS */}
              <div style={{ ...S.resultSection, gridColumn: "span 2" }}>
                <div style={S.sectionT}>AI Recommendations</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                  {analysisResult.recommendations.map((r, i) => (
                    <div key={i} style={{ background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", padding: "1.2rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{r.icon}</div>
                      <div style={{ fontSize: "0.82rem", color: "#c0c0d8", lineHeight: 1.6 }}>{r.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button style={{ ...S.btnOutline, marginRight: "1rem" }} onClick={() => { setStage("upload"); setAnalysisResult(null); setProgress(0); }}>Analyse Another Resume</button>
              <button style={S.btnPrimary} onClick={() => onNavigate("Jobs")}>Browse Matched Jobs →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  mesh: { position: "fixed", top: "-50px", right: "-50px", width: "700px", height: "700px", background: "radial-gradient(circle,rgba(108,92,231,0.1) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
  page: { maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1 },
  header: { textAlign: "center", marginBottom: "3rem" },
  label: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#00cec9", marginBottom: "0.8rem" },
  heading: { fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.8rem" },
  sub: { color: "#8888aa", fontSize: "1rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" },
  stepper: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "3rem", gap: "0" },
  stepWrap: { display: "flex", alignItems: "center", gap: "0.5rem" },
  stepCircle: { width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0, transition: "all 0.3s" },
  stepLine: { width: "60px", height: "2px", marginLeft: "0.5rem", transition: "background 0.3s" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "20px", padding: "2.5rem" },
  dropzone: { border: "2px dashed", borderRadius: "14px", padding: "4rem 2rem", textAlign: "center", transition: "all 0.25s", cursor: "pointer" },
  uploadBtn: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.75rem 2rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "inline-block" },
  guestNote: { marginTop: "1.5rem", background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "10px", padding: "0.9rem 1.2rem", fontSize: "0.85rem", color: "#8888aa", textAlign: "center" },
  fileConfirm: { display: "flex", alignItems: "center", gap: "1rem", background: "rgba(0,206,201,0.08)", border: "1px solid rgba(0,206,201,0.25)", borderRadius: "12px", padding: "1rem 1.3rem", marginBottom: "2rem" },
  changeBtn: { marginLeft: "auto", background: "none", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", padding: "0.3rem 0.8rem", borderRadius: "7px", cursor: "pointer", fontSize: "0.8rem" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(108,92,231,0.25)", color: "#e0e0f0", padding: "1rem", borderRadius: "12px", fontSize: "0.9rem", resize: "vertical", outline: "none", fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.65 },
  resultGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
  scoreCard: { background: "linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,206,201,0.08))", border: "1px solid rgba(108,92,231,0.3)", borderRadius: "20px", padding: "2.5rem", textAlign: "center" },
  resultSection: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "16px", padding: "1.8rem" },
  sectionT: { fontWeight: 700, fontSize: "0.82rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#a29bfe", marginBottom: "1.2rem" },
  btnPrimary: { background: "linear-gradient(135deg,#6c5ce7,#7c6ff7)", color: "#fff", padding: "0.9rem 2rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(108,92,231,0.35)" },
  btnOutline: { background: "transparent", color: "#e0e0f0", padding: "0.9rem 1.5rem", borderRadius: "10px", border: "1px solid rgba(108,92,231,0.3)", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Space Grotesk',sans-serif" },
  error: { marginTop: "1rem", background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.9rem", borderRadius: "8px", fontSize: "0.85rem" },
};






