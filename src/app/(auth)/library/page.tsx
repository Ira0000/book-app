"use client";

import BookStatusFilter from "@/components/BookStatusFilter";
import EmblaCarousel from "@/components/EmblaCarousel/EmblaCarousel";
import { useBookStore } from "@/store/bookStore";
import { BookStatus } from "@/types/BookTypes";
import { useEffect, useState } from "react";

const status: string[] = ["All books", "Unread", "In progress", "Done"];
const statusMapping: Record<string, BookStatus | ""> = {
  "All books": "",
  "In progress": "in-progress",
  Unread: "unread",
  Done: "done",
};

export default function LibraryPage() {
  const { userLibrary, fetchUserLibrary, loading, errors, clearError } =
    useBookStore();
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | string>(
    status[0]
  );

  useEffect(() => {
    const statusForFetch = statusMapping[selectedStatus];
    fetchUserLibrary(statusForFetch);
  }, [fetchUserLibrary, selectedStatus]);

  const handleSelect = (value: string) => {
    setSelectedStatus(value);
    if (libraryError) {
      clearError("userLibrary");
    }
  };

  const isLibraryLoading = loading.userLibrary;
  const libraryError = errors.userLibrary;
  // const isButtonsVisible: boolean = userLibrary && userLibrary.length > 7;

  return (
    <div className="relative pt-[20px] pb-[40px]">
      <div className="flex justify-between mb-[34px] md:mb-[28px]">
        <h2 className="text-xl md:text-xxl text-milk-white ">My library</h2>
        <BookStatusFilter
          selectedStatus={selectedStatus}
          handleSelect={handleSelect}
          statusList={status}
        />
      </div>
      {userLibrary.length > 0 ? (
        <EmblaCarousel
          // isButtonsVisible={isButtonsVisible}
          error={libraryError}
          isLoading={isLibraryLoading}
          slides={userLibrary}
          isLibraryPage={true}
        />
      ) : (
        <div className="flex flex-col justify-center items-center gap-[10px] mb-[20px]">
          <div className="flex items-center justify-center rounded-full size-[100px] bg-grey text-[50px]">
            📚
          </div>
          <div className="text-milk-white text-large font-medium text-center max-w-[200px] ">
            To start training, add{" "}
            <span className="text-grey-form">some of your books</span> or from
            the recommended ones
          </div>
        </div>
      )}
    </div>
  );
}
