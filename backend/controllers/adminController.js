const User = require("../models/User");
const Profile = require("../models/Profile");
const Assessment = require("../models/Assessment");
const Feedback = require("../models/Feedback");
const Progress = require("../models/Progress");

// ============================================================
// GET ADMIN DASHBOARD ANALYTICS
// ============================================================

const getDashboardAnalytics = async (
  req,
  res
) => {
  const startTime = Date.now();

  try {
    // --------------------------------------------------------
    // RUN ALL ANALYTICS QUERIES IN PARALLEL
    // --------------------------------------------------------

    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      completedAssessments,
      totalFeedback,
      totalProgressRecords,
      completedCourses,
      feedbackStats,
      feedbackByCategory,
      usersByMonth,
    ] = await Promise.all([
      // USERS
      User.countDocuments(),

      User.countDocuments({
        role: "student",
      }),

      User.countDocuments({
        role: "admin",
      }),

      // ASSESSMENTS
      Assessment.countDocuments({
        completed: true,
      }),

      // FEEDBACK
      Feedback.countDocuments(),

      // PROGRESS
      Progress.countDocuments(),

      Progress.countDocuments({
        status: "completed",
      }),

      // AVERAGE FEEDBACK RATING
      Feedback.aggregate([
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
          },
        },
      ]),

      // FEEDBACK BY CATEGORY
      Feedback.aggregate([
        {
          $group: {
            _id: "$category",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // USER REGISTRATIONS BY MONTH
      User.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),
    ]);

    // --------------------------------------------------------
    // CALCULATE AVERAGE RATING SAFELY
    // --------------------------------------------------------

    let averageRating = 0;

    if (
      feedbackStats.length > 0 &&
      feedbackStats[0].averageRating !== null &&
      feedbackStats[0].averageRating !== undefined
    ) {
      averageRating = Number(
        Number(
          feedbackStats[0].averageRating
        ).toFixed(2)
      );
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    const responseData = {
      success: true,

      analytics: {
        users: {
          total: totalUsers,
          students: totalStudents,
          admins: totalAdmins,
        },

        assessments: {
          completed:
            completedAssessments,
        },

        feedback: {
          total: totalFeedback,
          averageRating,
          byCategory:
            feedbackByCategory,
        },

        learning: {
          totalProgressRecords,
          completedCourses,
        },

        registrations:
          usersByMonth,
      },
    };

    console.log(
      `Admin analytics completed in ${
        Date.now() - startTime
      }ms`
    );

    return res.status(200).json(
      responseData
    );
  } catch (error) {
    console.error(
      "Admin analytics error:",
      error
    );

    console.error(
      `Admin analytics failed after ${
        Date.now() - startTime
      }ms`
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch admin analytics",
    });
  }
};

// ============================================================
// GET ALL USERS
// ============================================================

const getUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        })
        .lean();

    const usersWithProfiles =
      await Promise.all(
        users.map(async (user) => {
          const profile =
            await Profile.findOne({
              user: user._id,
            })
              .select(
                "education skills interests careerGoal preferredCareer"
              )
              .lean();

          return {
            ...user,

            profile:
              profile || null,
          };
        })
      );

    return res.status(200).json({
      success: true,

      count:
        usersWithProfiles.length,

      users:
        usersWithProfiles,
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch users",
    });
  }
};

// ============================================================
// GET SINGLE USER
// ============================================================

const getUserById = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      )
        .select("-password")
        .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    const profile =
      await Profile.findOne({
        user: user._id,
      }).lean();

    const assessment =
      await Assessment.findOne({
        user: user._id,
      }).lean();

    const progress =
      await Progress.find({
        user: user._id,
      })
        .sort({
          updatedAt: -1,
        })
        .lean();

    const feedback =
      await Feedback.find({
        user: user._id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,

      user: {
        ...user,

        profile:
          profile || null,

        assessment:
          assessment || null,

        progress,

        feedback,
      },
    });
  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch user",
    });
  }
};


// ============================================================
// DELETE USER
// ============================================================

const deleteUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    if (
      String(user._id) ===
      String(req.user._id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own admin account",
      });
    }

    await Promise.all([
      User.findByIdAndDelete(
        user._id
      ),

      Profile.deleteOne({
        user: user._id,
      }),

      Assessment.deleteOne({
        user: user._id,
      }),

      Progress.deleteMany({
        user: user._id,
      }),

      Feedback.deleteMany({
        user: user._id,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message:
        "User and related data deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete user",
    });
  }
};

// ============================================================
// GET ALL FEEDBACK
// ============================================================

const getAllFeedback = async (
  req,
  res
) => {
  try {
    const feedback =
      await Feedback.find()
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,

      count:
        feedback.length,

      feedback,
    });
  } catch (error) {
    console.error(
      "Get all feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch feedback",
    });
  }
};

// ============================================================
// UPDATE FEEDBACK STATUS
// ============================================================

const updateFeedback =
  async (
    req,
    res
  ) => {
    try {
      const {
        status,
        adminResponse,
      } = req.body;

      const allowedStatuses = [
        "new",
        "reviewed",
        "resolved",
      ];

      if (
        status &&
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid feedback status",
        });
      }

      const feedback =
        await Feedback.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...(status
                ? {
                    status,
                  }
                : {}),

              ...(adminResponse !==
              undefined
                ? {
                    adminResponse:
                      adminResponse.trim(),
                  }
                : {}),
            },
          },
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "user",
          "name email role"
        );

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message:
            "Feedback not found",
        });
      }

      return res.status(200).json({
        success: true,

        message:
          "Feedback updated successfully",

        feedback,
      });
    } catch (error) {
      console.error(
        "Update feedback error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update feedback",
      });
    }
  };

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getDashboardAnalytics,
  getUsers,
  getUserById,
  deleteUser,
  getAllFeedback,
  updateFeedback,
};