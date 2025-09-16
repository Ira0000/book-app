"use client";

import { useBookStore } from "@/store/bookStore";
import Image from "next/image";

export default function ReadingPage() {
  const { selectedBook, isCurrentlyReading } = useBookStore();

  const isReading = selectedBook && isCurrentlyReading(selectedBook._id);
  console.log(selectedBook);

  const timeLeftToRead = (() => {
    const time = selectedBook?.timeLeftToRead;
    const status = selectedBook?.status;
    // const { hours, minutes } = time;

    if (!time && status !== "done") {
      return "Start reading to see progress";
    }

    if (
      !time ||
      status === "done" ||
      (time.hours === 0 && time.minutes === 0)
    ) {
      return "Book read";
    }

    const parts = [];
    if (time.hours > 0)
      parts.push(`${time.hours} hour${time.hours > 1 ? "s" : ""}`);
    if (time.minutes > 0)
      parts.push(`${time.minutes} minute${time.minutes > 1 ? "s" : ""}`);

    return `${parts.join(" and ")} left`;
  })();

  return (
    <div className="flex flex-col  gap-5 py-[20px] md:gap-8 lg:gap-11">
      <div className="flex justify-between items-center mb-5 md:mb-3">
        <h2 className="text-xl  md:text-xxl text-milk-white">My reading</h2>
        <p className="hiiden md:block text-small md:text-large text-grey-form font-medium md:font-bold">
          {timeLeftToRead}
        </p>
      </div>
      {selectedBook && (
        <div className="w-full items-center flex flex-col gap-[5px] ">
          {selectedBook.imageUrl ? (
            <Image
              height={208}
              width={137}
              alt={`Cover of the book ${selectedBook.title} by ${selectedBook.author}`}
              src={selectedBook?.imageUrl}
              className="h-auto rounded-[8px] object-cover mb-[5px] md:mb-5 md:w-[169px] md:h-[256px] lg:w-[224px] lg:h-[340px]"
            />
          ) : (
            <div className="py-[114px] px-[25px] mb-[5px] bg-grey md:w-[169px] md:h-[256px] text-milk-white flex  text-xl items-center lg:w-[224px] lg:h-[340px] justify-center rounded-[8px] object-cover md:mb-5">
              <Image
                className=""
                height={112}
                width={174}
                src={"/images/book_cover.avif"}
                alt="picture of an open book"
              />
            </div>
          )}
          <h3 className=" max-w-[137px] md:max-w-[60%] md:text-xl text-center text-large text-milk-white">
            {selectedBook.title}
          </h3>
          <p className="text-light md:text-large md:font-medium text-grey-form">
            {selectedBook.author}
          </p>
        </div>
      )}

      <div className="mx-auto flex justify-center items-center rounded-full size-10 md:size-[50px]  border-2 border-milk-white">
        {isReading ? (
          <div className="bg-red size-[15px] md:size-[20px] rounded-[3px]"></div>
        ) : (
          <div className="rounded-full  size-[30px] md:size-10 bg-red"></div>
        )}
      </div>
    </div>
  );
}
