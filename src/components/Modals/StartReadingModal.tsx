"use client";

import { UserBookResponse } from "@/types/BookTypes";
import { useModal } from "../Providers/ModalProvider";
import Icon from "../Ui/Icon";
import BookCard from "../BookCard";
import { useRouter } from "next/navigation";
import { useBookStore } from "@/store/bookStore";

type StartReadingModalProps = {
  book?: UserBookResponse | null;
};

export default function StartReadingModal({ book }: StartReadingModalProps) {
  const { closeModal } = useModal();
  const router = useRouter();
  const { setSelectedBook } = useBookStore();

  const handleStartReading = async (bookData: UserBookResponse) => {
    setSelectedBook(bookData);
    closeModal("startReading");
    router.push(`/reading`);
  };

  if (!book) {
    return <div>No book data available.</div>;
  }

  return (
    <div className="relative flex p-10 flex-col size-full items-center gap-[20px] text-milk-white">
      <button
        type="button"
        onClick={() => closeModal("startReading")}
        className="absolute top-4 right-4 size-[22px] flex items-center justify-center lg:cursor-pointer"
      >
        <Icon id="icon-x" w={22} h={22} className="text-white " />
      </button>
      <div className="flex flex-col gap-1 items-center">
        <BookCard
          slide={book}
          imageStyle="w-[140px] h-[213px]"
          wrapperStyle="items-center jestify-center"
          textStyle="text-wrap text-center"
        />
        <p className="text-light">{book.totalPages} pages</p>
      </div>
      <button
        type="button"
        onClick={() => handleStartReading(book)}
        className="text-milk-white text-large px-6 bg-transparent py-3 rounded-[30px] border border-white-transp lg:cursor-pointer lg:hover:bg-milk-white lg:hover:text-grey-dark"
      >
        Start Reading
      </button>
    </div>
  );
}
