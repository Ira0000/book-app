"use client";

import { Book } from "@/types/BookTypes";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import usePrevNextButtons from "@/hooks/usePrevNextButtons";
import ArrowButton from "./ArrowButton";
import BookCard from "../BookCard";
import { Media, MediaContextProvider } from "@/helpers/Media";

type EmblaCarouselType = {
  slides: Book[];
  options?: EmblaOptionsType;
};

export default function EmblaCarousel({ slides }: EmblaCarouselType) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    skipSnaps: false,
    breakpoints: {
      "(max-width: 767px)": {
        slidesToScroll: 1,
      },
      "(min-width: 768px)": {
        slidesToScroll: 2,
      },
    },
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const groupedSlides = [];
  for (let i = 0; i < slides.length; i += 2) {
    groupedSlides.push(slides.slice(i, i + 2));
    console.log(groupedSlides);
  }

  return (
    <>
      <MediaContextProvider>
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

          {/* Carousel mobile */}
          <Media lessThan="md">
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <ul className="flex w-full gap-[21px] md:flex-wrap md:gap-[25px] lg:gap-[20px]">
                {slides.map((slide) => (
                  <li
                    key={`mobile-${slide._id}`}
                    className="flex-none min-w-0 shrink-0 grow-0 w-[calc((100%-21px)/2)] md:w-[calc((100%-75px)/4)] lg:w-[calc((100%-80px)/5)]"
                  >
                    <BookCard slide={slide} />
                  </li>
                ))}
              </ul>
            </div>
          </Media>

          {/* Carousel tablet and desktop */}

          <Media greaterThanOrEqual="md">
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <ul className="flex w-full gap-[21px] md:gap-[25px] lg:gap-[20px]">
                {groupedSlides.map((slideGroup, index) => (
                  <li
                    key={index}
                    className="flex-none min-w-0 shrink-0 grow-0 w-[calc((100%-21px)/2)] md:w-[calc((100%-75px)/4)] lg:w-[calc((100%-80px)/5)]"
                  >
                    <ul className="flex flex-col gap-[27px]">
                      {slideGroup.map((slide) => {
                        return (
                          <li key={`tablet-${slide._id}`}>
                            <BookCard slide={slide} />
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </Media>
        </div>
      </MediaContextProvider>
    </>
  );
}
