const express = require("express");

const {
  getCareers,
  getRecommendations,
} = require("../controllers/careerController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCareers);

router.get(
  "/recommendations",
  protect,
  getRecommendations
);

module.exports = router;