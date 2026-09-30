const { Readable } = require("stream");

const Profile = require("../models/Profile");
const configureCloudinary = require("../config/cloudinary");

// ==========================================
// GET PROFILE
// ==========================================

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// ==========================================
// CREATE OR UPDATE PROFILE
// ==========================================

const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      phone,
      profileImage,
      education,
      skills,
      interests,
      careerGoal,
      preferredCareer,
      workPreference,
      bio,
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        $set: {
          user: req.user._id,
          phone: phone || "",
          profileImage: profileImage || "",
          education: education || {},
          skills: Array.isArray(skills) ? skills : [],
          interests: Array.isArray(interests)
            ? interests
            : [],
          careerGoal: careerGoal || "",
          preferredCareer: preferredCareer || "",
          workPreference: workPreference || "",
          bio: bio || "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Save profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
    });
  }
};

// ==========================================
// UPLOAD PROFILE IMAGE
// ==========================================

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const cloudinary = configureCloudinary();

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "career-guidance/profile-images",
            resource_type: "image",
            transformation: [
              {
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "face",
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        Readable.from(req.file.buffer).pipe(uploadStream);
      });
    };

    const result = await uploadFromBuffer();

    const profile = await Profile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        $set: {
          user: req.user._id,
          profileImage: result.secure_url,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      profileImage: result.secure_url,
      profile,
    });
  } catch (error) {
    console.error("Profile image upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  uploadProfileImage,
};