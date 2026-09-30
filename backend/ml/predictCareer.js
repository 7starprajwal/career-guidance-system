const careers = require("../data/careers");

const {
  BEHAVIOR_KEYS,
  trainModel,
} = require("./trainModel");

const calculateDistance = (
  vectorA,
  vectorB
) => {
  if (
    vectorA.length !==
    vectorB.length
  ) {
    throw new Error(
      "Behavior vectors must have the same length"
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

const buildBehaviorVector = (
  behaviorScores
) => {
  return BEHAVIOR_KEYS.map(
    (key) =>
      Math.max(
        0,
        Math.min(
          100,
          Number(
            behaviorScores?.[key] ||
              0
          )
        )
      )
  );
};

const getNearestNeighbors = (
  trainingData,
  inputVector,
  k
) => {
  return trainingData
    .map((sample) => ({
      ...sample,

      distance:
        calculateDistance(
          sample.features,
          inputVector
        ),
    }))
    .sort(
      (a, b) =>
        a.distance -
        b.distance
    )
    .slice(0, k);
};

const calculateCareerProbabilities = (
  neighbors
) => {
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

  const total =
    Object.values(votes).reduce(
      (sum, value) =>
        sum + value,
      0
    );

  if (total === 0) {
    return {};
  }

  const probabilities = {};

  Object.entries(votes).forEach(
    ([careerName, value]) => {
      probabilities[careerName] =
        value / total;
    }
  );

  return probabilities;
};

const predictCareer = (
  profile,
  behaviorScores
) => {
  const model =
    trainModel();

  const inputVector =
    buildBehaviorVector(
      behaviorScores
    );

  const neighbors =
    getNearestNeighbors(
      model.trainingData,
      inputVector,
      model.k
    );

  const probabilities =
    calculateCareerProbabilities(
      neighbors
    );

  const predictions =
    careers.map((career) => {
      const probability =
        probabilities[
          career.name
        ] || 0;

      return {
        careerName:
          career.name,

        category:
          career.category,

        mlScore:
          Math.round(
            probability * 100
          ),

        probability:
          Number(
            probability.toFixed(4)
          ),

        behaviorVector:
          inputVector,

        nearestNeighbors:
          neighbors.map(
            (neighbor) => ({
              careerName:
                neighbor.label,

              distance:
                Number(
                  neighbor.distance.toFixed(
                    2
                  )
                ),
            })
          ),
      };
    });

  return predictions
    .sort(
      (a, b) =>
        b.mlScore -
        a.mlScore
    )
    .map(
      (prediction, index) => ({
        ...prediction,

        mlRank:
          index + 1,
      })
    );
};

const predictTopCareer = (
  profile,
  behaviorScores
) => {
  const predictions =
    predictCareer(
      profile,
      behaviorScores
    );

  return (
    predictions[0] || null
  );
};

const getModelInformation = () => {
  const model =
    trainModel();

  return {
    algorithm:
      model.algorithm,

    trainingSamples:
      model.trainingSamples,

    featureCount:
      model.featureCount,

    k:
      model.k,

    accuracy:
      model.accuracy,

    features:
      model.features,
  };
};

module.exports = {
  predictCareer,
  predictTopCareer,
  getModelInformation,
};