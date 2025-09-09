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
import Details from "./Details";
import ReadingStartForm from "../Forms/ReadingStartForm";

export default function Dashboard() {
  const {
    fetchRecommendedBooks,
    recommendedBooks,
    addBookToLibrary,
    loading,
    startReading,
    selectedBook,
    finishReading,
    isCurrentlyReading,
  } = useBookStore();
  const pathname = usePathname();

  const { openModal } = useModal();

  const isReading = selectedBook && isCurrentlyReading(selectedBook._id);

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

  const onStartReadingSubmit = async ({ page }: { page: number }) => {
    const bookId = selectedBook?._id;
    if (!bookId) {
      // Handle the case where no book is selected
      console.error("No book is currently selected to start reading.");
      return;
    }
    try {
      const requestData = {
        id: bookId,
        page: page,
      };

      await startReading(requestData);

      // setIsReading(true);
      console.log("✅ Reading session started successfully:", requestData);
    } catch (error) {
      console.error("❌ Failed to start reading:", error);
    }
  };

  const onStopReadingSubmit = async ({ page }: { page: number }) => {
    const bookId = selectedBook?._id;

    if (!bookId) {
      console.error("No book is currently selected to stop reading.");
      return;
    }

    try {
      const requestData = {
        id: bookId,
        page: page,
      };
      await finishReading(requestData);
      // setIsReading(false);
      console.log("✅ Reading session finished successfully:", requestData);
    } catch (error) {
      console.error("❌ Failed to finish reading:", error);
    }
  };

  const isHomePageActive = pathname === "/recommended";
  const isLibraryPageActive = pathname === "/library";
  const isReadingPageActive = pathname === "/reading";

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
            isLoading={loading.recommendations}
          />
        </>
      )}
      {isReadingPageActive && selectedBook && (
        <>
          <ReadingStartForm
            onSubmit={isReading ? onStopReadingSubmit : onStartReadingSubmit}
            buttonText={isReading ? "To Stop" : "To Start"}
            totalPages={selectedBook?.totalPages}
          />
          <Details bookDetails={selectedBook} />
        </>
      )}
    </div>
  );
}
