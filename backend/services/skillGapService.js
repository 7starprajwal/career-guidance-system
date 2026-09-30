const normalizeSkill = (skill) => {
  return String(skill || "")
    .trim()
    .toLowerCase();
};

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map(normalizeSkill)
    .filter(Boolean);
};

const isSkillMatched = (
  userSkill,
  requiredSkill
) => {
  const user =
    normalizeSkill(userSkill);

  const required =
    normalizeSkill(requiredSkill);

  if (!user || !required) {
    return false;
  }

  return (
    user === required ||
    user.includes(required) ||
    required.includes(user)
  );
};

const calculateSkillGap = (
  userSkills,
  requiredSkills
) => {
  const currentSkills =
    Array.isArray(userSkills)
      ? userSkills
      : [];

  const required =
    Array.isArray(requiredSkills)
      ? requiredSkills
      : [];

  const matchedSkills = [];
  const missingSkills = [];

  required.forEach(
    (requiredSkill) => {
      const matched =
        currentSkills.some(
          (userSkill) =>
            isSkillMatched(
              userSkill,
              requiredSkill
            )
        );

      if (matched) {
        matchedSkills.push(
          requiredSkill
        );
      } else {
        missingSkills.push(
          requiredSkill
        );
      }
    }
  );

  const totalRequired =
    required.length;

  const matchedCount =
    matchedSkills.length;

  const readiness =
    totalRequired === 0
      ? 0
      : Math.round(
          (matchedCount /
            totalRequired) *
            100
        );

  return {
    currentSkills,
    requiredSkills: required,
    matchedSkills,
    missingSkills,
    matchedCount,
    missingCount:
      missingSkills.length,
    totalRequired,
    readiness,
  };
};

const getSkillPriority = (
  skill,
  career
) => {
  const skillName =
    normalizeSkill(skill);

  const careerName =
    normalizeSkill(
      career?.name
    );

  /*
   * Core skills for different career
   * categories receive higher priority.
   */
  const highPrioritySkills = {
    "full stack developer": [
      "javascript",
      "react",
      "node.js",
      "mongodb",
    ],

    "data analyst": [
      "python",
      "sql",
      "excel",
      "statistics",
    ],

    "machine learning engineer": [
      "python",
      "machine learning",
      "statistics",
      "tensorflow",
    ],

    "ui/ux designer": [
      "figma",
      "ui design",
      "ux research",
      "prototyping",
    ],

    "cybersecurity analyst": [
      "networking",
      "linux",
      "cybersecurity",
      "ethical hacking",
    ],

    "cloud engineer": [
      "aws",
      "azure",
      "docker",
      "linux",
    ],

    "digital marketer": [
      "seo",
      "content marketing",
      "social media marketing",
      "google analytics",
    ],
  };

  const priorityList =
    highPrioritySkills[
      careerName
    ] || [];

  if (
    priorityList.includes(
      skillName
    )
  ) {
    return "High";
  }

  return "Medium";
};

const generateSkillGap = (
  userSkills,
  career
) => {
  const analysis =
    calculateSkillGap(
      userSkills,
      career?.requiredSkills
    );

  const missingWithPriority =
    analysis.missingSkills.map(
      (skill) => ({
        skill,

        priority:
          getSkillPriority(
            skill,
            career
          ),
      })
    );

  return {
    career: career?.name || "",

    category:
      career?.category || "",

    readiness:
      analysis.readiness,

    currentSkills:
      analysis.currentSkills,

    requiredSkills:
      analysis.requiredSkills,

    matchedSkills:
      analysis.matchedSkills,

    missingSkills:
      missingWithPriority,

    matchedCount:
      analysis.matchedCount,

    missingCount:
      analysis.missingCount,

    totalRequired:
      analysis.totalRequired,
  };
};

module.exports = {
  normalizeSkill,
  normalizeSkills,
  isSkillMatched,
  calculateSkillGap,
  getSkillPriority,
  generateSkillGap,
};