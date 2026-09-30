const express = require("express");

const {
  updateProgress,
  getProgress,
} = require("../controllers/progressController");

const protect = require("../middleware/authMiddleware");

const router =
  express.Router();

router.get(
  "/",
  protect,
  getProgress
);

router.post(
  "/",
  protect,
  updateProgress
);

module.exports = router;