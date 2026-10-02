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

    // Tells us whether this progress belongs
    // to a course or to a roadmap skill.
    source: {
      type: String,
      enum: ["course", "roadmap"],
      default: "course",
      index: true,
    },

    // Used mainly by the Roadmap page.
    // Example:
    // [
    //   { topic: "Functions", completed: true },
    //   { topic: "Arrays and objects", completed: false }
    // ]
    topicProgress: {
      type: [
        {
          topic: {
            type: String,
            required: true,
            trim: true,
          },

          completed: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
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

// One user can have one progress record
// for each course/roadmap item.
progressSchema.index(
  {
    user: 1,
    courseId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Progress", progressSchema);