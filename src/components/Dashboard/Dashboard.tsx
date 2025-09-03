"use client";

import { AddBookRequest, BookRecommendationRequest } from "@/types/BookTypes";
import FilterForm from "../Forms/FilterForm";
import { FilterRecommendedFormData } from "../Forms/schemas/filter-schemas";
import { useBookStore } from "@/store/bookStore";
import LibraryLink from "./LibraryLink";
import { usePathname } from "next/navigation";
import RecommendedLink from "./RecommendedLink";
import AddBook from "./AddBook";
import { useModal } from "../Providers/ModalProvider";

export default function Dashboard() {
  const {
    fetchRecommendedBooks,
    recommendedBooks,
    addBookToLibrary,
    isLoading,
  } = useBookStore();
  const pathname = usePathname();

  const { openModal } = useModal();

  const onFilterSubmit = async (data: FilterRecommendedFormData) => {
    const requestData: BookRecommendationRequest = {
      page: 1,
      limit: 10,
      title: data.title, // Optional search parameters
      author: data.author,
    };
    fetchRecommendedBooks(requestData);
  };

  const onAddBookSubmit = async (data: AddBookRequest) => {
    const requestData: AddBookRequest = {
      title: data.title,
      author: data.author,
      totalPages: data.totalPages,
    };
    addBookToLibrary(requestData);
    openModal("addedToLibrary");
    // console.log(requestData);
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
          <AddBook onSubmit={onAddBookSubmit} />{" "}
          <RecommendedLink
            recommendedBooks={recommendedBooks}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
