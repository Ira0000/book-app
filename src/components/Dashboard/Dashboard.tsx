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
import { toast } from "react-toastify";

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

    try {
      await addBookToLibrary(requestData);
      openModal("addedToLibrary");
    } catch (error) {
      toast.error(`Something went wrong, try again later! ${error}`);
    }
  };

  const onStartReadingSubmit = async ({ page }: { page: number }) => {
    const bookId = selectedBook?._id;
    if (!bookId) {
      toast.error("No book is currently selected to start reading.");
      return;
    }
    try {
      const requestData = {
        id: bookId,
        page: page,
      };

      await startReading(requestData);

      toast.success("Reading session started successfully!");
    } catch (error) {
      toast.error(`Failed to start reading: ${error}`);
    }
  };

  const onStopReadingSubmit = async ({ page }: { page: number }) => {
    const bookId = selectedBook?._id;

    if (!bookId) {
      toast.error("No book is currently selected to stop reading.");
      return;
    }

    try {
      const requestData = {
        id: bookId,
        page: page,
      };
      await finishReading(requestData);
      toast.success("Reading session finished successfully");
    } catch (error) {
      toast.error(`Failed to finish reading: ${error}`);
    }
    if (selectedBook.totalPages === page) {
      openModal("bookFinished");
    }
  };

  const isHomePageActive = pathname === "/recommended";
  const isLibraryPageActive = pathname === "/library";
  const isReadingPageActive = pathname === "/reading";

  return (
    <div className=" bg-grey-dark rounded-[30px] p-[20px] md:p-8 lg:w-[30%] lg:py-10">
      {isHomePageActive && (
        <div className="flex flex-col md:flex-row gap-[20px] md:gap-8 size-full lg:flex-col lg:justify-between">
          <div className="md:order-2 md:w-[55%] lg:w-full flex flex-col lg:gap-[20px]">
            <LibraryLink />
            <div className="bg-grey  rounded-[12px] px-5 py-[15px] hidden lg:flex items-center justify-center gap-[14px]">
              <p className="text-[40px]">&#128218;</p>
              <p className="text-grey-form text-large font-medium">
                &#34;Books are <span className="text-milk-white">windows</span>{" "}
                to the world, and reading is a journey into the unknown.&#34;
              </p>
            </div>
          </div>
          <div className="md:order-1 md:w-[45%] lg:w-full">
            <FilterForm onSubmit={onFilterSubmit} />
          </div>
        </div>
      )}
      {isLibraryPageActive && (
        <div className="flex flex-col md:flex-row gap-[20px] md:gap-8 w-full lg:flex-col lg:size-full lg:justify-between">
          <div className="md:w-[50%] lg:w-full ">
            <AddBook onSubmit={onAddBookSubmit} />
          </div>
          <div className="md:w-[50%] lg:w-full ">
            <RecommendedLink
              recommendedBooks={recommendedBooks}
              isLoading={loading.recommendations}
            />
          </div>
        </div>
      )}
      {isReadingPageActive && selectedBook && (
        <div className="flex flex-col md:flex-row gap-[20px] md:gap-10 w-full lg:flex-col lg:justify-between ">
          <div className="md:w-[50%] lg:w-full ">
            <ReadingStartForm
              onSubmit={isReading ? onStopReadingSubmit : onStartReadingSubmit}
              buttonText={isReading ? "To Stop" : "To Start"}
              totalPages={selectedBook?.totalPages}
            />
          </div>
          <div className="md:w-[50%] lg:w-full ">
            <Details bookDetails={selectedBook} />
          </div>
        </div>
      )}
    </div>
  );
}
