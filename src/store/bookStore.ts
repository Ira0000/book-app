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

export interface LoadingStates {
  recommendations: boolean;
  userLibrary: boolean;
  selectedBook: boolean;
  addBook: boolean;
  deleteBook: boolean;
  reading: boolean;
}

export interface ErrorStates {
  recommendations: string | null;
  userLibrary: string | null;
  selectedBook: string | null;
  addBook: string | null;
  deleteBook: string | null;
  reading: string | null;
}

const initialLoadingState: LoadingStates = {
  recommendations: false,
  userLibrary: false,
  selectedBook: false,
  addBook: false,
  deleteBook: false,
  reading: false,
};

const initialErrorState: ErrorStates = {
  recommendations: null,
  userLibrary: null,
  selectedBook: null,
  addBook: null,
  deleteBook: null,
  reading: null,
};

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      recommendedBooks: [],
      userLibrary: [],
      selectedBook: null,
      currentReading: null,
      loading: initialLoadingState,
      errors: initialErrorState,
      totalPages: 0,
      currentPage: 1,

      clearError: (errorType: keyof ErrorStates) => {
        set((state) => ({
          errors: {
            ...state.errors,
            [errorType]: null,
          },
        }));
      },

      clearAllErrors: () => {
        set({ errors: initialErrorState });
      },

      setSelectedBook: (book: UserBookResponse) => {
        set({
          selectedBook: book,
          errors: {
            ...get().errors,
            selectedBook: null,
          },
        });
        const hasActiveReadingSession = book.progress.some(
          (session) => !session.finishReading
        );
        if (hasActiveReadingSession) {
          const activeReadingSession = book.progress.find(
            (session) => !session.finishReading
          );

          if (activeReadingSession) {
            set({
              currentReading: {
                bookId: book._id,
                sessionId: activeReadingSession._id,
                startPage: activeReadingSession.startPage,
                startTime:
                  activeReadingSession.startReading || new Date().toISOString(),
              },
            });
          }
        } else {
          const currentReading = get().currentReading;
          if (currentReading?.bookId === book._id) {
            set({ currentReading: null });
          }
        }
        // console.log("Selected book set:", book);
      },

      isCurrentlyReading: (bookId?: string) => {
        const currentReading = get().currentReading;
        if (!bookId) return !!currentReading;
        return currentReading?.bookId === bookId;
      },

      fetchRecommendedBooks: async (request: BookRecommendationRequest) => {
        set((state) => ({
          loading: { ...state.loading, recommendations: true },
          errors: { ...state.errors, recommendations: null },
        }));
        try {
          const response = await bookService.getRecommendedBooks(request);
          set((state) => ({
            recommendedBooks: response.results,
            totalPages: response.totalPages,
            currentPage: response.page,
            loading: { ...state.loading, recommendations: false },
          }));
          // console.log("✅ Recommended books fetched successfully");
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch recommended books";
          set((state) => ({
            errors: { ...state.errors, recommendations: errorMessage },
            loading: { ...state.loading, recommendations: false },
            recommendedBooks: [],
          }));
          console.error(`❌ Fetch failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      fetchUserLibrary: async (request: BookStatus = "") => {
        set((state) => ({
          loading: { ...state.loading, userLibrary: true },
          errors: { ...state.errors, userLibrary: null },
        }));
        try {
          const params = request ? { status: request } : {};
          const books = await bookService.getUserLibrary(params);
          set((state) => ({
            userLibrary: books,
            loading: { ...state.loading, userLibrary: false },
          }));
          // console.log("✅ User library fetched successfully");
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch user library";
          set((state) => ({
            errors: { ...state.errors, userLibrary: errorMessage },
            loading: { ...state.loading, userLibrary: false },
            userLibrary: [],
          }));
          console.error(`❌ Fetch failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },
      addBookToLibrary: async (request: AddBookRequest) => {
        set((state) => ({
          loading: { ...state.loading, addBook: true },
          errors: { ...state.errors, addBook: null },
        }));
        try {
          const newBook = await bookService.addBookToLibrary(request);
          set((state) => ({
            userLibrary: [...state.userLibrary, newBook],
            loading: { ...state.loading, addBook: false },
          }));
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to add book to library";
          set((state) => ({
            errors: { ...state.errors, addBook: errorMessage },
            loading: { ...state.loading, addBook: false },
          }));
          console.error(`❌ Add book failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      addBookToLibraryById: async (book: Book) => {
        set((state) => ({
          loading: { ...state.loading, addBook: true },
          errors: { ...state.errors, addBook: null },
        }));
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
            set((state) => ({
              errors: { ...state.errors, addBook: errorMessage },
              loading: { ...state.loading, addBook: false },
            }));
            console.error(`❌ Add book failed: ${errorMessage}`);
            throw new Error(errorMessage);
          }
          const newBook = await bookService.addBookToLibraryById(book._id);
          set((state) => ({
            userLibrary: [...state.userLibrary, newBook],
            loading: { ...state.loading, addBook: false },
          }));
        } catch (err: any) {
          if (err.message === "Book already is in your library") {
            throw err;
          }
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to add book to library";
          set((state) => ({
            errors: { ...state.errors, addBook: errorMessage },
            loading: { ...state.loading, addBook: false },
          }));
          console.error(`❌ Add book failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      deleteBookFromLibrary: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, deleteBook: true },
          errors: { ...state.errors, deleteBook: null },
        }));
        try {
          await bookService.deleteBookFromLibraryById(id);
          set((state) => ({
            userLibrary: state.userLibrary.filter((book) => book._id !== id),
            loading: { ...state.loading, deleteBook: false },
          }));
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to delete book";
          set((state) => ({
            errors: { ...state.errors, deleteBook: errorMessage },
            loading: { ...state.loading, deleteBook: false },
          }));
          console.error(`❌ Delete book failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      getReadingBookInfo: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, selectedBook: true },
          errors: { ...state.errors, selectedBook: null },
        }));
        try {
          const book = await bookService.getReadingBookInfo(id);
          set((state) => ({
            selectedBook: book,
            loading: { ...state.loading, selectedBook: false },
          }));

          const hasActiveSession = book.progress.some(
            (session) => !session.finishReading
          );
          if (hasActiveSession) {
            const activeSession = book.progress.find(
              (session) => !session.finishReading
            );
            if (activeSession) {
              set({
                currentReading: {
                  bookId: book._id,
                  sessionId: activeSession._id,
                  startPage: activeSession.startPage || 0,
                  startTime:
                    activeSession?.startReading || new Date().toISOString(),
                },
              });
            }
          }
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch book details";
          set((state) => ({
            errors: { ...state.errors, selectedBook: errorMessage },
            loading: { ...state.loading, selectedBook: false },
            selectedBook: null,
          }));
          console.error(`❌ Fetch book details failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      startReading: async ({ id, page }: ReadingBookRequest) => {
        set((state) => ({
          loading: { ...state.loading, reading: true },
          errors: { ...state.errors, reading: null },
        }));
        try {
          await bookService.startReadingBook({ id, page });
          set({
            currentReading: {
              bookId: id,
              startPage: page,
              startTime: new Date().toISOString(),
            },
            loading: { ...get().loading, reading: false },
          });

          await get().getReadingBookInfo(id);
          await get().fetchUserLibrary();
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to start reading";
          set((state) => ({
            errors: { ...state.errors, reading: errorMessage },
            loading: { ...state.loading, reading: false },
          }));
          console.error(`❌ Start reading failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },
      finishReading: async ({ id, page }: ReadingBookRequest) => {
        set((state) => ({
          loading: { ...state.loading, reading: true },
          errors: { ...state.errors, reading: null },
        }));
        try {
          await bookService.finishReadingBook({ id, page });

          set({
            currentReading: null,
            loading: { ...get().loading, reading: false },
          });
          await get().getReadingBookInfo(id);
          await get().fetchUserLibrary();
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to finish reading";
          set((state) => ({
            errors: { ...state.errors, reading: errorMessage },
            loading: { ...state.loading, reading: false },
          }));
          console.error(`❌ Finish reading failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      },

      deleteReadingSession: async (data: deleteReadingSessionRequest) => {
        set((state) => ({
          loading: { ...state.loading, reading: true },
          errors: { ...state.errors, reading: null },
        }));
        try {
          await bookService.deleteReadingSession(data);

          const currentReading = get().currentReading;
          if (
            currentReading?.sessionId === data.readingId ||
            currentReading?.bookId === data.bookId
          ) {
            set({ currentReading: null });
          }
          await get().getReadingBookInfo(data.bookId);
          set((state) => ({
            loading: { ...state.loading, reading: false },
          }));
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to delete reading session";
          set((state) => ({
            errors: { ...state.errors, reading: errorMessage },
            loading: { ...state.loading, reading: false },
          }));
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
        currentReading: state.currentReading,
      }),
    }
  )
);
