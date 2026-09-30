const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    category: {
      type: String,
      enum: [
        "career-recommendation",
        "ai-assistant",
        "assessment",
        "roadmap",
        "courses",
        "general",
      ],
      default: "general",
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    helpful: {
      type: Boolean,
      default: null,
    },

    adminResponse: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: [
        "new",
        "reviewed",
        "resolved",
      ],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Feedback",
  feedbackSchema
);