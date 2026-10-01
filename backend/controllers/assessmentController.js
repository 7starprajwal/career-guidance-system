const Assessment = require("../models/Assessment");
const assessmentQuestions = require("../data/assessmentQuestions");

// ==============================
// BEHAVIOR TRAITS
// ==============================

const BEHAVIOR_TRAITS = [
  "problemSolving",
  "analyticalThinking",
  "adaptability",
  "communication",
  "teamwork",
  "creativity",
  "leadership",
  "logicalThinking",
];

// ==============================
// NORMALIZE QUESTION ID
// ==============================

const findQuestion = (questionId) => {
  return assessmentQuestions.find(
    (question) =>
      String(question.id) === String(questionId)
  );
};

// ==============================
// CONVERT ANSWER TO OPTION INDEX
// ==============================
//
// The frontend may send:
//
// 1. Numeric index
// 2. Option ID such as A/B/C/D
// 3. Option text
//
// MongoDB stores only the numeric index.
//

const getOptionIndex = (question, answer) => {
  if (!question || answer === undefined || answer === null) {
    return null;
  }

  // --------------------------------
  // Case 1: numeric answer
  // --------------------------------

  if (
    typeof answer === "number" &&
    Number.isInteger(answer)
  ) {
    if (
      answer >= 0 &&
      answer < question.options.length
    ) {
      return answer;
    }

    return null;
  }

  // --------------------------------
  // Convert answer to string
  // --------------------------------

  const answerString = String(answer).trim();

  if (!answerString) {
    return null;
  }

  // --------------------------------
  // Case 2: numeric string
  // --------------------------------

  if (/^\d+$/.test(answerString)) {
    const numericIndex = Number(answerString);

    if (
      numericIndex >= 0 &&
      numericIndex < question.options.length
    ) {
      return numericIndex;
    }
  }

  // --------------------------------
  // Case 3: option ID
  // Example: A, B, C, D
  // --------------------------------

  const optionIdIndex =
    question.options.findIndex(
      (option) =>
        String(option.id).trim().toLowerCase() ===
        answerString.toLowerCase()
    );

  if (optionIdIndex !== -1) {
    return optionIdIndex;
  }

  // --------------------------------
  // Case 4: option text
  // --------------------------------

  const optionTextIndex =
    question.options.findIndex(
      (option) =>
        String(option.text).trim().toLowerCase() ===
        answerString.toLowerCase()
    );

  if (optionTextIndex !== -1) {
    return optionTextIndex;
  }

  // --------------------------------
  // Case 5: slightly more tolerant
  // text comparison
  // --------------------------------

  const normalizedAnswer = answerString
    .replace(/\s+/g, " ")
    .toLowerCase();

  const flexibleTextIndex =
    question.options.findIndex((option) => {
      const normalizedOptionText = String(
        option.text
      )
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      return (
        normalizedOptionText === normalizedAnswer
      );
    });

  if (flexibleTextIndex !== -1) {
    return flexibleTextIndex;
  }

  return null;
};

// ==============================
// NORMALIZE ALL ANSWERS
// ==============================

const normalizeAnswers = (answers) => {
  const normalizedAnswers = {};
  const invalidAnswers = [];

  Object.entries(answers).forEach(
    ([questionId, answer]) => {
      const question = findQuestion(questionId);

      if (!question) {
        invalidAnswers.push({
          questionId,
          answer,
          reason: "Question not found",
        });

        return;
      }

      const optionIndex = getOptionIndex(
        question,
        answer
      );

      if (optionIndex === null) {
        invalidAnswers.push({
          questionId,
          answer,
          reason: "Invalid answer",
        });

        return;
      }

      normalizedAnswers[String(question.id)] =
        optionIndex;
    }
  );

  return {
    normalizedAnswers,
    invalidAnswers,
  };
};

// ==============================
// CALCULATE BEHAVIOR SCORES
// ==============================

const calculateBehaviorScores = (answers) => {
  const totals = {
    problemSolving: 0,
    analyticalThinking: 0,
    adaptability: 0,
    communication: 0,
    teamwork: 0,
    creativity: 0,
    leadership: 0,
    logicalThinking: 0,
  };

  Object.entries(answers).forEach(
    ([questionId, optionIndex]) => {
      const question = findQuestion(questionId);

      if (!question) {
        return;
      }

      const numericIndex = Number(optionIndex);

      if (
        !Number.isInteger(numericIndex) ||
        numericIndex < 0 ||
        numericIndex >= question.options.length
      ) {
        return;
      }

      const selectedOption =
        question.options[numericIndex];

      if (!selectedOption) {
        return;
      }

      const scores = selectedOption.scores || {};

      Object.entries(scores).forEach(
        ([trait, score]) => {
          if (
            Object.prototype.hasOwnProperty.call(
              totals,
              trait
            )
          ) {
            totals[trait] += Number(score) || 0;
          }
        }
      );
    }
  );

  const questionCount =
    assessmentQuestions.length;

  const normalizedScores = {};

  BEHAVIOR_TRAITS.forEach((trait) => {
    const score = totals[trait] || 0;

    normalizedScores[trait] =
      questionCount > 0
        ? Math.min(
            100,
            Math.round(
              (score / (questionCount * 5)) *
                100
            )
          )
        : 0;
  });

  return normalizedScores;
};

// ==============================
// GET QUESTIONS
// ==============================

const getQuestions = async (req, res) => {
  try {
    const questions =
      assessmentQuestions.map((question) => ({
        id: question.id,
        question: question.question,

        options: question.options.map(
          (option) => ({
            id: option.id,
            text: option.text,
          })
        ),
      }));

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error(
      "Get assessment questions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load assessment",
    });
  }
};

// ==============================
// GET USER ASSESSMENT
// ==============================

const getAssessment = async (req, res) => {
  try {
    const assessment =
      await Assessment.findOne({
        user: req.user._id,
      });

    return res.status(200).json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error(
      "Get assessment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assessment",
    });
  }
};

// ==============================
// SUBMIT ASSESSMENT
// ==============================

const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    // --------------------------------
    // Validate answers object
    // --------------------------------

    if (
      !answers ||
      typeof answers !== "object" ||
      Array.isArray(answers)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Assessment answers are required",
      });
    }

    // --------------------------------
    // Get required question IDs
    // --------------------------------

    const questionIds =
      assessmentQuestions.map(
        (question) => String(question.id)
      );

    // --------------------------------
    // Check missing questions
    // --------------------------------

    const missingQuestions =
      questionIds.filter(
        (questionId) =>
          answers[questionId] === undefined ||
          answers[questionId] === null ||
          String(answers[questionId]).trim() === ""
      );

    if (missingQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please answer all assessment questions",
        missingQuestions,
      });
    }

    // --------------------------------
    // Convert frontend answers
    // into numeric option indexes
    // --------------------------------

    const {
      normalizedAnswers,
      invalidAnswers,
    } = normalizeAnswers(answers);

    // --------------------------------
    // Reject invalid answers
    // --------------------------------

    if (invalidAnswers.length > 0) {
      console.error(
        "Invalid assessment answers:",
        invalidAnswers
      );

      return res.status(400).json({
        success: false,
        message:
          "One or more assessment answers are invalid",
        invalidAnswers,
      });
    }

    // --------------------------------
    // Make sure every question was
    // successfully normalized
    // --------------------------------

    const normalizedQuestionIds =
      Object.keys(normalizedAnswers);

    const stillMissing =
      questionIds.filter(
        (questionId) =>
          !normalizedQuestionIds.includes(
            questionId
          )
      );

    if (stillMissing.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to process all assessment answers",
        missingQuestions: stillMissing,
      });
    }

    // --------------------------------
    // Calculate behavior
    // --------------------------------

    const behaviorScores =
      calculateBehaviorScores(
        normalizedAnswers
      );

    // --------------------------------
    // Save assessment
    // --------------------------------

    const assessment =
      await Assessment.findOneAndUpdate(
        {
          user: req.user._id,
        },
        {
          $set: {
            user: req.user._id,
            answers: normalizedAnswers,
            behaviorScores,
            completed: true,
            completedAt: new Date(),
          },
        },
        {
          upsert: true,
          runValidators: true,
          returnDocument: "after",
        }
      );

    // --------------------------------
    // Success response
    // --------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Behavioral assessment completed",
      assessment,
      behaviorScores,
    });
  } catch (error) {
    console.error(
      "Submit assessment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit assessment",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ==============================
// EXPORTS
// ==============================

module.exports = {
  getQuestions,
  getAssessment,
  submitAssessment,
};