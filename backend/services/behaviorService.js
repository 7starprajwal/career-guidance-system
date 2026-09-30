const BEHAVIOR_FEATURES = [
  "problemSolving",
  "analyticalThinking",
  "adaptability",
  "communication",
  "teamwork",
  "creativity",
  "leadership",
  "logicalThinking",
];

const normalizeScore = (value) => {
  const score = Number(value);

  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(score))
  );
};


const analyzeBehavior = (
  behaviorScores = {}
) => {
  const normalizedScores = {};

  BEHAVIOR_FEATURES.forEach(
    (feature) => {
      normalizedScores[feature] =
        normalizeScore(
          behaviorScores[feature]
        );
    }
  );


  const entries =
    Object.entries(
      normalizedScores
    );


  const total = entries.reduce(
    (sum, [, score]) =>
      sum + score,
    0
  );


  const average =
    entries.length === 0
      ? 0
      : Math.round(
          total / entries.length
        );


  const strongestTraits =
    entries
      .filter(
        ([, score]) =>
          score >= 70
      )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .map(
        ([trait, score]) => ({
          trait,
          score,
        })
      );


  const developingTraits =
    entries
      .filter(
        ([, score]) =>
          score >= 40 &&
          score < 70
      )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .map(
        ([trait, score]) => ({
          trait,
          score,
        })
      );


  const improvementAreas =
    entries
      .filter(
        ([, score]) =>
          score < 40
      )
      .sort(
        (a, b) =>
          a[1] - b[1]
      )
      .map(
        ([trait, score]) => ({
          trait,
          score,
        })
      );


  return {
    scores:
      normalizedScores,

    averageScore:
      average,

    strongestTraits,

    developingTraits,

    improvementAreas,
  };
};


const getBehaviorSummary = (
  behaviorScores = {}
) => {
  const analysis =
    analyzeBehavior(
      behaviorScores
    );

  return {
    averageScore:
      analysis.averageScore,

    strongestTraits:
      analysis.strongestTraits,

    improvementAreas:
      analysis.improvementAreas,
  };
};


module.exports = {
  BEHAVIOR_FEATURES,
  normalizeScore,
  analyzeBehavior,
  getBehaviorSummary,
};