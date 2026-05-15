import axios from "axios";
import {
  clearSessionStorage,
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
} from "@/services/authSession";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, "")}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getRefreshToken();
    const requestUrl = String(originalRequest?.url || "");
    const isCredentialChallengeRequest =
      requestUrl.includes("/auth/email") ||
      requestUrl.includes("/auth/password");

    if (
      error.response?.status === 401 &&
      refreshToken &&
      originalRequest &&
      !originalRequest._retry &&
      !requestUrl.includes("/auth/refresh") &&
      !isCredentialChallengeRequest
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const { accessToken, refreshToken: rotatedRefreshToken } =
          refreshResponse.data;
        setSessionTokens(accessToken, rotatedRefreshToken ?? refreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch {
        clearSessionStorage();
      }
    }

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthFlow =
        currentPath.includes("/login") ||
        currentPath.includes("/register") ||
        currentPath.includes("/auth/callback") ||
        currentPath.includes("/spotify/callback");

      if (!isAuthFlow && !isCredentialChallengeRequest) {
        clearSessionStorage();
        window.location.href = "/login?error=session_expired";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
export { API_BASE_URL };
