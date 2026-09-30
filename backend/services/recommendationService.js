const {
  predictCareer,
} = require("../ml/predictCareer");

const {
  calculatePartialMatchScore,
  calculateCareerPreferenceScore,
  calculateEducationScore,
  normalizeText,
  normalizeArray,
} = require("../ml/modelUtils");

const calculateBehaviorScore = (
  behaviorScores,
  career
) => {
  const traits =
    career.behavioralTraits || [];

  if (!traits.length) {
    return 0;
  }

  let total = 0;
  let count = 0;

  traits.forEach((trait) => {
    const traitName =
      normalizeText(trait);

    const matchingKey =
      Object.keys(
        behaviorScores || {}
      ).find(
        (key) =>
          normalizeText(key) ===
          traitName
      );

    if (matchingKey) {
      total += Number(
        behaviorScores[matchingKey] || 0
      );

      count += 1;
    }
  });

  if (count === 0) {
    return 0;
  }

  return Math.round(
    total / count
  );
};

const calculateBaseRecommendationScore = (
  profile,
  assessment,
  career
) => {
  const userSkills =
    profile?.skills || [];

  const userInterests =
    profile?.interests || [];

  const behaviorScores =
    assessment?.behaviorScores || {};

  const skillScore =
    calculatePartialMatchScore(
      userSkills,
      career.requiredSkills
    );

  const interestScore =
    calculatePartialMatchScore(
      userInterests,
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

  const behaviorScore =
    calculateBehaviorScore(
      behaviorScores,
      career
    );

  const baseScore =
    skillScore * 0.35 +
    interestScore * 0.20 +
    careerPreferenceScore * 0.15 +
    educationScore * 0.10 +
    behaviorScore * 0.20;

  return {
    skillScore: Math.round(
      skillScore
    ),

    interestScore: Math.round(
      interestScore
    ),

    careerPreferenceScore:
      Math.round(
        careerPreferenceScore
      ),

    educationScore:
      Math.round(
        educationScore
      ),

    behaviorScore:
      Math.round(
        behaviorScore
      ),

    baseScore: Math.round(
      baseScore
    ),
  };
};

const getMatchedSkills = (
  userSkills,
  requiredSkills
) => {
  const normalizedUserSkills =
    normalizeArray(userSkills);

  return (
    requiredSkills || []
  ).filter((requiredSkill) => {
    const normalizedRequired =
      normalizeText(
        requiredSkill
      );

    return normalizedUserSkills.some(
      (userSkill) =>
        userSkill.includes(
          normalizedRequired
        ) ||
        normalizedRequired.includes(
          userSkill
        )
    );
  });
};

const getMissingSkills = (
  userSkills,
  requiredSkills
) => {
  const normalizedUserSkills =
    normalizeArray(userSkills);

  return (
    requiredSkills || []
  ).filter((requiredSkill) => {
    const normalizedRequired =
      normalizeText(
        requiredSkill
      );

    return !normalizedUserSkills.some(
      (userSkill) =>
        userSkill.includes(
          normalizedRequired
        ) ||
        normalizedRequired.includes(
          userSkill
        )
    );
  });
};

const generateRecommendations = (
  profile,
  assessment,
  careers
) => {
  const behaviorScores =
    assessment?.behaviorScores || {};

  const mlPredictions =
    predictCareer(
      profile,
      behaviorScores
    );

  const mlPredictionMap =
    new Map();

  mlPredictions.forEach(
    (prediction) => {
      mlPredictionMap.set(
        prediction.careerName,
        prediction
      );
    }
  );

  const recommendations =
    careers.map((career) => {
      const base =
        calculateBaseRecommendationScore(
          profile,
          assessment,
          career
        );

      const mlPrediction =
        mlPredictionMap.get(
          career.name
        );

      const mlScore =
        mlPrediction?.mlScore || 0;

      const finalScore =
        base.baseScore * 0.70 +
        mlScore * 0.30;

      const matchedSkills =
        getMatchedSkills(
          profile?.skills || [],
          career.requiredSkills
        );

      const missingSkills =
        getMissingSkills(
          profile?.skills || [],
          career.requiredSkills
        );

      return {
        careerId:
          career._id
            ? String(career._id)
            : career.name
                .toLowerCase()
                .replace(
                  /[^a-z0-9]+/g,
                  "-"
                ),

        careerName:
          career.name,

        category:
          career.category,

        description:
          career.description,

        requiredSkills:
          career.requiredSkills,

        interests:
          career.interests,

        learningPath:
          career.learningPath,

        matchedSkills,

        missingSkills,

        scores: {
          skillMatch:
            base.skillScore,

          interestMatch:
            base.interestScore,

          careerPreference:
            base.careerPreferenceScore,

          educationMatch:
            base.educationScore,

          behavioralMatch:
            base.behaviorScore,

          ruleBasedScore:
            base.baseScore,

          mlScore,

          finalScore:
            Math.round(
              finalScore
            ),
        },

        ml: {
          rank:
            mlPrediction?.mlRank ||
            null,

          probability:
            mlPrediction?.probability ||
            0,

          nearestNeighbors:
            mlPrediction
              ?.nearestNeighbors ||
            [],
        },
      };
    });

  recommendations.sort(
    (a, b) =>
      b.scores.finalScore -
      a.scores.finalScore
  );

  return recommendations.map(
    (recommendation, index) => ({
      ...recommendation,

      recommendationRank:
        index + 1,
    })
  );
};

module.exports = {
  generateRecommendations,
};