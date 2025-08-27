export interface BookState {
  recommendedBooks: Book[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchRecommendedBooks: (request: BookRecommendationRequest) => Promise<void>;
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
  title: string;
  author: string;
  page: number;
  limit: number;
}

export interface BookRecommendationResponse {
  results: Book[];
  totalPages: number;
  page: number;
  perPage: number;
}
