"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export default function usePrevNextButtons(
  emblaApi: EmblaCarouselType | undefined,
  onNextPage?: () => void,
  hasMorePages?: boolean
): UsePrevNextButtonsType {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [isLoadingNewPage, setIsLoadingNewPage] = useState(false);
  const previousSlideCount = useRef(0);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;

    if (emblaApi.canScrollNext()) {
      // Normal scroll - there are more slides to show
      emblaApi.scrollNext();
    } else if (hasMorePages && onNextPage && !isLoadingNewPage) {
      // Load next page - we're at the end but more data exists
      setIsLoadingNewPage(true);
      onNextPage();
    }
  }, [emblaApi, onNextPage, hasMorePages, isLoadingNewPage]);

  // Handle button states
  const updateButtonStates = useCallback(
    (emblaApi: EmblaCarouselType) => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev());

      const canScrollNext = emblaApi.canScrollNext();
      const canLoadMore = hasMorePages && onNextPage && !isLoadingNewPage;

      setNextBtnDisabled(!canScrollNext && !canLoadMore);
    },
    [hasMorePages, onNextPage, isLoadingNewPage]
  );

  const slideCount = emblaApi ? emblaApi.slideNodes().length : 0;

  // Handle new slides being added
  useEffect(() => {
    if (!emblaApi) return;

    const currentSlideCount = slideCount;
    const hasNewSlides = currentSlideCount > previousSlideCount.current;

    if (hasNewSlides && isLoadingNewPage) {
      // New slides were added after we requested them
      const timeoutId = setTimeout(() => {
        emblaApi.reInit(); // Reinitialize carousel with new slides
        emblaApi.scrollNext(); // Scroll to show new content
        setIsLoadingNewPage(false); // Reset loading state
      }, 50); // Small delay to ensure DOM is updated

      return () => clearTimeout(timeoutId);
    }

    // Always update the slide count reference
    previousSlideCount.current = currentSlideCount;
  }, [slideCount, emblaApi, isLoadingNewPage]);

  // Set up event listeners
  useEffect(() => {
    if (!emblaApi) return;

    updateButtonStates(emblaApi);
    emblaApi.on("reInit", updateButtonStates);
    emblaApi.on("select", updateButtonStates);

    return () => {
      emblaApi.off("reInit", updateButtonStates);
      emblaApi.off("select", updateButtonStates);
    };
  }, [emblaApi, updateButtonStates]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
}
