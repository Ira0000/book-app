"use client";

import FilterForm from "@/forms/FilterForm";
import { FilterRecommendedFormData } from "@/forms/schemas/filter-schemas";
import RecommendedSection from "@/sections/RecommendedSection";
// import { useAuthStore } from "@/store/authStore";
import { useBookStore } from "@/store/bookStore";
import { BookRecommendationRequest } from "@/types/BookTypes";
import { useEffect } from "react";

export default function HomePage() {
  const { recommendedBooks, isLoading, error, fetchRecommendedBooks } =
    useBookStore();
  // const { isAuthenticated } = useAuthStore();

  const onFilterSubmit = async (data: FilterRecommendedFormData) => {
    const requestData: BookRecommendationRequest = {
      page: 1,
      limit: 10,
      title: data.title, // Optional search parameters
      author: data.author,
    };
    fetchRecommendedBooks(requestData);
  };

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

  useEffect(() => {
    if (recommendedBooks.length > 0) {
      console.log(recommendedBooks);
    }
  }, [recommendedBooks]);

  return (
    <div>
      Home Page
      <div className="bg-grey-dark rounded-[30px] p-[20px]">
        <FilterForm onSubmit={onFilterSubmit} />
      </div>
      <div className="bg-grey-dark rounded-[30px] px-[20px] py-10">
        <RecommendedSection
          isLoading={isLoading}
          error={error}
          recommendedBooks={recommendedBooks}
        />
      </div>
    </div>
  );
}
