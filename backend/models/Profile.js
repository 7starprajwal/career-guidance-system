const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    education: {
      tenthPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      tenthPassingYear: {
        type: Number,
        default: null,
      },

      pucPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      pucStream: {
        type: String,
        trim: true,
        default: "",
      },

      pucPassingYear: {
        type: Number,
        default: null,
      },

      degree: {
        type: String,
        trim: true,
        default: "",
      },

      branch: {
        type: String,
        trim: true,
        default: "",
      },

      college: {
        type: String,
        trim: true,
        default: "",
      },

      startYear: {
        type: Number,
        default: null,
      },

      graduationYear: {
        type: Number,
        default: null,
      },

      semester: {
        type: Number,
        min: 1,
        max: 12,
        default: null,
      },

      cgpa: {
        type: Number,
        min: 0,
        max: 10,
        default: null,
      },
    },

    skills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    careerGoal: {
      type: String,
      trim: true,
      default: "",
    },

    preferredCareer: {
      type: String,
      trim: true,
      default: "",
    },

    workPreference: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);