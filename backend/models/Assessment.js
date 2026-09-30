const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    answers: {
      type: Map,
      of: Number,
      default: {},
    },

    behaviorScores: {
      problemSolving: {
        type: Number,
        default: 0,
      },

      analyticalThinking: {
        type: Number,
        default: 0,
      },

      adaptability: {
        type: Number,
        default: 0,
      },

      communication: {
        type: Number,
        default: 0,
      },

      teamwork: {
        type: Number,
        default: 0,
      },

      creativity: {
        type: Number,
        default: 0,
      },

      leadership: {
        type: Number,
        default: 0,
      },

      logicalThinking: {
        type: Number,
        default: 0,
      },
    },

    completed: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Assessment", assessmentSchema);