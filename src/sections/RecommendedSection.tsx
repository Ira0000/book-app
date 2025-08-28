"use client";

import EmblaCarousel from "@/components/EmblaCarousel/EmblaCarousel";
import { Book } from "@/types/BookTypes";

type RecommendedSectionType = {
  isLoading: boolean;
  error: string | null;
  recommendedBooks: Book[];
};

export default function RecommendedSection({
  isLoading,
  error,
  recommendedBooks,
}: RecommendedSectionType) {
  if (isLoading) {
    return <div>Loading recommended books...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (recommendedBooks.length < 1) {
    return <div>No books found</div>;
  }

  return (
    <div className="relative">
      <h2 className="text-xl text-milk-white mb-[34px]">Recommended</h2>
      <EmblaCarousel slides={recommendedBooks} />
    </div>
  );
}
