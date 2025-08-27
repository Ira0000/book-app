/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { BookRecommendationRequest, BookState } from "@/types/BookTypes";
import { persist } from "zustand/middleware";
import { bookService } from "@/services/bookServices";

export const useBookStore = create<BookState>()(
  persist(
    (set) => ({
      recommendedBooks: [],
      isLoading: false,
      error: null,
      totalPages: 0,
      currentPage: 1,

      fetchRecommendedBooks: async (request: BookRecommendationRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await bookService.getRecommendedBooks(request);
          set({
            recommendedBooks: response.results,
            totalPages: response.totalPages,
            currentPage: response.page,
            isLoading: false,
          });
          console.log("✅ Recommended books fetched successfully");
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch recommended books";
          set({
            error: errorMessage,
            isLoading: false,
            recommendedBooks: [],
          });
          console.error(`❌ Fetch failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "book-store",
      partialize: (state) => ({
        recommendedBooks: state.recommendedBooks,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
      }),
    }
  )
);
