// ============================================================
// ROADMAP TEMPLATES
// ============================================================

const ROADMAP_TEMPLATES = {
  // ==========================================================
  // FULL STACK DEVELOPER
  // ==========================================================

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
      prerequisites: [
        "HTML",
        "CSS",
      ],
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

  // ==========================================================
  // BACKEND DEVELOPER
  // ==========================================================

  "Backend Developer": [
    {
      skill: "JavaScript",
      phase: 1,
      duration: "2 weeks",
      level: "Intermediate",
      prerequisites: [],
      topics: [
        "Variables and data types",
        "Functions",
        "Arrays and objects",
        "ES6 features",
        "Modules",
        "Async JavaScript",
        "Promises",
        "Error handling",
      ],
    },

    {
      skill: "Node.js",
      phase: 2,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: [
        "JavaScript",
      ],
      topics: [
        "Node.js fundamentals",
        "Modules",
        "npm",
        "File system",
        "HTTP",
        "Environment variables",
        "Async programming",
      ],
    },

    {
      skill: "Express.js",
      phase: 3,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: [
        "Node.js",
      ],
      topics: [
        "Express setup",
        "Routing",
        "Controllers",
        "Middleware",
        "Error handling",
        "Request and response",
        "Project structure",
      ],
    },

    {
      skill: "MongoDB",
      phase: 4,
      duration: "1 week",
      level: "Intermediate",
      prerequisites: [
        "Node.js",
      ],
      topics: [
        "MongoDB fundamentals",
        "Databases",
        "Collections",
        "Documents",
        "CRUD operations",
        "Queries",
        "Indexes",
        "Mongoose",
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
        "REST architecture",
        "HTTP methods",
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "HTTP status codes",
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
        "Authentication",
        "Authorization",
        "Password hashing",
        "bcrypt",
        "JWT",
        "Protected routes",
        "Role-based access",
      ],
    },

    {
      skill: "Git",
      phase: 7,
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
  ],
};

// ============================================================
// NORMALIZE SKILL
// ============================================================

const normalizeSkill = (skill) => {
  return String(skill || "")
    .trim()
    .toLowerCase();
};

// ============================================================
// FIND ROADMAP TEMPLATE
// ============================================================

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

// ============================================================
// CREATE ROADMAP
// ============================================================

const createRoadmap = (
  careerName,
  skillGap
) => {
  const templates =
    findRoadmapTemplate(
      careerName
    );

  // ----------------------------------------------------------
  // GET MISSING SKILLS
  // ----------------------------------------------------------

  const missingSkills =
    (
      skillGap?.missingSkills ||
      []
    )
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.skill
      )
      .filter(Boolean);

  const normalizedMissing =
    missingSkills.map(
      normalizeSkill
    );

  // ----------------------------------------------------------
  // GET MATCHED SKILLS
  // ----------------------------------------------------------

  const completedSkills =
    (
      skillGap?.matchedSkills ||
      []
    )
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.skill
      )
      .filter(Boolean)
      .map(normalizeSkill);

  // ----------------------------------------------------------
  // CREATE ROADMAP
  // ----------------------------------------------------------

  const roadmap = [];

  // ----------------------------------------------------------
  // MISSING SKILLS
  // ----------------------------------------------------------

  templates.forEach(
    (item) => {
      const normalized =
        normalizeSkill(
          item.skill
        );

      if (
        normalizedMissing.includes(
          normalized
        )
      ) {
        roadmap.push({
          ...item,

          status:
            "not-started",

          progress: 0,
        });
      }
    }
  );

  // ----------------------------------------------------------
  // COMPLETED SKILLS
  // ----------------------------------------------------------

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

          status:
            "completed",

          progress: 100,
        });
      }
    }
  );

  // ----------------------------------------------------------
  // SORT
  // ----------------------------------------------------------

  roadmap.sort(
    (a, b) =>
      a.phase - b.phase
  );

  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------

  const totalSteps =
    roadmap.length;

  const completedSteps =
    roadmap.filter(
      (item) =>
        item.status ===
        "completed"
    ).length;

  const remainingSteps =
    totalSteps -
    completedSteps;

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

    remainingSteps,

    roadmap,
  };
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  ROADMAP_TEMPLATES,
  normalizeSkill,
  findRoadmapTemplate,
  createRoadmap,
};