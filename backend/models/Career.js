const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    behavioralTraits: {
      type: [String],
      default: [],
    },

    preferredEducation: {
      type: [String],
      default: [],
    },

    learningPath: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Career", careerSchema);