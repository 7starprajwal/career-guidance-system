const express = require("express");

const {
  chatWithCareerAssistant,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router =
  express.Router();

router.post(
  "/chat",
  protect,
  chatWithCareerAssistant
);

module.exports = router;