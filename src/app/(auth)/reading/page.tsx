"use client";

import { useBookStore } from "@/store/bookStore";
import Image from "next/image";

export default function ReadingPage() {
  const { selectedBook, isCurrentlyReading } = useBookStore();

  const isReading = selectedBook && isCurrentlyReading(selectedBook._id);

  return (
    <div className="flex flex-col  gap-5 py-[20px]">
      <h2 className="text-xl mb-5 text-milk-white">My reading</h2>
      {selectedBook && (
        <div className="w-full items-center flex flex-col gap-[5px]">
          <Image
            height={208}
            width={137}
            alt={`Cover of the book ${selectedBook.title} by ${selectedBook.author}`}
            src={selectedBook?.imageUrl}
            className="h-auto rounded-[8px] object-cover mb-[5px]"
          />
          <h3 className=" max-w-[137px] text-center text-large text-milk-white">
            {selectedBook.title}
          </h3>
          <p className="text-light text-grey-form">{selectedBook.author}</p>
        </div>
      )}

      <div className="mx-auto flex justify-center items-center rounded-full size-10  border-2 border-milk-white">
        {isReading ? (
          <div className="bg-red size-[15px] rounded-[3px]"></div>
        ) : (
          <div className="rounded-full  size-[30px] bg-red"></div>
        )}
      </div>
    </div>
  );
}
