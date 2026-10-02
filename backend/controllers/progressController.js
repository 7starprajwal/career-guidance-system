const Progress = require("../models/Progress");

const updateProgress = async (req, res) => {
  try {
    const {
      career,
      skill,
      courseId,
      progress,
      source,
      topicProgress,
    } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!career || !skill || !courseId || progress === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Career, skill, courseId and progress are required",
      });
    }

    const numericProgress = Number(progress);

    if (
      Number.isNaN(numericProgress) ||
      numericProgress < 0 ||
      numericProgress > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be a number between 0 and 100",
      });
    }

    // --------------------------------------------------
    // SOURCE
    // --------------------------------------------------

    const normalizedSource =
      source === "roadmap" ? "roadmap" : "course";

    // --------------------------------------------------
    // STATUS
    // --------------------------------------------------

    let status = "not-started";

    if (numericProgress > 0 && numericProgress < 100) {
      status = "in-progress";
    }

    if (numericProgress === 100) {
      status = "completed";
    }

    // --------------------------------------------------
    // COMPLETED DATE
    // --------------------------------------------------

    let completedAt = null;

    if (status === "completed") {
      completedAt = new Date();
    }

    // --------------------------------------------------
    // NORMALIZE TOPIC PROGRESS
    // --------------------------------------------------

    let normalizedTopicProgress = [];

    if (Array.isArray(topicProgress)) {
      normalizedTopicProgress = topicProgress
        .filter((item) => item && item.topic)
        .map((item) => ({
          topic: String(item.topic).trim(),
          completed: Boolean(item.completed),
        }));
    }

    // --------------------------------------------------
    // UPDATE / CREATE PROGRESS
    // --------------------------------------------------

    const progressRecord = await Progress.findOneAndUpdate(
      {
        user: req.user._id,
        courseId,
      },
      {
        $set: {
          user: req.user._id,
          career: career.trim(),
          skill: skill.trim(),
          courseId: courseId.trim(),
          source: normalizedSource,
          topicProgress: normalizedTopicProgress,
          progress: numericProgress,
          status,
          completedAt,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Learning progress updated successfully",
      progress: progressRecord,
    });
  } catch (error) {
    console.error("Update progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update learning progress",
    });
  }
};

// ======================================================
// GET USER PROGRESS
// ======================================================

const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      user: req.user._id,
    })
      .sort({
        updatedAt: -1,
      })
      .lean();

    // --------------------------------------------------
    // SEPARATE COURSE AND ROADMAP PROGRESS
    // --------------------------------------------------

    const roadmapProgress = progress.filter(
      (item) => item.source === "roadmap"
    );

    const courseProgress = progress.filter(
      (item) => item.source !== "roadmap"
    );

    // --------------------------------------------------
    // COURSE SUMMARY
    // --------------------------------------------------

    const totalCourses = courseProgress.length;

    const completedCourses = courseProgress.filter(
      (item) => item.status === "completed"
    ).length;

    const inProgressCourses = courseProgress.filter(
      (item) => item.status === "in-progress"
    ).length;

    const courseOverallProgress =
      totalCourses === 0
        ? 0
        : Math.round(
            courseProgress.reduce(
              (sum, item) => sum + Number(item.progress || 0),
              0
            ) / totalCourses
          );

    // --------------------------------------------------
    // ROADMAP SUMMARY
    // --------------------------------------------------

    const totalRoadmapSkills = roadmapProgress.length;

    const completedRoadmapSkills = roadmapProgress.filter(
      (item) => item.status === "completed"
    ).length;

    const inProgressRoadmapSkills = roadmapProgress.filter(
      (item) => item.status === "in-progress"
    ).length;

    const roadmapOverallProgress =
      totalRoadmapSkills === 0
        ? 0
        : Math.round(
            roadmapProgress.reduce(
              (sum, item) => sum + Number(item.progress || 0),
              0
            ) / totalRoadmapSkills
          );

    // --------------------------------------------------
    // COMBINED LEARNING PROGRESS
    // --------------------------------------------------

    const totalLearningRecords = progress.length;

    const overallProgress =
      totalLearningRecords === 0
        ? 0
        : Math.round(
            progress.reduce(
              (sum, item) => sum + Number(item.progress || 0),
              0
            ) / totalLearningRecords
          );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      summary: {
        // Existing course values
        totalCourses,
        completedCourses,
        inProgressCourses,
        courseOverallProgress,

        // Roadmap values
        totalRoadmapSkills,
        completedRoadmapSkills,
        inProgressRoadmapSkills,
        roadmapOverallProgress,

        // Combined
        overallProgress,
      },

      progress,

      courseProgress,

      roadmapProgress,
    });
  } catch (error) {
    console.error("Get progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning progress",
    });
  }
};

module.exports = {
  updateProgress,
  getProgress,
};