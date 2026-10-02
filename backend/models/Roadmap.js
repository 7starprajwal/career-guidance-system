const mongoose = require("mongoose");

// ============================================================
// ROADMAP STEP SCHEMA
// ============================================================

const roadmapStepSchema =
  new mongoose.Schema(
    {
      skill: {
        type: String,
        required: true,
        trim: true,
      },

      phase: {
        type: Number,
        required: true,
        min: 1,
      },

      duration: {
        type: String,
        required: true,
        trim: true,
      },

      level: {
        type: String,
        enum: [
          "Beginner",
          "Intermediate",
          "Advanced",
        ],
        default: "Beginner",
      },

      prerequisites: {
        type: [String],
        default: [],
      },

      topics: {
        type: [String],
        default: [],
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

      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      startedAt: {
        type: Date,
        default: null,
      },

      completedAt: {
        type: Date,
        default: null,
      },
    },
    {
      _id: true,
    }
  );

// ============================================================
// ROADMAP SCHEMA
// ============================================================

const roadmapSchema =
  new mongoose.Schema(
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

      careerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Career",
        default: null,
      },

      overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      totalSteps: {
        type: Number,
        default: 0,
        min: 0,
      },

      completedSteps: {
        type: Number,
        default: 0,
        min: 0,
      },

      remainingSteps: {
        type: Number,
        default: 0,
        min: 0,
      },

      roadmap: {
        type: [roadmapStepSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

// ============================================================
// EXPORT
// ============================================================

module.exports =
  mongoose.model(
    "Roadmap",
    roadmapSchema
  );