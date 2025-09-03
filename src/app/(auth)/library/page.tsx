"use client";

import EmblaCarousel from "@/components/EmblaCarousel/EmblaCarousel";
import { useBookStore } from "@/store/bookStore";
import { useEffect } from "react";

export default function LibraryPage() {
  const { userLibrary, fetchUserLibrary, isLoading, error } = useBookStore();
  useEffect(() => {
    // Initial fetch on component mount without any filter
    fetchUserLibrary();
  }, [fetchUserLibrary]);


  return (
    <div className="relative py-[20px]">
      <h2 className="text-xl md:text-xxl text-milk-white mb-[34px] md:mb-[28px]">
        My library
      </h2>
      {userLibrary.length > 0 ? (
        <EmblaCarousel
          error={error}
          isLoading={isLoading}
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
