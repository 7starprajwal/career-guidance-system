const express = require("express");

const {
  getDashboardAnalytics,
  getUsers,
  getUserById,
  deleteUser,
  getAllFeedback,
  updateFeedback,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router =
  express.Router();

router.use(protect);
router.use(adminOnly);

// Dashboard analytics
router.get(
  "/analytics",
  getDashboardAnalytics
);

// User management
router.get(
  "/users",
  getUsers
);

router.get(
  "/users/:id",
  getUserById
);

router.delete(
  "/users/:id",
  deleteUser
);

// Feedback management
router.get(
  "/feedback",
  getAllFeedback
);

router.patch(
  "/feedback/:id",
  updateFeedback
);

module.exports = router;