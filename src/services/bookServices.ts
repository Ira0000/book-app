import { BookRecommendationResponse } from "./../types/BookTypes";
import { BookRecommendationRequest } from "@/types/BookTypes";
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import apiClient from "./apiServices";

export const bookService = {
  async getRecommendedBooks(
    data: BookRecommendationRequest
  ): Promise<BookRecommendationResponse> {
    try {
      const response: AxiosResponse<BookRecommendationResponse> =
        await apiClient.get("/books/recommend", {
          params: data,
        });
      return response.data;
    } catch (error) {
      // Re-throw the error to be handled by the calling component or store
      throw error;
    }
  },
};
