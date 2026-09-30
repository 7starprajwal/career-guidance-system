const ROADMAP_TEMPLATES = {
  "Full Stack Developer": [
    {
      skill: "HTML",
      phase: 1,
      duration: "1 week",
      level: "Beginner",
      prerequisites: [],
      topics: [
        "HTML structure",
        "Semantic HTML",
        "Forms",
        "Tables",
        "Links and images",
        "Accessibility basics",
      ],
    },

    {
      skill: "CSS",
      phase: 1,
      duration: "1 week",
      level: "Beginner",
      prerequisites: ["HTML"],
      topics: [
        "Selectors",
        "Box model",
        "Flexbox",
        "Grid",
        "Responsive design",
        "Media queries",
      ],
    },

    {
      skill: "JavaScript",
      phase: 2,
      duration: "2 weeks",
      level: "Intermediate",
      prerequisites: ["HTML", "CSS"],
      topics: [
        "Variables and data types",
        "Functions",
        "Arrays and objects",
        "DOM",
        "Events",
        "Async JavaScript",
        "Promises",
        "Fetch API",
      ],
    },

    {
      skill: "React",
      phase: 3,
      duration: "2 weeks",
      level: "Intermediate",
      prerequisites: ["JavaScript"],
      topics: [
        "Components",
        "Props",
        "State",
        "Hooks",
        "Forms",
        "React Router",
        "API integration",
      ],
    },

    {
      skill: "Node.js",
      phase: 4,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: ["JavaScript"],
      topics: [
        "Node.js fundamentals",
        "Modules",
        "File system",
        "HTTP server",
        "Environment variables",
        "npm",
      ],
    },

    {
      skill: "Express.js",
      phase: 4,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: [
        "Node.js",
      ],
      topics: [
        "Express setup",
        "Routes",
        "Controllers",
        "Middleware",
        "Error handling",
        "REST API structure",
      ],
    },

    {
      skill: "REST API",
      phase: 5,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: [
        "Express.js",
      ],
      topics: [
        "HTTP methods",
        "GET requests",
        "POST requests",
        "PUT requests",
        "DELETE requests",
        "Status codes",
        "API testing",
      ],
    },

    {
      skill: "Authentication",
      phase: 6,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: [
        "REST API",
      ],
      topics: [
        "Authentication concepts",
        "Password hashing",
        "JWT",
        "Protected routes",
        "Authorization",
        "Role-based access",
      ],
    },

    {
      skill: "MongoDB",
      phase: 7,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: [
        "Node.js",
      ],
      topics: [
        "Collections",
        "Documents",
        "CRUD operations",
        "MongoDB queries",
        "Mongoose",
        "Schema design",
      ],
    },

    {
      skill: "Git",
      phase: 8,
      duration: "3 days",
      level: "Beginner",
      prerequisites: [],
      topics: [
        "Git basics",
        "Repositories",
        "Commit",
        "Branch",
        "Merge",
        "GitHub",
        "Pull requests",
      ],
    },

    {
      skill: "Deployment",
      phase: 9,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: [
        "Git",
        "REST API",
      ],
      topics: [
        "Environment variables",
        "Frontend deployment",
        "Backend deployment",
        "Database configuration",
        "Production builds",
        "Domain configuration",
      ],
    },
  ],
};

const normalizeSkill = (
  skill
) => {
  return String(skill || "")
    .trim()
    .toLowerCase();
};

const findRoadmapTemplate = (
  careerName
) => {
  const templates =
    Object.entries(
      ROADMAP_TEMPLATES
    );

  const match =
    templates.find(
      ([name]) =>
        normalizeSkill(name) ===
        normalizeSkill(
          careerName
        )
    );

  return match
    ? match[1]
    : [];
};

const createRoadmap = (
  careerName,
  skillGap
) => {
  const templates =
    findRoadmapTemplate(
      careerName
    );

  const missingSkills =
    (skillGap?.missingSkills ||
      []).map((item) =>
        typeof item === "string"
          ? item
          : item.skill
      );

  const normalizedMissing =
    missingSkills.map(
      normalizeSkill
    );

  const roadmap =
    templates
      .filter((item) =>
        normalizedMissing.includes(
          normalizeSkill(
            item.skill
          )
        )
      )
      .map((item) => ({
        ...item,

        status: "not-started",

        progress: 0,
      }));

  const completedSkills =
    (
      skillGap?.matchedSkills ||
      []
    ).map(normalizeSkill);

  templates.forEach(
    (item) => {
      const normalized =
        normalizeSkill(
          item.skill
        );

      if (
        completedSkills.includes(
          normalized
        )
      ) {
        roadmap.push({
          ...item,

          status: "completed",

          progress: 100,
        });
      }
    }
  );

  roadmap.sort(
    (a, b) =>
      a.phase - b.phase
  );

  const totalSteps =
    roadmap.length;

  const completedSteps =
    roadmap.filter(
      (item) =>
        item.status ===
        "completed"
    ).length;

  const overallProgress =
    totalSteps === 0
      ? 0
      : Math.round(
          (completedSteps /
            totalSteps) *
            100
        );

  return {
    career:
      careerName,

    overallProgress,

    totalSteps,

    completedSteps,

    remainingSteps:
      totalSteps -
      completedSteps,

    roadmap,
  };
};

module.exports = {
  ROADMAP_TEMPLATES,
  normalizeSkill,
  findRoadmapTemplate,
  createRoadmap,
};