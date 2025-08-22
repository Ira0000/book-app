/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthStore } from "@/types/AuthTypes";
import { createContext, ReactNode, useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";

export const AuthContext = createContext<Partial<AuthStore>>({});

export function AuthProvider({ children }: { children: ReactNode }) {
  const authStore = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  //   const router = useRouter();
  //   const pathname = usePathname();

  useEffect(() => {
    authStore.initializeAuth();
    setIsInitialized(true);
  });

  // Show loading until auth is initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
}
