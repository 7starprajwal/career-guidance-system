import api from "./api";

const courseService = {
  async getCourses() {
    const response = await api.get("/courses");

    return response.data;
  },
};

export default courseService;