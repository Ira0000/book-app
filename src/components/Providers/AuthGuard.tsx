"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isInitialized, isLoading, initializeAuth, initializationError } =
    useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  // Show loading state during initialization
  if (!isInitialized || isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )
    );
  }

  // Show error state if initialization failed
  if (initializationError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          Authentication failed. Please refresh the page or login again.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
