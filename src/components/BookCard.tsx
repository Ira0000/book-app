import { Book } from "@/types/BookTypes";
import Image from "next/image";

type BookCardPropType = {
  slide: Book;
  imageStyle?: string;
  wrapperStyle?: string;
  textStyle?: string;
};

export default function BookCard({
  slide,
  imageStyle,
  wrapperStyle,
  textStyle,
}: BookCardPropType) {
  return (
    <div className={`w-full flex flex-col gap-2 ${wrapperStyle}`}>
      <div className={`rounded-[8px] relative aspect-[137/208] ${imageStyle}`}>
        <Image
          className="rounded-[8px] object-cover"
          src={slide.imageUrl}
          fill
          sizes="auto"
          alt={`Cover of the book: ${slide.title} by ${slide.author}`}
        />
      </div>
      <div className="flex flex-col gap-[2px]">
        <h3
          className={`w-full text-large text-milk-white truncate ${textStyle}`}
        >
          {slide.title}
        </h3>
        <p className={`w-full text-small text-grey-form truncate ${textStyle}`}>
          {slide.author}
        </p>
      </div>
    </div>
  );
}
