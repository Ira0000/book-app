import { Book } from "@/types/BookTypes";
import EmblaCarouselSmall from "../EmblaCarousel/EmblaCarouselSmall";
import Link from "next/link";
import Icon from "../Ui/Icon";

type RecommendedLinkPropsType = {
  recommendedBooks: Book[];
  isLoading?: boolean;
};

export default function RecommendedLink({
  recommendedBooks,
  isLoading = false,
}: RecommendedLinkPropsType) {
  return (
    <div className="flex flex-col w-full gap-[15px] bg-grey rounded-xl p-[20px]">
      <h3 className="text-large text-milk-white text-[18px]">
        Recommended books
      </h3>
      <EmblaCarouselSmall isLoading={isLoading} slides={recommendedBooks} />
      <div className="mt-[5px] flex justify-between items-center">
        <Link
          href={"/recommended"}
          className="text-large font-medium text-grey-form underline"
        >
          Home
        </Link>
        <Link href={"/recommended"}>
          <Icon id="icon-arrow-r" w={24} h={24} className="stroke-milk-white" />
        </Link>
      </div>
    </div>
  );
}
