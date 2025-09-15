/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthResponse,
  RefreshTokenResponse,
  SignInRequest,
  SignUpRequest,
  User,
} from "@/types/AuthTypes";
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://readjourney.b.goit.study/api";
const IS_TESTING = true;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Separate client for auth operations (no interceptors)
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Create a separate, un-intercepted instance for the refresh token call
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
});

// Create a token manager to avoid circular dependencies
class TokenManager {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private refreshCallback:
    | (() => Promise<{ token: string; refreshToken: string }>)
    | null = null;
  private signOutCallback: (() => Promise<void>) | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  setRefreshToken(refreshToken: string | null) {
    this.refreshToken = refreshToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  setRefreshCallback(
    callback: () => Promise<{ token: string; refreshToken: string }>
  ) {
    this.refreshCallback = callback;
  }

  setSignOutCallback(callback: () => Promise<void>) {
    this.signOutCallback = callback;
  }

  async refreshAccessToken(): Promise<{ token: string; refreshToken: string }> {
    if (!this.refreshCallback) {
      throw new Error("No refresh callback set");
    }
    return this.refreshCallback();
  }

  async signOut(): Promise<void> {
    if (this.signOutCallback) {
      await this.signOutCallback();
    }
  }
}

const tokenManager = new TokenManager();

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  );
  failedQueue = [];
};

// Request interceptor to attach access token
apiClient.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (IS_TESTING) {
      console.log(
        `📡 Request: ${config.method?.toUpperCase()} ${config.url} with token`
      );
    }
  }
  return config;
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { token } = await tokenManager.refreshAccessToken();
        processQueue(null, token);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await tokenManager.signOut();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authClient.post(
        "/users/signup",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authClient.post(
        "/users/signin",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      await apiClient.post("/users/signout");
    } catch (error) {
      console.error("Sign out request failed:", error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.get(
        "/users/current"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response: AxiosResponse<RefreshTokenResponse> =
        await refreshClient.get("/users/current/refresh", {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 500) {
        tokenManager.setToken(null);
        tokenManager.setRefreshToken(null);
      }
      throw error;
    }
  },
};

export { tokenManager };

export default apiClient;
