import { Book, UserBookResponse } from "@/types/BookTypes";
import Image from "next/image";
import Icon from "./Ui/Icon";
import { cn } from "@/lib/cn";

type BookCardPropType = {
  slide: Book;
  imageStyle?: string;
  wrapperStyle?: string;
  textStyle?: string;
  isLibraryPage?: boolean;
  handleDeleteBook?: (id: string) => void;
  handleOnCoverClick?: (slide: Book | UserBookResponse) => void;
};

export default function BookCard({
  slide,
  imageStyle,
  wrapperStyle,
  textStyle,
  isLibraryPage,
  handleDeleteBook,
  handleOnCoverClick,
}: BookCardPropType) {
  return (
    <div className={`w-full flex flex-col gap-2 ${wrapperStyle}`}>
      <div
        onClick={() => handleOnCoverClick && handleOnCoverClick(slide)}
        className={`rounded-[8px] relative aspect-[137/208] ${imageStyle}`}
      >
        <Image
          className="rounded-[8px] object-cover"
          src={slide.imageUrl}
          fill
          sizes="auto"
          alt={`Cover of the book: ${slide.title} by ${slide.author}`}
        />
      </div>
      <div className="flex items-center w-full justify-between">
        <div
          className={cn("flex flex-col gap-[2px] ", {
            "max-w-[80%]": isLibraryPage,
            "w-full": !isLibraryPage,
          })}
        >
          <h3
            className={`w-full text-large text-milk-white truncate ${textStyle}`}
          >
            {slide.title}
          </h3>
          <p
            className={`w-full text-small text-grey-form truncate ${textStyle}`}
          >
            {slide.author}
          </p>
        </div>
        {isLibraryPage && handleDeleteBook && (
          <button
            type="button"
            onClick={() => handleDeleteBook(slide._id)}
            className="size-7 shrink-0 rounded-full flex justify-center items-center border bg-red-border/20 border-red-border/10"
          >
            <Icon
              id="icon-trash"
              w={14}
              h={14}
              className="stroke-red-border fill-transparent"
            />
          </button>
        )}
      </div>
    </div>
  );
}
