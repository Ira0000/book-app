"use client";

import { Book } from "@/types/BookTypes";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import usePrevNextButtons from "@/hooks/usePrevNextButtons";
import ArrowButton from "./ArrowButton";
import BookCard from "../BookCard";

type EmblaCarouselType = {
  slides: Book[];
  options?: EmblaOptionsType;
};

export default function EmblaCarousel({ slides, options }: EmblaCarouselType) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    skipSnaps: false,
    breakpoints: {
      "(max-width: 1023px)": { slidesToScroll: 1 },
      "(min-width: 1024px)": { slidesToScroll: "auto", dragFree: true },
    },
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="max-w-full">
      {/* Controls */}
      <div className="absolute right-0 top-0 z-10 flex gap-2">
        <ArrowButton
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
          isLeft={true}
        />
        <ArrowButton
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
          isLeft={false}
        />
      </div>

      {/* Carousel */}

      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="flex md:flex-wrap gap-[21px]">
          {slides.map((slide) => (
            <li className="w-[137px]" key={slide._id}>
              <BookCard slide={slide} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
