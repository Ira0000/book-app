/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService, tokenManager } from "@/services/apiServices";
import {
  AuthState,
  AuthResponse,
  SignInRequest,
  SignUpRequest,
} from "@/types/AuthTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const IS_TESTING = true;

const conditionalLog = (message: string, isError = false) => {
  if (IS_TESTING) {
    if (isError) console.error(message);
    else console.log(message);
  }
};

// Helper to set authentication cookie
const setAuthCookie = (isAuthenticated: boolean) => {
  if (typeof document !== "undefined") {
    document.cookie = `isAuthenticated=${isAuthenticated}; path=/; max-age=${
      isAuthenticated ? 86400 : 0
    }; SameSite=Strict`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const internalRefreshAccessToken = async (): Promise<{
        token: string;
        refreshToken: string;
      }> => {
        conditionalLog("🔄 Refreshing access token...");
        const currentRefreshToken = get().refreshToken;

        if (!currentRefreshToken) {
          throw new Error("No refresh token available");
        }

        try {
          const response = await authService.refreshToken(currentRefreshToken);

          // Update both store and token manager
          set({
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            error: null,
          });

          tokenManager.setToken(response.token);
          tokenManager.setRefreshToken(response.refreshToken);

          setAuthCookie(true);
          conditionalLog("✅ Access token refreshed successfully");
          return response;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Token refresh failed";

          // Clear everything
          set({
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null,
            error: errorMessage,
          });

          tokenManager.setToken(null);
          tokenManager.setRefreshToken(null);
          setAuthCookie(false);
          conditionalLog(`❌ Refresh failed: ${errorMessage}`, true);
          throw new Error(errorMessage);
        }
      };

      // Internal sign out function
      const internalSignOut = async () => {
        conditionalLog("🚪 Signing out user...");

        try {
          await authService.signOut();
        } catch (err: any) {
          conditionalLog(`⚠️ Sign out request failed: ${err.message}`, true);
        } finally {
          // Clear everything
          set({
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null,
            error: null,
          });

          tokenManager.setToken(null);
          tokenManager.setRefreshToken(null);
          setAuthCookie(false);
          conditionalLog("✅ Sign out complete, all auth data cleared");
        }
      };

      // Set up token manager callbacks
      tokenManager.setRefreshCallback(internalRefreshAccessToken);
      tokenManager.setSignOutCallback(internalSignOut);

      return {
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        user: null,

        initializeAuth: async () => {
          conditionalLog("🚀 Initializing auth...");
          const state = get();

          if (!state.refreshToken) {
            conditionalLog(
              "⚠️ No refresh token found, user is unauthenticated"
            );
            set({ token: null, isAuthenticated: false, user: null });
            tokenManager.setToken(null);
            tokenManager.setRefreshToken(null);
            setAuthCookie(false);
            return;
          }

          // Update token manager with current tokens
          tokenManager.setToken(state.token);
          tokenManager.setRefreshToken(state.refreshToken);

          try {
            await internalRefreshAccessToken();
            conditionalLog("✅ Auth initialized successfully");
          } catch (error) {
            conditionalLog(
              `⚠️ Auth initialization failed, clearing stored tokens, ${error}`
            );

            // Clear persisted storage completely
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth-store");
              sessionStorage.removeItem("auth-store");
            }

            set({
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              user: null,
              error: null,
            });
            tokenManager.setToken(null);
            tokenManager.setRefreshToken(null);
            setAuthCookie(false);
          }
        },

        signIn: async (data: SignInRequest): Promise<AuthResponse> => {
          set({ isLoading: true, error: null });
          conditionalLog(`🔐 Signing in user: ${data.email}`);

          try {
            const response = await authService.signIn(data);

            // Update token manager first
            tokenManager.setToken(response.token);
            tokenManager.setRefreshToken(response.refreshToken);

            // Get user data
            const userData = await authService.getCurrentUser();

            set({
              token: response.token,
              refreshToken: response.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              user: userData,
              error: null,
            });

            setAuthCookie(true);
            conditionalLog("✅ Login successful, tokens and user data set");
            return response;
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message || err.message || "Login error";

            set({
              error: errorMessage,
              isLoading: false,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              user: null,
            });

            tokenManager.setToken(null);
            tokenManager.setRefreshToken(null);
            setAuthCookie(false);
            conditionalLog(`❌ Login failed: ${errorMessage}`, true);
            throw new Error(errorMessage);
          }
        },

        signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
          set({ isLoading: true, error: null });
          conditionalLog(`📝 Registering user: ${data.email}`);

          try {
            const response = await authService.signUp(data);

            // Update token manager first
            tokenManager.setToken(response.token);
            tokenManager.setRefreshToken(response.refreshToken);

            // Get user data
            const userData = await authService.getCurrentUser();

            set({
              token: response.token,
              refreshToken: response.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              user: userData,
              error: null,
            });

            setAuthCookie(true);
            conditionalLog(
              "✅ Registration successful, tokens and user data set"
            );
            return response;
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Registration error";

            set({
              error: errorMessage,
              isLoading: false,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              user: null,
            });

            tokenManager.setToken(null);
            tokenManager.setRefreshToken(null);
            setAuthCookie(false);
            conditionalLog(`❌ Registration failed: ${errorMessage}`, true);
            throw new Error(errorMessage);
          }
        },

        refreshAccessToken: internalRefreshAccessToken,

        signOut: internalSignOut,
      };
    },
    {
      name: "auth-store",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Update token manager when store rehydrates
        if (state) {
          tokenManager.setToken(state.token);
          tokenManager.setRefreshToken(state.refreshToken);
        }
      },
    }
  )
);
