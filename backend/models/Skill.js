const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
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
      trim: true,
      default: "",
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
  mongoose.model("Skill", skillSchema);