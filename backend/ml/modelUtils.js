const clamp = (value, min = 0, max = 100) => {
  return Math.max(
    min,
    Math.min(max, value)
  );
};

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const normalizeArray = (values) => {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) =>
      normalizeText(value)
    )
    .filter(Boolean);
};

const calculateMatchScore = (
  userItems,
  targetItems
) => {
  const userSet = new Set(
    normalizeArray(userItems)
  );

  const targets =
    normalizeArray(targetItems);

  if (targets.length === 0) {
    return 0;
  }

  const matched =
    targets.filter((item) =>
      userSet.has(item)
    ).length;

  return Math.round(
    (matched / targets.length) * 100
  );
};

const calculatePartialMatchScore = (
  userItems,
  targetItems
) => {
  const users =
    normalizeArray(userItems);

  const targets =
    normalizeArray(targetItems);

  if (
    targets.length === 0 ||
    users.length === 0
  ) {
    return 0;
  }

  let matched = 0;

  targets.forEach((target) => {
    const isMatched =
      users.some(
        (userItem) =>
          userItem.includes(target) ||
          target.includes(userItem)
      );

    if (isMatched) {
      matched += 1;
    }
  });

  return Math.round(
    (matched / targets.length) * 100
  );
};

const calculateCareerPreferenceScore = (
  profile,
  career
) => {
  const preferredCareer =
    normalizeText(
      profile?.preferredCareer
    );

  const careerGoal =
    normalizeText(
      profile?.careerGoal
    );

  const careerName =
    normalizeText(
      career?.name
    );

  if (!careerName) {
    return 0;
  }

  if (
    preferredCareer &&
    preferredCareer === careerName
  ) {
    return 100;
  }

  if (
    preferredCareer &&
    (
      preferredCareer.includes(
        careerName
      ) ||
      careerName.includes(
        preferredCareer
      )
    )
  ) {
    return 80;
  }

  if (
    careerGoal &&
    (
      careerGoal.includes(
        careerName
      ) ||
      careerName.includes(
        careerGoal
      )
    )
  ) {
    return 70;
  }

  return 0;
};

const calculateEducationScore = (
  profile,
  career
) => {
  const branch =
    normalizeText(
      profile?.education?.branch
    );

  const degree =
    normalizeText(
      profile?.education?.degree
    );

  const preferredEducation =
    normalizeArray(
      career?.preferredEducation
    );

  if (
    preferredEducation.length === 0
  ) {
    return 50;
  }

  const educationText =
    `${branch} ${degree}`.trim();

  if (!educationText) {
    return 0;
  }

  const matched =
    preferredEducation.some(
      (education) =>
        educationText.includes(
          education
        ) ||
        (
          branch &&
          education.includes(branch)
        ) ||
        (
          degree &&
          education.includes(degree)
        )
    );

  return matched ? 100 : 40;
};

/*
 * Feature weights used by the ML distance calculation.
 *
 * Profile-related features receive slightly higher
 * importance because career recommendations depend
 * strongly on:
 *
 * 1. Skills
 * 2. Interests
 * 3. Career preference
 * 4. Education
 *
 * Behavioral characteristics are still included
 * equally across their individual dimensions.
 */
const FEATURE_WEIGHTS = [
  1.5, // Skill Match
  1.5, // Interest Match
  1.5, // Career Preference
  1.2, // Education Match

  1.0, // Problem Solving
  1.0, // Analytical Thinking
  1.0, // Adaptability
  1.0, // Communication
  1.0, // Teamwork
  1.0, // Creativity
  1.0, // Leadership
  1.0, // Logical Thinking
];

const buildCandidateFeatureVector = (
  profile,
  behaviorScores,
  career
) => {
  const skills =
    profile?.skills || [];

  const interests =
    profile?.interests || [];

  const skillScore =
    calculatePartialMatchScore(
      skills,
      career.requiredSkills
    );

  const interestScore =
    calculatePartialMatchScore(
      interests,
      career.interests
    );

  const careerPreferenceScore =
    calculateCareerPreferenceScore(
      profile,
      career
    );

  const educationScore =
    calculateEducationScore(
      profile,
      career
    );

  return [
    clamp(skillScore),
    clamp(interestScore),
    clamp(careerPreferenceScore),
    clamp(educationScore),

    clamp(
      behaviorScores?.problemSolving ||
        0
    ),

    clamp(
      behaviorScores?.analyticalThinking ||
        0
    ),

    clamp(
      behaviorScores?.adaptability ||
        0
    ),

    clamp(
      behaviorScores?.communication ||
        0
    ),

    clamp(
      behaviorScores?.teamwork ||
        0
    ),

    clamp(
      behaviorScores?.creativity ||
        0
    ),

    clamp(
      behaviorScores?.leadership ||
        0
    ),

    clamp(
      behaviorScores?.logicalThinking ||
        0
    ),
  ];
};

const euclideanDistance = (
  vectorA,
  vectorB
) => {
  if (
    !Array.isArray(vectorA) ||
    !Array.isArray(vectorB) ||
    vectorA.length !==
      vectorB.length
  ) {
    throw new Error(
      "Feature vectors must have the same length"
    );
  }

  let sum = 0;

  for (
    let i = 0;
    i < vectorA.length;
    i += 1
  ) {
    const difference =
      Number(vectorA[i] || 0) -
      Number(vectorB[i] || 0);

    const weight =
      FEATURE_WEIGHTS[i] || 1;

    sum +=
      difference *
      difference *
      weight;
  }

  return Math.sqrt(sum);
};

const getKNearestNeighbors = (
  trainingData,
  inputVector,
  k = 5
) => {
  if (
    !Array.isArray(trainingData)
  ) {
    return [];
  }

  const neighbors =
    trainingData
      .map((sample) => ({
        ...sample,

        distance:
          euclideanDistance(
            sample.features,
            inputVector
          ),
      }))
      .sort(
        (a, b) =>
          a.distance -
          b.distance
      );

  return neighbors.slice(
    0,
    Math.min(
      k,
      neighbors.length
    )
  );
};

const calculateWeightedVotes = (
  neighbors
) => {
  const votes = {};

  neighbors.forEach(
    (neighbor) => {
      const label =
        neighbor.label;

      if (!votes[label]) {
        votes[label] = 0;
      }

      const weight =
        1 /
        (neighbor.distance +
          0.0001);

      votes[label] += weight;
    }
  );

  return votes;
};

const normalizeVotes = (
  votes
) => {
  const total =
    Object.values(votes).reduce(
      (sum, value) =>
        sum + value,
      0
    );

  if (total === 0) {
    return {};
  }

  const normalized = {};

  Object.entries(votes).forEach(
    ([label, value]) => {
      normalized[label] =
        value / total;
    }
  );

  return normalized;
};

module.exports = {
  clamp,
  normalizeText,
  normalizeArray,
  calculateMatchScore,
  calculatePartialMatchScore,
  calculateCareerPreferenceScore,
  calculateEducationScore,
  buildCandidateFeatureVector,
  euclideanDistance,
  getKNearestNeighbors,
  calculateWeightedVotes,
  normalizeVotes,
  FEATURE_WEIGHTS,
};