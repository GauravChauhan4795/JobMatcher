const { generateContent, extractJsonFromText } = require("./geminiClient");
const { extractSkillsByKeywords } = require("./skillExtractor");
const { calculateMatchScore } = require("./matchJobs");

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const clamp = (value, min, max) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.max(min, Math.min(max, num));
};

const titleCase = (text) =>
  String(text || "")
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ")
    .trim();

const uniqueSkills = (skills) => {
  const seen = new Set();
  const result = [];
  (skills || []).forEach((s) => {
    const name = String(s || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(name);
  });
  return result;
};

const normalizeSkillObjects = (skills) => {
  const normalized = [];
  (skills || []).forEach((skill) => {
    if (!skill) return;
    const name = titleCase(skill.name || skill.skill || skill.title || skill);
    if (!name) return;
    const level = LEVELS.includes(skill.level) ? skill.level : "Intermediate";
    const score = clamp(skill.score ?? 70, 0, 100);
    normalized.push({ name, level, score });
  });
  const deduped = [];
  const seen = new Set();
  for (const s of normalized) {
    const key = s.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(s);
  }
  return deduped;
};

const buildFallback = (resumeText, jobText) => {
  const resumeSkills = uniqueSkills(extractSkillsByKeywords(resumeText));
  const jobSkills = jobText ? uniqueSkills(extractSkillsByKeywords(jobText)) : [];

  const overallScore = jobSkills.length
    ? calculateMatchScore(resumeSkills, jobSkills)
    : Math.min(90, 50 + resumeSkills.length * 4);

  const skills = resumeSkills.map((name, i) => ({
    name: titleCase(name),
    level: i < 2 ? "Advanced" : i < 5 ? "Intermediate" : "Beginner",
    score: clamp(85 - i * 5, 40, 85),
  }));

  const gaps = jobSkills
    .filter((s) => !resumeSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase()))
    .map(titleCase);

  const strengths = skills.slice(0, 5).map((s) => s.name);

  const recommendations = (gaps.length ? gaps : resumeSkills.slice(0, 3))
    .slice(0, 3)
    .map((skill) => ({
      icon: "TIP",
      text: `Strengthen ${titleCase(skill)} with a focused online course and a small project.`,
    }));

  return {
    overallScore: clamp(overallScore, 0, 100),
    skills,
    strengths,
    gaps,
    recommendations,
  };
};

const buildPrompt = (resumeText, jobText) => {
  const trimmedResume = resumeText.slice(0, 12000);
  const trimmedJob = jobText ? jobText.slice(0, 6000) : "";
  const hasJob = trimmedJob.length > 0;

  return `You are an expert career advisor and resume analyst.

Analyze the resume below${hasJob ? " against the provided job description" : ""} and return ONLY valid JSON matching this exact schema:

{
  "overallScore": number,
  "skills": [{"name": string, "level": "Beginner"|"Intermediate"|"Advanced"|"Expert", "score": number}],
  "strengths": [string],
  "gaps": [string],
  "recommendations": [{"icon": string, "text": string}]
}

Rules:
- overallScore: 0–100. ${hasJob ? "Score how well the candidate matches the job description requirements." : "Score the overall resume quality and breadth of skills."}
- skills: Extract all technical and professional skills from the resume. Each skill needs a realistic proficiency level based on context clues (years of experience, seniority of projects, certifications). score is 0–100 reflecting proficiency depth.
- strengths: 3–6 specific strengths backed by evidence from the resume (e.g. "5 years of React with production deployments", not just "React").
- gaps: ${hasJob ? "Skills or experience areas required by the job description that are missing or weak in the resume." : "Areas where the candidate could improve to be more competitive."} Return empty array if none.
- recommendations: Exactly 3 actionable, specific recommendations tailored to this candidate. Each should address a real gap or growth area. Use a relevant emoji for icon.

Resume:
${trimmedResume}

${hasJob ? `Job Description:\n${trimmedJob}` : ""}`;
};

const analyzeResumeText = async (resumeText, jobText) => {
  let analysis = null;

  try {
    const prompt = buildPrompt(resumeText, jobText || "");

    const responseText = await generateContent(prompt, {
      maxOutputTokens: 1000,
      temperature: 0.1,
    });

    if (responseText) {
      const parsed = extractJsonFromText(responseText);
      if (parsed && typeof parsed === "object") {
        const skills = normalizeSkillObjects(parsed.skills || []);
        if (skills.length > 0) {
          analysis = {
            overallScore: clamp(parsed.overallScore ?? 70, 0, 100),
            skills,
            strengths: Array.isArray(parsed.strengths)
              ? parsed.strengths.map(String).filter(Boolean).slice(0, 6)
              : [],
            gaps: Array.isArray(parsed.gaps)
              ? parsed.gaps.map(titleCase).filter(Boolean).slice(0, 8)
              : [],
            recommendations: Array.isArray(parsed.recommendations)
              ? parsed.recommendations.slice(0, 3).map((r) => ({
                  icon: String(r.icon || "💡").slice(0, 6),
                  text: String(r.text || "").trim(),
                }))
              : [],
          };
        }
      }
    }
  } catch (err) {
    console.error("AI analysis failed:", err);
  }

  if (!analysis) {
    console.warn("Falling back to keyword-based resume analysis");
    analysis = buildFallback(resumeText, jobText);
  }

  if (!analysis.strengths.length && analysis.skills.length) {
    analysis.strengths = analysis.skills
      .filter((s) => s.level === "Expert" || s.level === "Advanced")
      .slice(0, 5)
      .map((s) => s.name);

    if (!analysis.strengths.length) {
      analysis.strengths = [...analysis.skills]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s) => s.name);
    }
  }

  if (!analysis.recommendations.length) {
    analysis.recommendations = [
      { icon: "📚", text: "Add certifications relevant to your target role to strengthen your profile." },
      { icon: "🚀", text: "Contribute to open source projects to demonstrate real-world experience." },
      { icon: "🎯", text: "Tailor your resume keywords to each job description for better match rates." },
    ];
  }

  return {
    analysis,
    skillNames: analysis.skills.map((s) => s.name),
  };
};

module.exports = {
  analyzeResumeText,
  buildFallback,
};
