import api from "./api";

const profileService = {
  // Get logged-in user's profile
  getProfile: async () => {
    const response = await api.get("/profile");

    return response.data;
  },

  // Create or update profile information
  saveProfile: async (profileData) => {
    const response = await api.post(
      "/profile",
      profileData
    );

    return response.data;
  },

  // Upload profile image to Cloudinary
  uploadProfileImage: async (file) => {
    const formData = new FormData();

    formData.append("profileImage", file);

    const response = await api.post(
      "/profile/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export default profileService;