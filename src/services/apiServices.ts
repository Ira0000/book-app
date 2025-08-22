import {
  AuthResponse,
  RefreshTokenResponse,
  SignInRequest,
  SignUpRequest,
  User,
} from "@/types/AuthTypes";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://readjourney.b.goit.study/api";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          const response = await authService.refreshToken();
          Cookies.set("token", response.token);
          Cookies.set("refreshToken", response.refreshToken);
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/users/signup",
      data
    );
    return response.data;
  },

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/users/signin",
      data
    );
    return response.data;
  },

  async signOut(): Promise<void> {
    await apiClient.post("/users/signout");
  },

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await apiClient.get("/users/current");
    return response.data;
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response: AxiosResponse<RefreshTokenResponse> = await apiClient.get(
      "/users/current/refresh"
    );
    return response.data;
  },
};

export default apiClient;
