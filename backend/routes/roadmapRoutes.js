const express = require("express");

const Profile = require("../models/Profile");
const Career = require("../models/Career");

const protect = require("../middleware/authMiddleware");

const {
  generateSkillGap,
} = require("../services/skillGapService");

const {
  createRoadmap,
} = require("../services/roadmapService");

const router = express.Router();

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const profile =
        await Profile.findOne({
          user: req.user._id,
        }).lean();

      if (!profile) {
        return res.status(404).json({
          success: false,
          message:
            "Please complete your profile first",
        });
      }

      let career =
        await Career.findOne({
          name: {
            $regex:
              `^${escapeRegex(
                profile.preferredCareer || ""
              )}$`,
            $options: "i",
          },

          isActive: true,
        }).lean();

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

      const skillGap =
        generateSkillGap(
          profile.skills || [],
          career
        );

      const roadmap =
        createRoadmap(
          career.name,
          skillGap
        );

      return res.status(200).json({
        success: true,

        message:
          "Personalized roadmap generated successfully",

        roadmap: {
          ...roadmap,

          careerId:
            String(career._id),
        },
      });
    } catch (error) {
      console.error(
        "Roadmap error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate roadmap",
      });
    }
  }
);

function escapeRegex(value) {
  return String(value || "").replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

module.exports = router;