/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from "@/services/apiServices";
import {
  AuthStore,
  SignInRequest,
  SignUpRequest,
  User,
} from "@/types/AuthTypes";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import Cookies from "js-cookie";

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        signUp: async (data: SignUpRequest) => {
          try {
            set({ isLoading: true, error: null });

            const response = await authService.signUp(data);

            // Store tokens in cookies for middleware access
            if (typeof window !== "undefined") {
              Cookies.set("token", response.token, { expires: 7 });
              Cookies.set("refreshToken", response.refreshToken, {
                expires: 30,
              });
            }

            set({
              token: response.token,
              refreshToken: response.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Sign up failed";
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        signIn: async (data: SignInRequest) => {
          try {
            set({ isLoading: true, error: null });

            const response = await authService.signIn(data);

            // Store tokens in cookies for middleware access
            if (typeof window !== "undefined") {
              Cookies.set("token", response.token, { expires: 7 });
              Cookies.set("refreshToken", response.refreshToken, {
                expires: 30,
              });
            }

            set({
              token: response.token,
              refreshToken: response.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Sign in failed";
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        signOut: async () => {
          try {
            set({ isLoading: true });

            // Call API to invalidate token on server
            await authService.signOut();

            // Clear cookies
            if (typeof window !== "undefined") {
              Cookies.remove("token");
              Cookies.remove("refreshToken");
            }

            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            // Even if API call fails, clear local state
            if (typeof window !== "undefined") {
              Cookies.remove("token");
              Cookies.remove("refreshToken");
            }

            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            throw error;
          }
        },

        refreshAccessToken: async () => {
          try {
            const response = await authService.refreshToken();

            // Update cookies
            if (typeof window !== "undefined") {
              Cookies.set("token", response.token, { expires: 7 });
              Cookies.set("refreshToken", response.refreshToken, {
                expires: 30,
              });
            }

            set({
              token: response.token,
              refreshToken: response.refreshToken,
            });
          } catch (error: any) {
            // If refresh fails, log out user
            get().signOut();
            throw error;
          }
        },

        getCurrentUser: async () => {
          try {
            set({ isLoading: true, error: null });

            const user = await authService.getCurrentUser();

            set({
              user,
              isLoading: false,
            });
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Failed to get user info";
            set({
              isLoading: false,
              error: errorMessage,
            });

            // If unauthorized, sign out
            if (error.response?.status === 401) {
              get().signOut();
            }

            throw error;
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        initializeAuth: async () => {
          return new Promise<void>((resolve) => {
            if (typeof window !== "undefined") {
              const token = Cookies.get("token");
              const refreshToken = Cookies.get("refreshToken");

              if (token && refreshToken) {
                set({
                  token,
                  refreshToken,
                  isAuthenticated: true,
                });

                // Fetch current user info on initialization
                get()
                  .getCurrentUser()
                  .catch(() => {
                    // If fetching user fails, clear auth state
                    get().signOut();
                  })
                  .finally(() => {
                    resolve();
                  });
              } else {
                // No tokens found, ensure clean state
                set({
                  user: null,
                  token: null,
                  refreshToken: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: null,
                });
                resolve();
              }
            } else {
              resolve();
            }
          });
        },

        resetAuth: () => {
          if (typeof window !== "undefined") {
            Cookies.remove("token");
            Cookies.remove("refreshToken");
          }

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        },

        updateUser: (userData: Partial<User>) => {
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }));
        },

        setError: (error: string) => {
          set({ error });
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "auth-store" }
  )
);

export default useAuthStore;
