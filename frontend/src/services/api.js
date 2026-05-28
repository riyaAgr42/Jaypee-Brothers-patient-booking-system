import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("docease-user");

  if (storedUser) {
    const token = JSON.parse(storedUser).token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
