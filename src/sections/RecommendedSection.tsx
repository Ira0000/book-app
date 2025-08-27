"use client";

import { useAuthStore } from "@/store/authStore";
import { useBookStore } from "@/store/bookStore";
import { BookRecommendationRequest } from "@/types/BookTypes";
import { useEffect } from "react";

export default function RecommendedSection() {
  const { recommendedBooks, isLoading, error, fetchRecommendedBooks } =
    useBookStore();
  const { isAuthenticated } = useAuthStore(); // Example of checking auth state

  useEffect(() => {
    // Only fetch data if the user is authenticated
    if (isAuthenticated) {
      const requestData: BookRecommendationRequest = {
        page: 1,
        limit: 10,
        title: "", // Optional search parameters
        author: "",
      };
      fetchRecommendedBooks(requestData);
    }
  }, [isAuthenticated, fetchRecommendedBooks]);

  useEffect(() => {
    if (recommendedBooks.length > 0) {
      console.log(recommendedBooks);
    }
  }, [recommendedBooks]);

  if (isLoading) {
    return <div>Loading recommended books...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-grey-dark rounded-[30px] px-[20px] py-10">
      RecommendedSection
    </div>
  );
}
