import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const cleanToken = token.replace(/^"|"$/g, "");
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;

      const isAuthFlow =
        currentPath.includes("/login") ||
        currentPath.includes("/auth/callback");

      if (!isAuthFlow) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?error=session_expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
