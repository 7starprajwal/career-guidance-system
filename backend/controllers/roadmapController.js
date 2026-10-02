const Profile = require("../models/Profile");
const Career = require("../models/Career");

const {
  generateSkillGap,
} = require("../services/skillGapService");

const {
  createRoadmap,
} = require("../services/roadmapService");

// ============================================================
// GET PERSONALIZED ROADMAP
// GET /api/roadmap
// ============================================================

const getRoadmap = async (req, res) => {
  try {
    // --------------------------------------------------------
    // GET USER ID
    // --------------------------------------------------------

    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // --------------------------------------------------------
    // GET STUDENT PROFILE
    // --------------------------------------------------------

    const profile =
      await Profile.findOne({
        user: userId,
      }).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message:
          "Please complete your profile first",
      });
    }

    // --------------------------------------------------------
    // FIND TARGET CAREER
    // --------------------------------------------------------

    const preferredCareer =
      profile?.preferredCareer ||
      profile?.careerPreferences
        ?.preferredCareer ||
      "";

    let career = null;

    // First try user's preferred career
    if (preferredCareer) {
      career =
        await Career.findOne({
          name: {
            $regex:
              `^${escapeRegex(
                preferredCareer
              )}$`,
            $options: "i",
          },
          isActive: true,
        }).lean();
    }

    // --------------------------------------------------------
    // FALLBACK TO ACTIVE CAREER
    // --------------------------------------------------------

    if (!career) {
      career =
        await Career.findOne({
          isActive: true,
        })
          .sort({
            name: 1,
          })
          .lean();
    }

    if (!career) {
      return res.status(404).json({
        success: false,
        message:
          "No active career is available",
      });
    }

    // --------------------------------------------------------
    // GENERATE SKILL GAP
    // --------------------------------------------------------

    const studentSkills =
      Array.isArray(profile.skills)
        ? profile.skills
        : [];

    const skillGap =
      await generateSkillGap(
        studentSkills,
        career
      );

    // --------------------------------------------------------
    // CREATE PERSONALIZED ROADMAP
    // --------------------------------------------------------

    const roadmap =
      createRoadmap(
        career.name,
        skillGap
      );

    // --------------------------------------------------------
    // ADD CAREER ID
    // --------------------------------------------------------

    const responseRoadmap = {
      ...roadmap,

      careerId:
        String(career._id),

      success: true,
    };

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Personalized roadmap generated successfully",

      roadmap:
        responseRoadmap,
    });
  } catch (error) {
    console.error(
      "Get roadmap error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate personalized roadmap",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ============================================================
// ESCAPE REGEX
// ============================================================

function escapeRegex(value) {
  return String(value || "").replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getRoadmap,
};