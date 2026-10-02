const express = require("express");

const Profile = require("../models/Profile");
const Career = require("../models/Career");
const Progress = require("../models/Progress");

const protect = require("../middleware/authMiddleware");

const {
  generateSkillGap,
} = require("../services/skillGapService");

const {
  createRoadmap,
} = require("../services/roadmapService");

const router = express.Router();

/*
============================================================
GET PERSONALIZED ROADMAP
============================================================
*/

router.get("/", protect, async (req, res) => {
  try {
    // ------------------------------------------------------
    // 1. GET USER PROFILE
    // ------------------------------------------------------

    const profile = await Profile.findOne({
      user: req.user._id,
    }).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // ------------------------------------------------------
    // 2. GET PREFERRED CAREER
    // ------------------------------------------------------
    // Current Profile structure uses:
    //
    // careerPreferences.preferredCareer
    //
    // The second option keeps compatibility with older data.
    // ------------------------------------------------------

    const preferredCareer =
      profile?.careerPreferences?.preferredCareer ||
      profile?.preferredCareer ||
      "";

    if (!preferredCareer) {
      return res.status(400).json({
        success: false,
        message:
          "Please select your preferred career in your profile",
      });
    }

    // ------------------------------------------------------
    // 3. FIND CAREER
    // ------------------------------------------------------

    let career = await Career.findOne({
      name: {
        $regex: `^${escapeRegex(preferredCareer)}$`,
        $options: "i",
      },
      isActive: true,
    }).lean();

    // ------------------------------------------------------
    // FALLBACK
    // ------------------------------------------------------

    if (!career) {
      career = await Career.findOne({
        isActive: true,
      }).lean();
    }

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "No active career found",
      });
    }

    // ------------------------------------------------------
    // 4. GET STUDENT SKILLS
    // ------------------------------------------------------

    const studentSkills = Array.isArray(profile.skills)
      ? profile.skills
      : [];

    // ------------------------------------------------------
    // 5. GENERATE SKILL GAP
    // ------------------------------------------------------

    const skillGap = generateSkillGap(
      studentSkills,
      career
    );

    // ------------------------------------------------------
    // 6. GENERATE BASE ROADMAP
    // ------------------------------------------------------

    const generatedRoadmap = createRoadmap(
      career.name,
      skillGap
    );

    // ------------------------------------------------------
    // 7. NORMALIZE ROADMAP
    // ------------------------------------------------------

    const roadmapItems = Array.isArray(generatedRoadmap)
      ? generatedRoadmap
      : Array.isArray(generatedRoadmap?.roadmap)
        ? generatedRoadmap.roadmap
        : [];

    // ------------------------------------------------------
    // 8. GET SAVED ROADMAP PROGRESS
    // ------------------------------------------------------

    const savedProgress = await Progress.find({
      user: req.user._id,
      source: "roadmap",
      career: career.name,
    })
      .lean();

    // ------------------------------------------------------
    // 9. CREATE QUICK LOOKUP MAP
    // ------------------------------------------------------

    const savedProgressMap = new Map();

    savedProgress.forEach((item) => {
      const key = normalizeSkill(item.skill);

      if (key) {
        savedProgressMap.set(key, item);
      }
    });

    // ------------------------------------------------------
    // 10. MERGE SAVED PROGRESS INTO ROADMAP
    // ------------------------------------------------------

    const roadmap = roadmapItems.map((item) => {
      const skill = item?.skill || "";

      const saved = savedProgressMap.get(
        normalizeSkill(skill)
      );

      // -----------------------------------------------
      // No saved progress
      // -----------------------------------------------

      if (!saved) {
        return {
          ...item,
          progress: normalizeProgress(item?.progress),
          status:
            item?.status || "not-started",
          topicProgress: Array.isArray(item?.topicProgress)
            ? item.topicProgress
            : [],
        };
      }

      // -----------------------------------------------
      // Saved progress exists
      // -----------------------------------------------

      return {
        ...item,

        progress: normalizeProgress(
          saved.progress
        ),

        status:
          saved.status ||
          getStatusFromProgress(saved.progress),

        topicProgress: Array.isArray(
          saved.topicProgress
        )
          ? saved.topicProgress
          : [],
      };
    });

    // ------------------------------------------------------
    // 11. CALCULATE ROADMAP SUMMARY
    // ------------------------------------------------------

    const totalSteps = roadmap.length;

    const completedSteps = roadmap.filter(
      (item) => item.status === "completed"
    ).length;

    const remainingSteps = Math.max(
      totalSteps - completedSteps,
      0
    );

    const overallProgress =
      totalSteps === 0
        ? 0
        : Math.round(
            roadmap.reduce(
              (sum, item) =>
                sum + normalizeProgress(item.progress),
              0
            ) / totalSteps
          );

    // ------------------------------------------------------
    // 12. RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Personalized roadmap generated successfully",

      roadmap: {
        career: career.name,

        overallProgress,

        totalSteps,

        completedSteps,

        remainingSteps,

        roadmap,

        careerId: career._id,

        success: true,
      },
    });
  } catch (error) {
    console.error(
      "Roadmap generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate personalized roadmap",
    });
  }
});

/*
============================================================
HELPER FUNCTIONS
============================================================
*/

/*
Escape special characters before using a string
inside a MongoDB regular expression.
*/

function escapeRegex(value) {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

/*
Normalize skill names so:

JavaScript
javascript
 JAVASCRIPT

all match the same saved progress record.
*/

function normalizeSkill(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/*
Keep progress safely between 0 and 100.
*/

function normalizeProgress(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(
    Math.max(number, 0),
    100
  );
}

/*
Convert progress percentage into a status.
*/

function getStatusFromProgress(progress) {
  const value = normalizeProgress(progress);

  if (value === 100) {
    return "completed";
  }

  if (value > 0) {
    return "in-progress";
  }

  return "not-started";
}

module.exports = router;