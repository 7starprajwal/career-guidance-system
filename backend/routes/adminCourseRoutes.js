const express = require("express");

const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/adminCourseController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router =
  express.Router();

router.use(protect);
router.use(adminOnly);

// =====================================================
// COURSE MANAGEMENT
// =====================================================

router.get(
  "/",
  getCourses
);

router.post(
  "/",
  createCourse
);

router.patch(
  "/:id",
  updateCourse
);

router.delete(
  "/:id",
  deleteCourse
);

module.exports = router;