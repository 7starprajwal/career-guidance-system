const Assessment = require("../models/Assessment");
const assessmentQuestions = require("../data/assessmentQuestions");

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

  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const question = assessmentQuestions.find(
      (item) => item.id === questionId
    );

    if (!question) return;

    const selectedOption = question.options[Number(optionIndex)];

    if (!selectedOption) return;

    Object.entries(selectedOption.scores).forEach(
      ([trait, score]) => {
        if (Object.prototype.hasOwnProperty.call(totals, trait)) {
          totals[trait] += score;
        }
      }
    );
  });

  const questionCount = assessmentQuestions.length;

  const normalizedScores = {};

  Object.entries(totals).forEach(([trait, score]) => {
    normalizedScores[trait] = Math.min(
      100,
      Math.round((score / (questionCount * 5)) * 100)
    );
  });

  return normalizedScores;
};

// ==============================
// GET QUESTIONS
// ==============================
const getQuestions = async (req, res) => {
  try {
    const questions = assessmentQuestions.map((question) => ({
      id: question.id,
      question: question.question,

      options: question.options.map((option) => ({
        text: option.text,
      })),
    }));

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Get assessment questions error:", error);

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
    const assessment = await Assessment.findOne({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error("Get assessment error:", error);

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

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Assessment answers are required",
      });
    }

    const questionIds = assessmentQuestions.map(
      (question) => question.id
    );

    const missingQuestions = questionIds.filter(
      (questionId) =>
        answers[questionId] === undefined ||
        answers[questionId] === null
    );

    if (missingQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please answer all assessment questions",
        missingQuestions,
      });
    }

    const behaviorScores = calculateBehaviorScores(answers);

    const assessment = await Assessment.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        $set: {
          user: req.user._id,
          answers,
          behaviorScores,
          completed: true,
          completedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Behavioral assessment completed",
      assessment,
      behaviorScores,
    });
  } catch (error) {
    console.error("Submit assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit assessment",
    });
  }
};

module.exports = {
  getQuestions,
  getAssessment,
  submitAssessment,
};