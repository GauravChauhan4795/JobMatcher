const SKILLS = [
  "javascript", "react", "node", "express", "mongodb",
  "python", "java", "c++", "sql", "html", "css",
  "docker", "kubernetes", "aws", "git"
];

exports.extractSkills = (text) => {
  const lowerText = text.toLowerCase();

  return SKILLS.filter(skill => lowerText.includes(skill));
};