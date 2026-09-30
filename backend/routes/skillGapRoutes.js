const express = require("express");

const Profile = require("../models/Profile");
const Career = require("../models/Career");

const protect = require("../middleware/authMiddleware");

const {
  generateSkillGap,
} = require("../services/skillGapService");

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

      return res.status(200).json({
        success: true,

        message:
          "Skill gap analysis generated successfully",

        skillGap: {
          ...skillGap,

          careerId:
            String(career._id),
        },
      });
    } catch (error) {
      console.error(
        "Skill gap error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate skill gap analysis",
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