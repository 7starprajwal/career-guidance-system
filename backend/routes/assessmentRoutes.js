const express = require("express");

const {
  getQuestions,
  getAssessment,
  submitAssessment,
} = require("../controllers/assessmentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/questions", protect, getQuestions);

router.get("/", protect, getAssessment);

router.post("/submit", protect, submitAssessment);

module.exports = router;