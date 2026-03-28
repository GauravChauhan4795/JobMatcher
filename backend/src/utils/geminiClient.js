const DEFAULTS = {
  maxOutputTokens: 700,
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
};

const getGeminiUrl = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  if (!apiKey) return null;
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
};

const stripCodeFences = (text) => {
  if (!text) return "";
  return text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
};

const extractJsonFromText = (text) => {
  const cleaned = stripCodeFences(text);
  const startObj = cleaned.indexOf("{");
  const endObj = cleaned.lastIndexOf("}");
  if (startObj !== -1 && endObj !== -1 && endObj > startObj) {
    const slice = cleaned.slice(startObj, endObj + 1);
    try { return JSON.parse(slice); } catch (_) {}
  }
  const startArr = cleaned.indexOf("[");
  const endArr = cleaned.lastIndexOf("]");
  if (startArr !== -1 && endArr !== -1 && endArr > startArr) {
    const slice = cleaned.slice(startArr, endArr + 1);
    try { return JSON.parse(slice); } catch (_) {}
  }
  return null;
};

const generateContent = async (prompt, config = {}) => {
  const url = getGeminiUrl();
  if (!url) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { ...DEFAULTS, ...config },
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" ? text : null;
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = {
  generateContent,
  extractJsonFromText,
};
