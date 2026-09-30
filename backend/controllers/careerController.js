const Profile = require("../models/Profile");
const Assessment = require("../models/Assessment");
const Career = require("../models/Career");

const {
  generateRecommendations,
} = require("../services/recommendationService");

const {
  getModelInformation,
} = require("../ml/predictCareer");

// GET ALL ACTIVE CAREERS
const getCareers = async (
  req,
  res
) => {
  try {
    const careers =
      await Career.find({
        isActive: true,
      })
        .sort({
          name: 1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: careers.length,
      careers,
    });
  } catch (error) {
    console.error(
      "Get careers error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch careers",
    });
  }
};

// GET CAREER RECOMMENDATIONS
const getRecommendations =
  async (
    req,
    res
  ) => {
    try {
      const profile =
        await Profile.findOne({
          user: req.user._id,
        }).lean();

      const assessment =
        await Assessment.findOne({
          user: req.user._id,
        }).lean();

      if (!profile) {
        return res.status(404).json({
          success: false,
          message:
            "Please complete your profile before getting career recommendations",
        });
      }

      if (
        !assessment ||
        !assessment.completed
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please complete the behavioral assessment before getting career recommendations",
        });
      }

      const careers =
        await Career.find({
          isActive: true,
        }).lean();

      if (!careers.length) {
        return res.status(404).json({
          success: false,
          message:
            "No active careers are available",
        });
      }

      const recommendations =
        generateRecommendations(
          profile,
          assessment,
          careers
        );

      const modelInformation =
        getModelInformation();

      return res.status(200).json({
        success: true,

        message:
          "Career recommendations generated successfully",

        profileSummary: {
          skills:
            profile.skills || [],

          interests:
            profile.interests || [],

          careerGoal:
            profile.careerGoal || "",

          preferredCareer:
            profile.preferredCareer ||
            "",

          education:
            profile.education || {},
        },

        behaviorAnalysis: {
          completed:
            assessment.completed,

          scores:
            assessment.behaviorScores ||
            {},

          completedAt:
            assessment.completedAt,
        },

        machineLearning: {
          algorithm:
            modelInformation.algorithm,

          trainingSamples:
            modelInformation.trainingSamples,

          featureCount:
            modelInformation.featureCount,

          k:
            modelInformation.k,

          validationAccuracy:
            modelInformation.accuracy,

          features:
            modelInformation.features,
        },

        recommendations,
      });
    } catch (error) {
      console.error(
        "Career recommendation error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate career recommendations",
      });
    }
  };

module.exports = {
  getCareers,
  getRecommendations,
};