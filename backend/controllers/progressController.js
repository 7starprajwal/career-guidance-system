const Progress = require("../models/Progress");

const updateProgress = async (
  req,
  res
) => {
  try {
    const {
      career,
      skill,
      courseId,
      progress,
    } = req.body;

    if (
      !career ||
      !skill ||
      !courseId ||
      progress === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Career, skill, courseId and progress are required",
      });
    }

    const numericProgress =
      Number(progress);

    if (
      Number.isNaN(
        numericProgress
      ) ||
      numericProgress < 0 ||
      numericProgress > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Progress must be a number between 0 and 100",
      });
    }

    let status =
      "not-started";

    if (
      numericProgress > 0 &&
      numericProgress < 100
    ) {
      status = "in-progress";
    }

    if (
      numericProgress === 100
    ) {
      status = "completed";
    }

    const completedAt =
      status === "completed"
        ? new Date()
        : null;

    const progressRecord =
      await Progress.findOneAndUpdate(
        {
          user: req.user._id,
          courseId,
        },
        {
          $set: {
            user: req.user._id,
            career,
            skill,
            courseId,
            progress:
              numericProgress,
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

    return res.status(200).json({
      success: true,

      message:
        "Learning progress updated successfully",

      progress:
        progressRecord,
    });
  } catch (error) {
    console.error(
      "Update progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update learning progress",
    });
  }
};

const getProgress = async (
  req,
  res
) => {
  try {
    const progress =
      await Progress.find({
        user: req.user._id,
      })
        .sort({
          updatedAt: -1,
        })
        .lean();

    const totalCourses =
      progress.length;

    const completedCourses =
      progress.filter(
        (item) =>
          item.status ===
          "completed"
      ).length;

    const inProgressCourses =
      progress.filter(
        (item) =>
          item.status ===
          "in-progress"
      ).length;

    const overallProgress =
      totalCourses === 0
        ? 0
        : Math.round(
            progress.reduce(
              (sum, item) =>
                sum +
                item.progress,
              0
            ) /
              totalCourses
          );

    return res.status(200).json({
      success: true,

      summary: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        overallProgress,
      },

      progress,
    });
  } catch (error) {
    console.error(
      "Get progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch learning progress",
    });
  }
};

module.exports = {
  updateProgress,
  getProgress,
};