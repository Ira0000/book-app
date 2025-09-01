import {
  AddBookRequest,
  AddBookResponse,
  BookRecommendationResponse,
  BookStatus,
} from "./../types/BookTypes";
import { BookRecommendationRequest } from "@/types/BookTypes";
import { AxiosResponse } from "axios";
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

  async getUserLibrary(status: BookStatus): Promise<AddBookResponse[]> {
    try {
      const response: AxiosResponse<AddBookResponse[]> = await apiClient.get(
        "/books/own",
        {
          params: status,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async addBookToLibrary(data: AddBookRequest): Promise<AddBookResponse> {
    try {
      const response: AxiosResponse<AddBookResponse> = await apiClient.post(
        "/books/add",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
