const express = require("express");

const {
  createFeedback,
  getMyFeedback,
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");

const router =
  express.Router();

router.post(
  "/",
  protect,
  createFeedback
);

router.get(
  "/my",
  protect,
  getMyFeedback
);

module.exports = router;