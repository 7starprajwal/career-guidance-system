import api from "./api";

const careerService = {
  async getCareers() {
    const response = await api.get("/careers");

    return response.data;
  },

  async getRecommendations() {
    const response = await api.get(
      "/careers/recommendations"
    );

    return response.data;
  },
};

export default careerService;