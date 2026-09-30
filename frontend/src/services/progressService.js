import api from "./api";

const progressService = {
  async getProgress() {
    const response = await api.get("/progress");

    return response.data;
  },

  async updateProgress(data) {
    const response = await api.post(
      "/progress",
      data
    );

    return response.data;
  },
};

export default progressService;