const Profile = require("../models/Profile");
const Assessment = require("../models/Assessment");
const Progress = require("../models/Progress");
const Career = require("../models/Career");

const {
  generateRecommendations,
} = require("../services/recommendationService");

const {
  generateSkillGap,
} = require("../services/skillGapService");

const {
  createRoadmap,
} = require("../services/roadmapService");

const {
  generateCareerResponse,
} = require("../services/aiService");


const chatWithCareerAssistant =
  async (req, res) => {
    try {
      const { message } = req.body;


      // Validate message
      if (
        !message ||
        typeof message !== "string" ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }


      if (
        message.trim().length > 2000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Message cannot exceed 2000 characters",
        });
      }


      // Get user profile
      const profile =
        await Profile.findOne({
          user: req.user._id,
        }).lean();


      if (!profile) {
        return res.status(404).json({
          success: false,
          message:
            "Please complete your profile before using the AI career assistant",
        });
      }


      // Get behavioral assessment
      const assessment =
        await Assessment.findOne({
          user: req.user._id,
        }).lean();


      // Get learning progress
      const progressRecords =
        await Progress.find({
          user: req.user._id,
        }).lean();


      // Get active careers from MongoDB
      const careers =
        await Career.find({
          isActive: true,
        })
          .sort({
            name: 1,
          })
          .lean();


      if (!careers.length) {
        return res.status(404).json({
          success: false,
          message:
            "No active careers are available",
        });
      }


      // Generate ML recommendations
      let recommendations = [];

      if (assessment?.completed) {
        recommendations =
          generateRecommendations(
            profile,
            assessment,
            careers
          );
      }


      // Find user's preferred career
      let career = null;

      if (profile.preferredCareer) {
        const escapedCareer =
          escapeRegex(
            profile.preferredCareer
          );

        career =
          await Career.findOne({
            name: {
              $regex:
                `^${escapedCareer}$`,
              $options: "i",
            },
            isActive: true,
          }).lean();
      }


      // If preferred career is not found,
      // use the top ML recommendation
      if (!career && recommendations.length) {
        career =
          careers.find(
            (item) =>
              item.name ===
              recommendations[0].careerName
          );
      }


      // Final fallback
      if (!career) {
        career = careers[0];
      }


      // Skill gap analysis
      const skillGap =
        generateSkillGap(
          profile.skills || [],
          career
        );


      // Personalized roadmap
      const roadmap =
        createRoadmap(
          career.name,
          skillGap
        );


      // Learning progress statistics
      const completedCourses =
        progressRecords.filter(
          (item) =>
            item.status === "completed"
        ).length;


      const inProgressCourses =
        progressRecords.filter(
          (item) =>
            item.status === "in-progress"
        ).length;


      const overallProgress =
        progressRecords.length === 0
          ? 0
          : Math.round(
              progressRecords.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.progress || 0
                  ),
                0
              ) /
                progressRecords.length
            );


      const progress = {
        summary: {
          totalCourses:
            progressRecords.length,

          completedCourses,

          inProgressCourses,

          overallProgress,
        },

        records:
          progressRecords,
      };


      // Generate AI response using Gemini
      const answer =
        await generateCareerResponse({
          message: message.trim(),

          profile: {
            ...profile,
            name: req.user.name,
          },

          assessment,

          recommendations,

          skillGap,

          roadmap,

          progress,
        });


      return res.status(200).json({
        success: true,

        message:
          "AI career response generated successfully",

        answer,

        context: {
          career:
            career.name,

          careerId:
            String(career._id),

          skillGapReadiness:
            skillGap.readiness,

          roadmapProgress:
            roadmap.overallProgress,

          learningProgress:
            overallProgress,

          mlRecommendation:
            recommendations[0]
              ?.careerName || null,

          recommendationCount:
            recommendations.length,
        },
      });
    } catch (error) {
      console.error(
        "AI career assistant error:",
        error.response?.data ||
          error.message ||
          error
      );


      // Gemini authentication error
      if (
        error.status === 401 ||
        error.response?.status === 401
      ) {
        return res.status(500).json({
          success: false,
          message:
            "AI service authentication failed. Check the server Gemini configuration.",
        });
      }


      // Gemini rate limit / temporary availability
      if (
        error.status === 429 ||
        error.response?.status === 429
      ) {
        return res.status(503).json({
          success: false,
          message:
            "AI service is temporarily unavailable. Please try again later.",
        });
      }


      return res.status(500).json({
        success: false,
        message:
          "Failed to generate AI career response",
      });
    }
  };


// Escape special regex characters
function escapeRegex(value) {
  return String(value || "").replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


module.exports = {
  chatWithCareerAssistant,
};