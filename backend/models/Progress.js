const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    career: {
      type: String,
      required: true,
      trim: true,
    },

    skill: {
      type: String,
      required: true,
      trim: true,
    },

    courseId: {
      type: String,
      required: true,
      trim: true,
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "not-started",
        "in-progress",
        "completed",
      ],
      default: "not-started",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index(
  {
    user: 1,
    courseId: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.model(
    "Progress",
    progressSchema
  );