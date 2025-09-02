"use client";

import EmblaCarousel from "@/components/EmblaCarousel/EmblaCarousel";
import { useBookStore } from "@/store/bookStore";
import { BookRecommendationRequest } from "@/types/BookTypes";
import { useEffect } from "react";

export default function RecommendedPage() {
  const { recommendedBooks, fetchRecommendedBooks, isLoading } = useBookStore();
  useEffect(() => {
    // Initial fetch on component mount without any filter
    const initialRequest: BookRecommendationRequest = {
      page: 1,
      limit: 10,
      title: "",
      author: "",
    };
    fetchRecommendedBooks(initialRequest);
  }, [fetchRecommendedBooks]);

  if (isLoading) {
    return <div>Loading recommended books...</div>;
  }
  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  if (recommendedBooks.length < 1) {
    return <div>No books found</div>;
  }

  // if (recommendedBooks.length > 1) {
  //   console.log(recommendedBooks);
  // }

  return (
    <div className="relative">
      <h2 className="text-xl md:text-xxl text-milk-white mb-[34px] md:mb-[28px]">
        Recommended
      </h2>
      <EmblaCarousel slides={recommendedBooks} />
    </div>
  );
}
