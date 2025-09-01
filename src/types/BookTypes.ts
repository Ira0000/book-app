export interface BookState {
  recommendedBooks: Book[];
  userLibrary: AddBookResponse[];
  selectedBook: Book | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchRecommendedBooks: (request: BookRecommendationRequest) => Promise<void>;
  fetchUserLibrary: (request: BookStatus) => Promise<void>;
  addBookToLibrary: (request: AddBookRequest) => Promise<void>;
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

export type BookStatus = "unread" | "in-progress" | "done";
export type BookProgress = {
  startPage: number;
  startReading: string;
  finishPage: number;
  finishReading: string;
  speed: number;
  status: string;
};
