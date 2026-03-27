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

exports.extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  return SKILLS.filter((skill) => {
    // Use word boundary matching to avoid partial matches
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, "i");
    return regex.test(lowerText);
  });
};