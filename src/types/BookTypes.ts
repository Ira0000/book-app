export interface BookState {
  recommendedBooks: Book[];
  userLibrary: AddBookResponse[];
  selectedBook: UserBookResponse | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchRecommendedBooks: (request: BookRecommendationRequest) => Promise<void>;
  fetchUserLibrary: (request?: BookStatus) => Promise<void>;
  addBookToLibrary: (request: AddBookRequest) => Promise<void>;
  addBookToLibraryById: (id: string) => Promise<void>;
  deleteBookFromLibrary: (id: string) => Promise<void>;
  getReadingBookInfo: (id: string) => Promise<void>;
  startReading: ({ id, page }: ReadingBookRequest) => Promise<void>;
  finishReading: ({ id, page }: ReadingBookRequest) => Promise<void>;
  deleteReadingSession: (data: deleteReadingSessionRequest) => Promise<void>;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  totalPages: number;
  recommend: boolean;
}

export interface BookRecommendationRequest {
  title: string | undefined;
  author: string | undefined;
  page: number | undefined;
  limit: number;
}

export interface BookRecommendationResponse {
  results: Book[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface AddBookRequest {
  title: string | undefined;
  author: string | undefined;
  totalPages: number | undefined;
}

export interface AddBookResponse {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  totalPages: number;
  status: BookStatus;
  owner: string;
  progress: BookProgress[];
}

export type BookStatus = "unread" | "in-progress" | "done" | "";
export type BookProgress = {
  startPage: number;
  startReading: string;
  finishPage: number;
  finishReading: string;
  speed: number;
  status: string;
};

export interface DeleteBookResponse {
  message: string;
  id: string;
}

export interface ReadingBookRequest {
  id: string;
  page: number;
}

export interface UserBookResponse {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  totalPages: number;
  status: BookStatus;
  owner: string;
  progress: BookProgress[];
  timeLeftToRead: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface deleteReadingSessionRequest {
  bookId: string;
  readingId: string;
}
