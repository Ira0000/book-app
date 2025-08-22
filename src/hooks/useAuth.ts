"use client";

import useAuthStore from "@/store/authStore";

export const useAuth = () => {
  const authStore = useAuthStore();
  return authStore;
};
