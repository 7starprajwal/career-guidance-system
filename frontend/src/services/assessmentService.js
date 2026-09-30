import api from "./api";

const assessmentService = {
  async getQuestions() {
    const response = await api.get("/assessment/questions");
    return response.data;
  },

  async getAssessment() {
    const response = await api.get("/assessment");
    return response.data;
  },

  async submitAssessment(answers) {
    const response = await api.post(
      "/assessment/submit",
      {
        answers,
      }
    );

    return response.data;
  },
};

export default assessmentService;