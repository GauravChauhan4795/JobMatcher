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

  const skills = resumeSkills.map((name) => ({
    name: titleCase(name),
    level: "Intermediate",
    score: 70,
  }));

  const gaps = jobSkills.filter((s) => !resumeSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase()));
  const strengths = skills.slice(0, 5).map((s) => s.name);

  const recommendations = (gaps.length ? gaps : resumeSkills.slice(0, 3)).slice(0, 3).map((skill) => ({
    icon: "TIP",
    text: `Strengthen ${titleCase(skill)} with a focused online course and a small project.`,
  }));

  return {
    overallScore: clamp(overallScore, 0, 100),
    skills,
    strengths,
    gaps: gaps.map(titleCase),
    recommendations,
  };
};

const buildPrompt = (resumeText, jobText) => {
  const trimmedResume = resumeText.slice(0, 12000);
  const trimmedJob = jobText ? jobText.slice(0, 6000) : "";
  return `You are a career advisor. Analyze the resume and optional job description.\n\nReturn ONLY valid JSON with this schema:\n{\n  \"overallScore\": number,\n  \"skills\": [{\"name\": string, \"level\": \"Beginner\"|\"Intermediate\"|\"Advanced\"|\"Expert\", \"score\": number}],\n  \"strengths\": [string],\n  \"gaps\": [string],\n  \"recommendations\": [{\"icon\": string, \"text\": string}]\n}\n\nRules:\n- overallScore must be 0-100. If a job description is provided, score match against it.\n- skills should be concise, deduplicated, and based on the resume.\n- strengths should be 3-6 items.\n- gaps should reflect missing/weak skills versus the job description (empty if none provided).\n- recommendations should be 3 items focused on the gaps or strengths.\n\nResume:\n${trimmedResume}\n\nJob Description:\n${trimmedJob}`;
};

const analyzeResumeText = async (resumeText, jobText) => {
  let analysis = null;
  const prompt = buildPrompt(resumeText, jobText || "");
  const responseText = await generateContent(prompt);

  if (responseText) {
    const parsed = extractJsonFromText(responseText);
    if (parsed && typeof parsed === "object") {
      const skills = normalizeSkillObjects(parsed.skills || []);
      analysis = {
        overallScore: clamp(parsed.overallScore ?? 70, 0, 100),
        skills,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(titleCase).slice(0, 6) : [],
        gaps: Array.isArray(parsed.gaps) ? parsed.gaps.map(titleCase).slice(0, 6) : [],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations.slice(0, 3).map((r) => ({
              icon: String(r.icon || "TIP").slice(0, 6),
              text: String(r.text || "").trim(),
            }))
          : [],
      };
    }
  }

  if (!analysis || analysis.skills.length === 0) {
    analysis = buildFallback(resumeText, jobText);
  }

  if (!analysis.strengths.length && analysis.skills.length) {
    analysis.strengths = analysis.skills.slice(0, 5).map((s) => s.name);
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
