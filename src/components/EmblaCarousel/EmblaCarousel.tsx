/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Book, UserBookResponse } from "@/types/BookTypes";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import usePrevNextButtons from "@/hooks/usePrevNextButtons";
import ArrowButton from "./ArrowButton";
import BookCard from "../BookCard";
import { Media, MediaContextProvider } from "@/helpers/Media";
import { useModal } from "../Providers/ModalProvider";
import { useBookStore } from "@/store/bookStore";
import Loader from "../Ui/Loader";

type EmblaCarouselPropsType = {
  slides: Book[] | UserBookResponse[];
  options?: EmblaOptionsType;
  isLibraryPage?: boolean;
  isButtonsVisible?: boolean;
  carouselStyle?: string;
  isLoading?: boolean;
  error?: any;
};

export default function EmblaCarousel({
  isButtonsVisible = true,
  slides,
  isLibraryPage,
  carouselStyle,
  isLoading = false,
  error,
}: EmblaCarouselPropsType) {
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

  const { openModal } = useModal();
  const { deleteBookFromLibrary } = useBookStore();
  const groupedSlides = [];
  for (let i = 0; i < slides.length; i += 2) {
    groupedSlides.push(slides.slice(i, i + 2));
    // console.log(groupedSlides);
  }

  const handleOnCoverClick = (slide: Book | UserBookResponse) => {
    if (isLibraryPage) {
      openModal("startReading", slide as UserBookResponse);
    } else {
      openModal("addToLibrary", slide as Book);
    }
  };

  const handleDeleteBook = (id: string) => {
    deleteBookFromLibrary(id);
  };

  const arrowButtonClass = isLibraryPage && "bottom-0";

  if (isLoading) {
    return <Loader />;
  }

  if (slides.length < 1) {
    return <div>No books found</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <MediaContextProvider>
        <div className="max-w-full">
          {/* Controls */}
          {isButtonsVisible && (
            <div
              className={`absolute h-8 right-0  z-10 flex gap-2 ${arrowButtonClass}`}
            >
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
          )}

          {/* Carousel mobile */}
          <Media lessThan="md">
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <ul className="flex w-full gap-[21px]">
                {slides.map((slide, index) => (
                  <li
                    key={`mobile-${slide._id}`}
                    className={`flex-none min-w-0 shrink-0 grow-0 w-[calc((100%-21px)/2)] ${carouselStyle}`}
                  >
                    <BookCard
                      index={index}
                      imagePriority={2}
                      slide={slide as Book}
                      isLibraryPage={isLibraryPage}
                      handleDeleteBook={handleDeleteBook}
                      handleOnCoverClick={handleOnCoverClick}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Media>

          {/* Carousel tablet and desktop */}

          <Media greaterThanOrEqual="md">
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <ul className="flex w-full gap-[21px] md:gap-[25px] lg:gap-[20px]">
                {groupedSlides.map((slideGroup, groupIndex) => (
                  <li
                    key={groupIndex}
                    className={`flex-none min-w-0 shrink-0 grow-0 w-[calc((100%-21px)/2)] md:w-[calc((100%-75px)/4)] lg:w-[calc((100%-80px)/5)] ${carouselStyle}`}
                  >
                    <ul className="flex flex-col gap-[27px]">
                      {slideGroup.map((slide, slideIndexInGroup) => {
                        const actualSlideIndex =
                          groupIndex * 2 + slideIndexInGroup;

                        return (
                          <li key={`tablet-${slide._id}`}>
                            <BookCard
                              index={actualSlideIndex}
                              imagePriority={10}
                              slide={slide as Book}
                              isLibraryPage={isLibraryPage}
                              handleDeleteBook={handleDeleteBook}
                              handleOnCoverClick={handleOnCoverClick}
                            />
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
