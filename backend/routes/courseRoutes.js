const express = require("express");

const Profile = require("../models/Profile");
const Career = require("../models/Career");
const Course = require("../models/Course");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// GET PERSONALIZED COURSES
// =====================================================

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      // =================================================
      // GET LOGGED-IN USER PROFILE
      // =================================================

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

      // =================================================
      // FIND USER'S PREFERRED CAREER
      // =================================================

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

      // =================================================
      // FALLBACK TO FIRST ACTIVE CAREER
      // =================================================

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

      // =================================================
      // USER'S EXISTING SKILLS
      // =================================================

      const userSkills =
        (profile.skills || []).map(
          (skill) =>
            String(skill)
              .trim()
              .toLowerCase()
        );

      // =================================================
      // CAREER REQUIRED SKILLS
      // =================================================

      const requiredSkills =
        career.requiredSkills || [];

      // =================================================
      // GET ACTIVE COURSES FROM MONGODB
      // =================================================

      const courses =
        await Course.find({
          isActive: true,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      // =================================================
      // PERSONALIZE COURSES
      // =================================================

      const personalizedCourses =
        courses
          .filter((course) => {
            const courseSkill =
              String(
                course.skill || ""
              )
                .trim()
                .toLowerCase();

            if (!courseSkill) {
              return false;
            }

            return requiredSkills.some(
              (requiredSkill) => {
                const normalizedRequired =
                  String(
                    requiredSkill || ""
                  )
                    .trim()
                    .toLowerCase();

                if (!normalizedRequired) {
                  return false;
                }

                return (
                  courseSkill ===
                    normalizedRequired ||
                  courseSkill.includes(
                    normalizedRequired
                  ) ||
                  normalizedRequired.includes(
                    courseSkill
                  )
                );
              }
            );
          })
          .map((course) => {
            const normalizedCourseSkill =
              String(
                course.skill || ""
              )
                .trim()
                .toLowerCase();

            const completed =
              userSkills.some(
                (userSkill) =>
                  userSkill ===
                    normalizedCourseSkill ||
                  userSkill.includes(
                    normalizedCourseSkill
                  ) ||
                  normalizedCourseSkill.includes(
                    userSkill
                  )
              );

            return {
              ...course,

              status: completed
                ? "completed"
                : "recommended",
            };
          });

      // =================================================
      // SEPARATE COMPLETED / RECOMMENDED
      // =================================================

      const completedCourses =
        personalizedCourses.filter(
          (course) =>
            course.status ===
            "completed"
        );

      const recommendedCourses =
        personalizedCourses.filter(
          (course) =>
            course.status ===
            "recommended"
        );

      // =================================================
      // RESPONSE
      // =================================================

      return res.status(200).json({
        success: true,

        message:
          "Personalized courses generated successfully",

        career: {
          id: String(career._id),
          name: career.name,
          category:
            career.category,
        },

        userSkills:
          profile.skills || [],

        summary: {
          totalCourses:
            personalizedCourses.length,

          completedCourses:
            completedCourses.length,

          recommendedCourses:
            recommendedCourses.length,
        },

        courses:
          personalizedCourses,
      });
    } catch (error) {
      console.error(
        "Get personalized courses error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate personalized courses",
      });
    }
  }
);

// =====================================================
// ESCAPE REGEX SPECIAL CHARACTERS
// =====================================================

function escapeRegex(value) {
  return String(value || "").replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

module.exports = router;