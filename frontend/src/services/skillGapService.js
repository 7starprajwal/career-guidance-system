import api from "./api";

const skillGapService = {
  getSkillGap: async () => {
    const response = await api.get("/skill-gap");

    return response.data;
  },
};

export default skillGapService;