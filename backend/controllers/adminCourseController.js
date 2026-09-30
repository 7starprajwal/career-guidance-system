const Course = require("../models/Course");

// =====================================================
// GET ALL COURSES
// =====================================================

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error(
      "Admin get courses error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch courses",
    });
  }
};

// =====================================================
// CREATE COURSE
// =====================================================

const createCourse = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      title,
      skill,
      category,
      level,
      duration,
      description,
      topics,
      provider,
      type,
    } = req.body;

    if (
      !courseId ||
      !title ||
      !skill ||
      !category ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course ID, title, skill, category and duration are required",
      });
    }

    const existingCourse =
      await Course.findOne({
        $or: [
          {
            courseId:
              courseId.trim(),
          },
          {
            title:
              title.trim(),
          },
        ],
      });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message:
          "A course with this ID or title already exists",
      });
    }

    const course =
      await Course.create({
        courseId:
          courseId.trim(),

        title:
          title.trim(),

        skill:
          skill.trim(),

        category:
          category.trim(),

        level:
          level || "Beginner",

        duration:
          duration.trim(),

        description:
          description?.trim() || "",

        topics:
          Array.isArray(topics)
            ? topics
            : [],

        provider:
          provider?.trim() ||
          "Career Guidance Learning",

        type:
          type?.trim() ||
          "Learning Path",
      });

    return res.status(201).json({
      success: true,
      message:
        "Course created successfully",
      course,
    });
  } catch (error) {
    console.error(
      "Create course error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create course",
    });
  }
};

// =====================================================
// UPDATE COURSE
// =====================================================

const updateCourse = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      title,
      skill,
      category,
      level,
      duration,
      description,
      topics,
      provider,
      type,
      isActive,
    } = req.body;

    const course =
      await Course.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...(courseId !==
              undefined && {
              courseId:
                courseId.trim(),
            }),

            ...(title !==
              undefined && {
              title:
                title.trim(),
            }),

            ...(skill !==
              undefined && {
              skill:
                skill.trim(),
            }),

            ...(category !==
              undefined && {
              category:
                category.trim(),
            }),

            ...(level !==
              undefined && {
              level,
            }),

            ...(duration !==
              undefined && {
              duration:
                duration.trim(),
            }),

            ...(description !==
              undefined && {
              description:
                description.trim(),
            }),

            ...(Array.isArray(
              topics
            ) && {
              topics,
            }),

            ...(provider !==
              undefined && {
              provider:
                provider.trim(),
            }),

            ...(type !==
              undefined && {
              type:
                type.trim(),
            }),

            ...(isActive !==
              undefined && {
              isActive:
                Boolean(
                  isActive
                ),
            }),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error(
      "Update course error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update course",
    });
  }
};

// =====================================================
// DELETE COURSE
// =====================================================

const deleteCourse = async (
  req,
  res
) => {
  try {
    const course =
      await Course.findByIdAndDelete(
        req.params.id
      );

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Course deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete course error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete course",
    });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};