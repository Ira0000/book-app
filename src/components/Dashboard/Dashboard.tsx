"use client";

import { BookRecommendationRequest } from "@/types/BookTypes";
import FilterForm from "../Forms/FilterForm";
import { FilterRecommendedFormData } from "../Forms/schemas/filter-schemas";
import { useBookStore } from "@/store/bookStore";
import LibraryLink from "./LibraryLink";
import { usePathname } from "next/navigation";
import RecommendedLink from "./RecommendedLink";
import AddBook from "./AddBook";

export default function Dashboard() {
  const { fetchRecommendedBooks } = useBookStore();
  const pathname = usePathname();
  const onFilterSubmit = async (data: FilterRecommendedFormData) => {
    const requestData: BookRecommendationRequest = {
      page: 1,
      limit: 10,
      title: data.title, // Optional search parameters
      author: data.author,
    };
    fetchRecommendedBooks(requestData);
  };

  const onAddBookSubmit = async (data: FilterRecommendedFormData) => {
    const requestData: BookRecommendationRequest = {
      page: 1,
      limit: 10,
      title: data.title, // Optional search parameters
      author: data.author,
    };
    fetchRecommendedBooks(requestData);
  };

  const isHomePageActive = pathname === "/recommended";
  const isLibraryPageActive = pathname === "/library";

  return (
    <div className="flex flex-col gap-[20px] bg-grey-dark rounded-[30px] p-[20px] md:p-8">
      {isHomePageActive && (
        <>
          <LibraryLink />
          <FilterForm onSubmit={onFilterSubmit} />
        </>
      )}
      {isLibraryPageActive && (
        <>
          <AddBook onSubmit={onAddBookSubmit} /> <RecommendedLink />
        </>
      )}
    </div>
  );
}
