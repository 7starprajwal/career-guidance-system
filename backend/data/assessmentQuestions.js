const assessmentQuestions = [
  {
    id: "q1",
    question:
      "When you face a difficult problem, what do you usually do first?",
    options: [
      {
        text: "Break the problem into smaller parts",
        scores: {
          problemSolving: 5,
          analyticalThinking: 5,
          logicalThinking: 5,
        },
      },
      {
        text: "Look for an example or solution online",
        scores: {
          adaptability: 4,
          problemSolving: 3,
        },
      },
      {
        text: "Ask someone experienced for help",
        scores: {
          communication: 4,
          teamwork: 4,
        },
      },
      {
        text: "Try different approaches until something works",
        scores: {
          creativity: 5,
          adaptability: 5,
          problemSolving: 4,
        },
      },
    ],
  },

  {
    id: "q2",
    question:
      "How do you react when you have to learn a completely new technology?",
    options: [
      {
        text: "I enjoy learning and experiment with it",
        scores: {
          adaptability: 5,
          creativity: 4,
          logicalThinking: 3,
        },
      },
      {
        text: "I create a structured learning plan",
        scores: {
          analyticalThinking: 5,
          logicalThinking: 5,
        },
      },
      {
        text: "I prefer learning with someone else",
        scores: {
          teamwork: 5,
          communication: 4,
        },
      },
      {
        text: "I need some time before I become comfortable",
        scores: {
          adaptability: 3,
        },
      },
    ],
  },

  {
    id: "q3",
    question:
      "During a team project, what role do you naturally take?",
    options: [
      {
        text: "I coordinate the team and assign tasks",
        scores: {
          leadership: 5,
          communication: 5,
          teamwork: 4,
        },
      },
      {
        text: "I focus on solving the technical problems",
        scores: {
          problemSolving: 5,
          logicalThinking: 5,
        },
      },
      {
        text: "I help team members and keep everyone connected",
        scores: {
          teamwork: 5,
          communication: 5,
        },
      },
      {
        text: "I suggest new ideas and approaches",
        scores: {
          creativity: 5,
          adaptability: 4,
        },
      },
    ],
  },

  {
    id: "q4",
    question:
      "How do you make an important decision?",
    options: [
      {
        text: "I analyze the available information carefully",
        scores: {
          analyticalThinking: 5,
          logicalThinking: 5,
        },
      },
      {
        text: "I consider different possible solutions",
        scores: {
          problemSolving: 5,
          creativity: 4,
        },
      },
      {
        text: "I discuss it with people I trust",
        scores: {
          communication: 5,
          teamwork: 4,
        },
      },
      {
        text: "I adapt based on the situation",
        scores: {
          adaptability: 5,
          problemSolving: 3,
        },
      },
    ],
  },

  {
    id: "q5",
    question:
      "What motivates you most when working on a project?",
    options: [
      {
        text: "Solving challenging problems",
        scores: {
          problemSolving: 5,
          logicalThinking: 5,
        },
      },
      {
        text: "Creating something new",
        scores: {
          creativity: 5,
          adaptability: 4,
        },
      },
      {
        text: "Working successfully with a team",
        scores: {
          teamwork: 5,
          communication: 5,
        },
      },
      {
        text: "Taking responsibility and leading the project",
        scores: {
          leadership: 5,
          communication: 4,
        },
      },
    ],
  },
];

module.exports = assessmentQuestions;