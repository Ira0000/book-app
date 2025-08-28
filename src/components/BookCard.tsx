import { Book } from "@/types/BookTypes";
import Image from "next/image";

type BookCardPropType = {
  slide: Book;
};

export default function BookCard({ slide }: BookCardPropType) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="rounded-[8px] relative w-full aspect-[137/208]">
        <Image
          className="rounded-[8px] object-cover"
          src={slide.imageUrl}
          fill
          sizes="auto"
          alt={`Cover of the book: ${slide.title} by ${slide.author}`}
        />
      </div>
      <div className="flex flex-col gap-[2px]">
        <h3 className="w-full text-large text-milk-white truncate">
          {slide.title}
        </h3>
        <p className="w-full text-small text-grey-form truncate">
          {slide.author}
        </p>
      </div>
    </div>
  );
}
