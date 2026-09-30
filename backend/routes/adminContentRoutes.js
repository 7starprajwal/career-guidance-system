const express = require("express");

const {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer,

  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/adminContentController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router =
  express.Router();

router.use(protect);
router.use(adminOnly);

// =====================================
// CAREER MANAGEMENT
// =====================================

router.get(
  "/careers",
  getCareers
);

router.post(
  "/careers",
  createCareer
);

router.patch(
  "/careers/:id",
  updateCareer
);

router.delete(
  "/careers/:id",
  deleteCareer
);

// =====================================
// SKILL MANAGEMENT
// =====================================

router.get(
  "/skills",
  getSkills
);

router.post(
  "/skills",
  createSkill
);

router.patch(
  "/skills/:id",
  updateSkill
);

router.delete(
  "/skills/:id",
  deleteSkill
);

module.exports = router;