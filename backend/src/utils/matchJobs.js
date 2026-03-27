exports.calculateMatchScore = (userSkills, jobSkills) => {
  if (!jobSkills.length) return 0;

  const matches = jobSkills.filter(skill =>
    userSkills.includes(skill)
  );

  return matches.length / jobSkills.length;
};