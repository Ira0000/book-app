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
import { toast } from "react-toastify";

type EmblaCarouselPropsType = {
  hasMorePages?: boolean;
  slides: Book[] | UserBookResponse[];
  options?: EmblaOptionsType;
  isLibraryPage?: boolean;
  isButtonsVisible?: boolean;
  carouselStyle?: string;
  isLoading?: boolean;
  error?: any;
  handleNextPage?: () => void;
};

export default function EmblaCarousel({
  handleNextPage,
  hasMorePages = false,
  isButtonsVisible = true,
  slides,
  isLibraryPage,
  carouselStyle,
  isLoading = false,
  error,
}: EmblaCarouselPropsType) {
  const options: EmblaOptionsType = {
    align: "start",
    loop: false,
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: 1,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, handleNextPage, hasMorePages);

  const { openModal } = useModal();
  const { deleteBookFromLibrary } = useBookStore();

  function groupSlides<T>(slides: T[], maxPerGroup = 2, groups = 4): T[][] {
    const grouped: T[][] = Array.from({ length: groups }, () => []);

    slides.forEach((num, i) => {
      if (i < groups) {
        // Fill the initial groups (one item each)
        grouped[i].push(num);
      } else {
        const targetIndex = (i - groups) % groups;

        if (grouped[targetIndex].length < maxPerGroup) {
          grouped[targetIndex].push(num);
        } else {
          // Once initial groups are full, start creating new groups
          const extraIndex = i - groups * maxPerGroup;
          const newIndex = groups + Math.floor(extraIndex / maxPerGroup);

          if (!grouped[newIndex]) {
            grouped[newIndex] = [];
          }
          grouped[newIndex].push(num);
        }
      }
    });
    return grouped;
  }

  const groupedSlidesTablet = groupSlides(slides);
  const groupedSlidesDesktop = groupSlides(slides, 2, 5);

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

  const arrowButtonClass = isLibraryPage ? "bottom-0" : "top-0";

  if (isLoading && slides.length === 0) {
    return <Loader />;
  }

  if (slides.length === 0 && !isLoading) {
    return <div>No books found</div>;
  }

  if (error) {
    toast.error(`Something went wrong: ${error}`);
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

          {/* Carousel tablet */}

          <Media between={["md", "lg"]}>
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <ul className="flex w-full gap-[25px] lg:gap-[20px]">
                {groupedSlidesTablet.map((slideGroup, groupIndex) => (
                  <li
                    key={groupIndex}
                    className={`flex-none min-w-0 shrink-0 grow-0 w-[calc((100%-75px)/4)] lg:w-[calc((100%-80px)/5)] ${carouselStyle}`}
                  >
                    <ul className="flex flex-col gap-[27px]">
                      {slideGroup.map((slide, slideIndexInGroup) => {
                        const actualSlideIndex =
                          groupIndex * 2 + slideIndexInGroup;

                        return (
                          <li
                            key={`tablet-${slide._id}`}
                            className="cursor-pointer"
                          >
                            <BookCard
                              index={actualSlideIndex}
                              imagePriority={8}
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

          {/* Carousel desktop */}

          <Media greaterThanOrEqual="lg">
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <ul className="flex w-full gap-[25px] lg:gap-[20px]">
                {groupedSlidesDesktop.map((slideGroup, groupIndex) => (
                  <li
                    key={groupIndex}
                    className={`flex-none min-w-0 shrink-0 grow-0 w-[calc((100%-75px)/4)] lg:w-[calc((100%-80px)/5)] ${carouselStyle}`}
                  >
                    <ul className="flex flex-col gap-[27px]">
                      {slideGroup.map((slide, slideIndexInGroup) => {
                        const actualSlideIndex =
                          groupIndex * 2 + slideIndexInGroup;

                        return (
                          <li
                            key={`tablet-${slide._id}`}
                            className="cursor-pointer"
                          >
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
