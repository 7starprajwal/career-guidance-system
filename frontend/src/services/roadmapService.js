import api from "./api";

const roadmapService = {
  async getRoadmap() {
    const response = await api.get("/roadmap");

    return response.data;
  },
};

export default roadmapService;