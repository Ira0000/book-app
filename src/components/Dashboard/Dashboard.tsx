"use client";

import { BookRecommendationRequest } from "@/types/BookTypes";
import FilterForm from "../Forms/FilterForm";
import { FilterRecommendedFormData } from "../Forms/schemas/filter-schemas";
import { useBookStore } from "@/store/bookStore";
import LibraryLink from "./LibraryLink";

export default function Dashboard() {
  const { fetchRecommendedBooks } = useBookStore();

  const onFilterSubmit = async (data: FilterRecommendedFormData) => {
    const requestData: BookRecommendationRequest = {
      page: 1,
      limit: 10,
      title: data.title, // Optional search parameters
      author: data.author,
    };
    fetchRecommendedBooks(requestData);
  };
  return (
    <div className="flex flex-col gap-[20px] bg-grey-dark rounded-[30px] p-[20px] md:p-8">
      <FilterForm onSubmit={onFilterSubmit} />
      <LibraryLink />
    </div>
  );
}
