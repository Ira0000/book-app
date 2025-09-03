"use client";

import { Book } from "@/types/BookTypes";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useModal } from "../Providers/ModalProvider";
import BookCard from "../BookCard";
import Loader from "../Ui/Loader";

type EmblaCarouselSmallPropsType = {
  slides: Book[];
  options?: EmblaOptionsType;
  isLoading?: boolean;
};

export default function EmblaCarouselSmall({
  slides,
  isLoading = false,
}: EmblaCarouselSmallPropsType) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: 1,
  });

  const { openModal } = useModal();

  const handleOnCoverClick = (slide: Book) => {
    openModal("addToLibrary", slide as Book);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="overflow-hidden w-full" ref={emblaRef}>
      <ul className="flex w-full gap-[21px]">
        {slides.map((slide, index) => (
          <li
            key={`mobile-${slide._id}`}
            className="flex-none min-w-0 shrink-0 grow-0 w-[calc((100%-42px)/3)]"
          >
            <BookCard
              index={index}
              imagePriority={3}
              slide={slide as Book}
              handleOnCoverClick={handleOnCoverClick}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
