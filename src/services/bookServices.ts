import {
  AddBookRequest,
  AddBookResponse,
  BookRecommendationResponse,
  BookStatus,
  DeleteBookResponse,
  deleteReadingSessionRequest,
  // deleteReadingBookRequest,
  ReadingBookRequest,
  UserBookResponse,
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

  async getUserLibrary(status: BookStatus = ""): Promise<AddBookResponse[]> {
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

  async addBookToLibraryById(id: string): Promise<AddBookResponse> {
    try {
      const response: AxiosResponse<AddBookResponse> = await apiClient.post(
        `/books/add/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteBookFromLibraryById(id: string): Promise<DeleteBookResponse> {
    try {
      const response: AxiosResponse<DeleteBookResponse> =
        await apiClient.delete(`/books/remove/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getReadingBookInfo(id: string): Promise<UserBookResponse> {
    try {
      const response: AxiosResponse<UserBookResponse> = await apiClient.get(
        `/books/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async startReadingBook({
    id,
    page,
  }: ReadingBookRequest): Promise<AddBookResponse> {
    try {
      const response: AxiosResponse<AddBookResponse> = await apiClient.post(
        `/books/reading/start`,
        { id, page }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async finishReadingBook({
    id,
    page,
  }: ReadingBookRequest): Promise<UserBookResponse> {
    try {
      const response: AxiosResponse<UserBookResponse> = await apiClient.post(
        "/books/reading/finish",
        { id, page }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteReadingSession(
    data: deleteReadingSessionRequest
  ): Promise<UserBookResponse> {
    try {
      const response: AxiosResponse<UserBookResponse> = await apiClient.delete(
        "/books/reading",
        {
          params: data,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
