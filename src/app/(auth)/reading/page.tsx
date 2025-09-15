"use client";

import {
  calculateTimeLeftToRead,
  formatTimeLeft,
  formatTimeReadInMinutes,
} from "@/lib/dateFormat";
import { useBookStore } from "@/store/bookStore";
import Image from "next/image";

export default function ReadingPage() {
  const { selectedBook, isCurrentlyReading } = useBookStore();

  const isReading = selectedBook && isCurrentlyReading(selectedBook._id);

  const pagesRead: number =
    selectedBook?.progress.reduce(
      (total, session) => total + (session.finishPage - session.startPage),
      0
    ) || 0;
  const timeRead: number =
    selectedBook?.progress.reduce(
      (total, session) =>
        total +
        formatTimeReadInMinutes(session.startReading, session.finishReading),
      0
    ) || 0;

  const timeLeftInMinutes = selectedBook
    ? calculateTimeLeftToRead(selectedBook.totalPages, pagesRead, timeRead)
    : null;

  return (
    <div className="flex flex-col  gap-5 py-[20px]">
      <div className="flex justify-between">
        <h2 className="text-xl mb-5 md:text-xxl text-milk-white">My reading</h2>
        <p className="hiiden md:block text-larg text-grey-form font-medium">
          {timeLeftInMinutes !== null
            ? formatTimeLeft(timeLeftInMinutes)
            : "Start reading to see progress"}
        </p>
      </div>
      {selectedBook && (
        <div className="w-full items-center flex flex-col gap-[5px]">
          <Image
            height={208}
            width={137}
            alt={`Cover of the book ${selectedBook.title} by ${selectedBook.author}`}
            src={selectedBook?.imageUrl}
            className="h-auto rounded-[8px] object-cover mb-[5px] md:w-[169px]"
          />
          <h3 className=" max-w-[137px] md:max-w-[60%] md:text-xl text-center text-large text-milk-white">
            {selectedBook.title}
          </h3>
          <p className="text-light md:text-large md:font-medium text-grey-form">
            {selectedBook.author}
          </p>
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
