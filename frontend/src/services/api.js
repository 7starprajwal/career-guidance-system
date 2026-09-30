import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("career_guidance_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("career_guidance_token");
      localStorage.removeItem("career_guidance_user");
    }

    return Promise.reject(error);
  }
);

export default api;