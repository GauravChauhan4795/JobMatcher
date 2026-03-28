const { generateContent, extractJsonFromText } = require("./geminiClient");

const SKILLS = [
  // Languages
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin",
  // Frontend
  "react", "vue", "angular", "next.js", "nextjs", "svelte", "tailwind", "html", "css", "sass",
  // Backend
  "node", "node.js", "nodejs", "express", "django", "flask", "fastapi", "spring", "laravel",
  // Databases
  "mongodb", "postgresql", "mysql", "sql", "redis", "elasticsearch", "firebase",
  // Cloud & DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd", "jenkins",
  // Tools
  "git", "graphql", "rest", "grpc", "kafka", "rabbitmq",
  // ML/AI
  "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "mlops",
];

const normalizeSkillList = (skills) => {
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

const extractSkillsByKeywords = (text) => {
  const lowerText = String(text || "").toLowerCase();
  return SKILLS.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, "i");
    return regex.test(lowerText);
  });
};

const buildSkillPrompt = (text) => {
  const trimmed = String(text || "").slice(0, 10000);
  return `Extract a concise, deduplicated list of hard technical skills from the resume below.
Include programming languages, frameworks, tools, platforms, and methodologies.
Return ONLY valid JSON as an array of strings. No markdown, no explanation.

Resume:
${trimmed}`;
};

const extractSkillsWithLLM = async (text) => {
  try {
    const prompt = buildSkillPrompt(text);
    const response = await generateContent(prompt, { maxOutputTokens: 400, temperature: 0.1 });
    if (response) {
      const parsed = extractJsonFromText(response);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeSkillList(parsed);
      }
    }
  } catch (err) {
    console.warn("LLM skill extraction failed, falling back to keywords:", err?.message);
  }
  return extractSkillsByKeywords(text);
};

const extractSkills = extractSkillsWithLLM;

module.exports = {
  extractSkills,
  extractSkillsByKeywords,
  extractSkillsWithLLM,
  normalizeSkillList,
};
