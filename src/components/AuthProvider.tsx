/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuthStore } from "@/store/authStore";
import { AuthState } from "@/types/AuthTypes";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<
  Partial<AuthState & { router: ReturnType<typeof useRouter> }>
>({});

export function AuthProvider({ children }: { children: ReactNode }) {
  const authStore = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (isMounted && !isInitialized) {
        try {
          await authStore.initializeAuth();
        } catch (err) {
          console.error("❌ Auth initialization failed:", err);
        } finally {
          if (isMounted) {
            setIsInitialized(true);
          }
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Only run this after the initial check is complete
    if (isInitialized && !authStore.isAuthenticated) {
      const currentPath = window.location.pathname;
      const isGuestRoute = ["/login", "/register"].includes(currentPath);

      // Redirect to login if on a protected route and not authenticated
      if (!isGuestRoute) {
        router.push(`/login?redirect=${currentPath}`);
      }
    }
  }, [authStore.isAuthenticated, isInitialized, router]);

  const enhancedSignOut = async () => {
    try {
      await authStore.signOut();
    } catch (err) {
      console.error("⚠️ Sign out error:", err);
    } finally {
      router.push("/login");
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ ...authStore, signOut: enhancedSignOut, router }}
    >
      {children}
    </AuthContext.Provider>
  );
}
