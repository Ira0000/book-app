"use client";

import EmblaCarousel from "@/components/EmblaCarousel/EmblaCarousel";
import { useBookStore } from "@/store/bookStore";
import { BookRecommendationRequest } from "@/types/BookTypes";
import { useCallback, useEffect } from "react";

export default function RecommendedPage() {
  const {
    recommendedBooks,
    fetchRecommendedBooks,
    loading,
    errors,
    currentPage,
    totalPages,
  } = useBookStore();

  useEffect(() => {
    if (recommendedBooks.length === 0) {
      const initialRequest: BookRecommendationRequest = {
        page: 1,
        limit: 10,
        title: "",
        author: "",
      };
      fetchRecommendedBooks(initialRequest);
    }
  }, [fetchRecommendedBooks, recommendedBooks.length]);

  const isRecommendedError = errors.recommendations;
  const isRecommendedLoading = loading.recommendations;

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      const initialRequest: BookRecommendationRequest = {
        page: currentPage + 1,
        limit: 2,
        title: "",
        author: "",
      };
      fetchRecommendedBooks(initialRequest);
    }
  }, [fetchRecommendedBooks, currentPage, totalPages]);

  const hasMorePages = currentPage < totalPages;

  return (
    <div className="relative">
      <h2 className="text-xl md:text-xxl text-milk-white mb-[34px] md:mb-[28px]">
        Recommended
      </h2>
      <EmblaCarousel
        hasMorePages={hasMorePages}
        handleNextPage={handleNextPage}
        isLoading={isRecommendedLoading}
        slides={recommendedBooks}
        error={isRecommendedError}
      />
    </div>
  );
}
