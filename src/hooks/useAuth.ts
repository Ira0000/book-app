"use client";

import { AuthContext } from "@/components/AuthProvider";
import { useAuthStore } from "@/store/authStore";
import { useContext } from "react";

// export const useAuth = () => {
//   const authStore = useAuthStore();
//   return authStore;
// };

export function useAuth() {
  const context = useContext(AuthContext);
  const authStore = useAuthStore();

  // If used within AuthProvider, return context
  if (context && Object.keys(context).length > 0) {
    return context;
  }

  return authStore;
}
