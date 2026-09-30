const calculateAverageRating = (
  feedback = []
) => {
  if (!feedback.length) {
    return 0;
  }

  const total =
    feedback.reduce(
      (sum, item) =>
        sum +
        Number(
          item.rating || 0
        ),
      0
    );

  return Number(
    (
      total / feedback.length
    ).toFixed(1)
  );
};


const groupFeedbackByCategory = (
  feedback = []
) => {
  const grouped = {};

  feedback.forEach(
    (item) => {
      const category =
        item.category ||
        "general";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(
        item
      );
    }
  );

  return grouped;
};


const getFeedbackSummary = (
  feedback = []
) => {
  const averageRating =
    calculateAverageRating(
      feedback
    );

  const grouped =
    groupFeedbackByCategory(
      feedback
    );

  const positiveFeedback =
    feedback.filter(
      (item) =>
        Number(item.rating) >= 4
    ).length;

  const negativeFeedback =
    feedback.filter(
      (item) =>
        Number(item.rating) <= 2
    ).length;

  return {
    total:
      feedback.length,

    averageRating,

    positiveFeedback,

    negativeFeedback,

    byCategory:
      Object.entries(
        grouped
      ).map(
        ([category, items]) => ({
          category,
          count: items.length,
        })
      ),
  };
};


const validateFeedback = ({
  rating,
  category,
  message,
}) => {
  const numericRating =
    Number(rating);

  if (
    Number.isNaN(
      numericRating
    ) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return {
      valid: false,
      message:
        "Rating must be between 1 and 5",
    };
  }


  if (!category) {
    return {
      valid: false,
      message:
        "Feedback category is required",
    };
  }


  if (
    message &&
    String(message).length >
      1000
  ) {
    return {
      valid: false,
      message:
        "Feedback message cannot exceed 1000 characters",
    };
  }


  return {
    valid: true,
  };
};


module.exports = {
  calculateAverageRating,
  groupFeedbackByCategory,
  getFeedbackSummary,
  validateFeedback,
};