/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  AddBookRequest,
  Book,
  BookRecommendationRequest,
  BookState,
  BookStatus,
  deleteReadingSessionRequest,
  ReadingBookRequest,
  UserBookResponse,
} from "@/types/BookTypes";
import { persist } from "zustand/middleware";
import { bookService } from "@/services/bookServices";

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      recommendedBooks: [],
      userLibrary: [],
      selectedBook: null,
      isLoading: false,
      error: null,
      totalPages: 0,
      currentPage: 1,

      setSelectedBook: (book: UserBookResponse) => {
        set({ selectedBook: book, error: null });
        console.log("Selected book set:", book);
      },

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

      fetchUserLibrary: async (request: BookStatus = "") => {
        set({ isLoading: true, error: null });
        try {
          const params = request ? { status: request } : {};
          const books = await bookService.getUserLibrary(params);
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
          set((state) => ({
            userLibrary: [...state.userLibrary, newBook],
            isLoading: false,
          }));
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

      addBookToLibraryById: async (book: Book) => {
        set({ isLoading: true, error: null });
        try {
          const bookToAdd = book;
          const currentLibrary = get().userLibrary;
          const bookExists = currentLibrary.some((book) => {
            const titleMatch =
              book.title?.toLowerCase().trim() ===
              bookToAdd.title?.toLowerCase().trim();
            const authorMatch =
              book.author?.toLowerCase().trim() ===
              bookToAdd.author?.toLowerCase().trim();
            return titleMatch && authorMatch;
          });
          if (bookExists) {
            const errorMessage = "Book already is in your library";
            set({ error: errorMessage, isLoading: false });
            console.error(`❌ Add book failed: ${errorMessage}`);
            throw new Error(errorMessage);
          }
          const newBook = await bookService.addBookToLibraryById(book._id);
          set((state) => ({
            userLibrary: [...state.userLibrary, newBook],
            isLoading: false,
          }));
        } catch (err: any) {
          if (err.message === "Book already is in your library") {
            throw err;
          }
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to add book to library";
          set({ error: errorMessage, isLoading: false });
          console.error(`❌ Add book failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      deleteBookFromLibrary: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await bookService.deleteBookFromLibraryById(id);
          set((state) => ({
            userLibrary: state.userLibrary.filter((book) => book._id !== id),
            isLoading: false,
          }));
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to delete book";
          set({ error: errorMessage, isLoading: false });
          console.error(`❌ Delete book failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },
      getReadingBookInfo: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const book = await bookService.getReadingBookInfo(id);
          set({ selectedBook: book, isLoading: false });
          console.log("✅ Book details fetched successfully");
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch book details";
          set({ error: errorMessage, isLoading: false, selectedBook: null });
          console.error(`❌ Fetch book details failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      startReading: async ({ id, page }: ReadingBookRequest) => {
        set({ isLoading: true, error: null });
        try {
          await bookService.startReadingBook({ id, page });
          // Optional: Re-fetch the book details or user library to update the state
          await get().getReadingBookInfo(id);
          await get().fetchUserLibrary();
          set({ isLoading: false });
          console.log("✅ Reading session started successfully");
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to start reading";
          set({ error: errorMessage, isLoading: false });
          console.error(`❌ Start reading failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },
      finishReading: async ({ id, page }: ReadingBookRequest) => {
        set({ isLoading: true, error: null });
        try {
          await bookService.finishReadingBook({ id, page });
          // Re-fetch the book and library to update the UI
          await get().getReadingBookInfo(id);
          await get().fetchUserLibrary();
          set({ isLoading: false });
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to finish reading";
          set({ error: errorMessage, isLoading: false });
          console.error(`❌ Finish reading failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },
      deleteReadingSession: async (data: deleteReadingSessionRequest) => {
        set({ isLoading: true, error: null });
        try {
          await bookService.deleteReadingSession(data);
          // Re-fetch the book to update the UI
          await get().getReadingBookInfo(data.bookId);
          set({ isLoading: false });
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to delete reading session";
          set({ error: errorMessage, isLoading: false });
          console.error(`❌ Delete reading session failed: ${errorMessage}`);
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
