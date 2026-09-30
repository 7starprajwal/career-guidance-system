const Feedback = require("../models/Feedback");

// CREATE FEEDBACK
const createFeedback = async (
  req,
  res
) => {
  try {
    const {
      rating,
      category,
      message,
      helpful,
    } = req.body;

    if (
      rating === undefined ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating and message are required",
      });
    }

    const numericRating =
      Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5",
      });
    }

    if (
      message.trim().length < 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Feedback message must contain at least 5 characters",
      });
    }

    const feedback =
      await Feedback.create({
        user: req.user._id,
        rating: numericRating,
        category:
          category || "general",
        message:
          message.trim(),
        helpful:
          typeof helpful ===
          "boolean"
            ? helpful
            : null,
      });

    return res.status(201).json({
      success: true,
      message:
        "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error(
      "Create feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit feedback",
    });
  }
};

// GET MY FEEDBACK
const getMyFeedback = async (
  req,
  res
) => {
  try {
    const feedback =
      await Feedback.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error(
      "Get my feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch feedback",
    });
  }
};

module.exports = {
  createFeedback,
  getMyFeedback,
};