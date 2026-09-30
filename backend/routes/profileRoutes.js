const express = require("express");

const {
  getProfile,
  createOrUpdateProfile,
  uploadProfileImage,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================

router.get(
  "/",
  protect,
  getProfile
);

// ==========================================
// CREATE / UPDATE PROFILE
// ==========================================

router.post(
  "/",
  protect,
  createOrUpdateProfile
);

// ==========================================
// UPLOAD PROFILE IMAGE
// ==========================================

router.post(
  "/image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;