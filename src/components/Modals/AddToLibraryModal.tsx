/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Book } from "@/types/BookTypes";
import { useModal } from "../Providers/ModalProvider";
import Icon from "../Ui/Icon";
import BookCard from "../BookCard";
import { useBookStore } from "@/store/bookStore";

type AddToLibraryModalProps = {
  book: Book;
};

export default function AddToLibraryModal({ book }: AddToLibraryModalProps) {
  const { closeModal, openModal } = useModal();

  const { addBookToLibraryById } = useBookStore();

  const handleAddToLibrary = async (book: Book) => {
    try {
      await addBookToLibraryById(book);

      closeModal("addToLibrary");
      openModal("addedToLibrary");
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";

      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      closeModal("addToLibrary");
      openModal("error", { message: errorMessage });
    }
  };

  return (
    <div className="relative flex p-10 flex-col size-full items-center gap-[20px] text-milk-white">
      <button
        type="button"
        onClick={() => closeModal("addToLibrary")}
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
        onClick={() => handleAddToLibrary(book)}
        className="text-milk-white text-large px-6 bg-transparent py-3 rounded-[30px] border border-white-transp lg:cursor-pointer lg:hover:bg-milk-white lg:hover:text-grey-dark"
      >
        Add to library
      </button>
    </div>
  );
}
