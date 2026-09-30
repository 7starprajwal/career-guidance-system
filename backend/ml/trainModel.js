const careers = require("../data/careers");

const BEHAVIOR_KEYS = [
  "problemSolving",
  "analyticalThinking",
  "adaptability",
  "communication",
  "teamwork",
  "creativity",
  "leadership",
  "logicalThinking",
];

const CAREER_BEHAVIOR_PROFILES = {
  "Full Stack Developer": {
    problemSolving: 85,
    analyticalThinking: 75,
    adaptability: 85,
    communication: 65,
    teamwork: 75,
    creativity: 70,
    leadership: 50,
    logicalThinking: 90,
  },

  "Data Analyst": {
    problemSolving: 75,
    analyticalThinking: 95,
    adaptability: 65,
    communication: 65,
    teamwork: 60,
    creativity: 50,
    leadership: 40,
    logicalThinking: 95,
  },

  "Machine Learning Engineer": {
    problemSolving: 92,
    analyticalThinking: 96,
    adaptability: 85,
    communication: 55,
    teamwork: 60,
    creativity: 80,
    leadership: 45,
    logicalThinking: 98,
  },

  "UI/UX Designer": {
    problemSolving: 65,
    analyticalThinking: 55,
    adaptability: 85,
    communication: 90,
    teamwork: 85,
    creativity: 98,
    leadership: 60,
    logicalThinking: 50,
  },

  "Cybersecurity Analyst": {
    problemSolving: 95,
    analyticalThinking: 94,
    adaptability: 80,
    communication: 50,
    teamwork: 50,
    creativity: 55,
    leadership: 40,
    logicalThinking: 98,
  },

  "Cloud Engineer": {
    problemSolving: 88,
    analyticalThinking: 82,
    adaptability: 95,
    communication: 60,
    teamwork: 72,
    creativity: 52,
    leadership: 55,
    logicalThinking: 92,
  },

  "Digital Marketer": {
    problemSolving: 55,
    analyticalThinking: 60,
    adaptability: 95,
    communication: 98,
    teamwork: 88,
    creativity: 96,
    leadership: 88,
    logicalThinking: 45,
  },
};

const VARIATIONS = [
  -18,
  -12,
  -7,
  -3,
  0,
  4,
  8,
  13,
  18,
];

const clamp = (value) => {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
};

const generateTrainingData = () => {
  const trainingData = [];

  careers.forEach((career) => {
    const behaviorProfile =
      CAREER_BEHAVIOR_PROFILES[
        career.name
      ];

    if (!behaviorProfile) {
      return;
    }

    VARIATIONS.forEach(
      (variation, index) => {
        const features =
          BEHAVIOR_KEYS.map(
            (key, keyIndex) => {
              /*
               * Small deterministic variation between
               * behavioral dimensions prevents every
               * training sample from being identical.
               */
              const dimensionAdjustment =
                ((index + keyIndex) % 3) - 1;

              return clamp(
                behaviorProfile[key] +
                  variation +
                  dimensionAdjustment
              );
            }
          );

        trainingData.push({
          id: `${career.name
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )}-${index + 1}`,

          features,

          label: career.name,
        });
      }
    );
  });

  return trainingData;
};

const calculateDistance = (
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
      "Behavior feature vectors must have the same length"
    );
  }

  let sum = 0;

  for (
    let index = 0;
    index < vectorA.length;
    index += 1
  ) {
    const difference =
      vectorA[index] -
      vectorB[index];

    sum +=
      difference * difference;
  }

  return Math.sqrt(sum);
};

const predictSample = (
  trainingData,
  testSample,
  k = 5
) => {
  const remainingSamples =
    trainingData.filter(
      (sample) =>
        sample.id !==
        testSample.id
    );

  const neighbors =
    remainingSamples
      .map((sample) => ({
        ...sample,

        distance:
          calculateDistance(
            sample.features,
            testSample.features
          ),
      }))
      .sort(
        (a, b) =>
          a.distance -
          b.distance
      )
      .slice(0, k);

  const votes = {};

  neighbors.forEach(
    (neighbor) => {
      const weight =
        1 /
        (neighbor.distance +
          0.0001);

      votes[neighbor.label] =
        (votes[neighbor.label] || 0) +
        weight;
    }
  );

  return Object.entries(votes).sort(
    (a, b) =>
      b[1] - a[1]
  )[0]?.[0];
};

const calculateAccuracy = (
  trainingData,
  k = 5
) => {
  if (
    !trainingData.length
  ) {
    return 0;
  }

  let correct = 0;

  trainingData.forEach(
    (testSample) => {
      const prediction =
        predictSample(
          trainingData,
          testSample,
          k
        );

      if (
        prediction ===
        testSample.label
      ) {
        correct += 1;
      }
    }
  );

  return Number(
    (
      (correct /
        trainingData.length) *
      100
    ).toFixed(2)
  );
};

const trainModel = () => {
  const trainingData =
    generateTrainingData();

  const k = 5;

  const accuracy =
    calculateAccuracy(
      trainingData,
      k
    );

  return {
    algorithm:
      "K-Nearest Neighbors",

    trainingSamples:
      trainingData.length,

    featureCount:
      BEHAVIOR_KEYS.length,

    k,

    accuracy,

    features:
      BEHAVIOR_KEYS,

    trainingData,
  };
};

module.exports = {
  BEHAVIOR_KEYS,
  CAREER_BEHAVIOR_PROFILES,
  generateTrainingData,
  calculateAccuracy,
  trainModel,
  trainingData:
    generateTrainingData(),
};