/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  AddBookRequest,
  BookRecommendationRequest,
  BookState,
  BookStatus,
} from "@/types/BookTypes";
import { persist } from "zustand/middleware";
import { bookService } from "@/services/bookServices";

export const useBookStore = create<BookState>()(
  persist(
    (set) => ({
      recommendedBooks: [],
      userLibrary: [],
      selectedBook: null,
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

      fetchUserLibrary: async (request: BookStatus) => {
        set({ isLoading: true, error: null });
        try {
          const books = await bookService.getUserLibrary(request);
          set({ userLibrary: books, isLoading: false });
          console.log("✅ User library fetched successfully");
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch user library";
          set({ error: errorMessage, isLoading: false, userLibrary: [] });
          console.error(`❌ Fetch failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },
      addBookToLibrary: async (request: AddBookRequest) => {
        set({ isLoading: true, error: null });
        try {
          const newBook = await bookService.addBookToLibrary(request);
          // Update the userLibrary state with the new book
          set((state) => ({
            userLibrary: [...state.userLibrary, newBook],
            isLoading: false,
          }));
          console.log("✅ Book added to library successfully");
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to add book to library";
          set({ error: errorMessage, isLoading: false });
          console.error(`❌ Add book failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      // fetchBookById: async (id) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     const book = await bookService.getBookById(id);
      //     set({ selectedBook: book, isLoading: false });
      //     console.log("✅ Book details fetched successfully");
      //   } catch (err: any) {
      //     const errorMessage =
      //       err.response?.data?.message ||
      //       err.message ||
      //       "Failed to fetch book details";
      //     set({ error: errorMessage, isLoading: false, selectedBook: null });
      //     console.error(`❌ Fetch book details failed: ${errorMessage}`);
      //     throw new Error(errorMessage);
      //   }
      // },

      // startReadingBook: async (id, page) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     await bookService.startReadingBook(id, page);
      //     // Optional: Re-fetch the book details or user library to update the state
      //     await get().fetchBookById(id);
      //     await get().fetchUserLibrary();
      //     console.log("✅ Reading session started successfully");
      //   } catch (err: any) {
      //     const errorMessage =
      //       err.response?.data?.message ||
      //       err.message ||
      //       "Failed to start reading";
      //     set({ error: errorMessage, isLoading: false });
      //     console.error(`❌ Start reading failed: ${errorMessage}`);
      //     throw new Error(errorMessage);
      //   }
      // },
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
