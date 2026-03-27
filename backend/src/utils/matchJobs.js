const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s) => String(s || "").toLowerCase().trim())
    .filter((s) => s.length > 0);
};

exports.calculateMatchScore = (userSkills, jobSkills) => {
  const user = normalizeSkills(userSkills);
  const job = normalizeSkills(jobSkills);
  if (job.length === 0) return 0;

  const userSet = new Set(user);
  const matches = job.filter((skill) => userSet.has(skill));

  return Math.round((matches.length / job.length) * 100);
};
