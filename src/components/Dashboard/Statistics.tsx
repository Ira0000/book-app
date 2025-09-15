import { Media, MediaContextProvider } from "@/helpers/Media";
import { UserBookResponse } from "@/types/BookTypes";

type StatisticsPropsType = {
  bookDetails: UserBookResponse;
};

export default function Statistics({ bookDetails }: StatisticsPropsType) {
  const totalPages = bookDetails?.totalPages;

  const pagesRead: number =
    bookDetails?.progress.reduce(
      (total, session) => total + (session.finishPage - session.startPage),
      0
    ) || 0;

  const percentRead = (pagesRead * 100) / totalPages;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentRead / 100) * circumference;

  return (
    <div className="bg-grey rounded-[12px] gap-[20px] p-[20px] flex flex-col items-center">
      <MediaContextProvider>
        <div className="relative flex items-center justify-center size-[116px] md:size-[138px]">
          <Media lessThan="md">
            <svg
              className="absolute inset-0 -rotate-90"
              width="100%"
              height="100%"
              viewBox="0 0 116 116"
            >
              <circle
                cx="58"
                cy="58"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-grey-dark"
              />
              {/* Progress ring */}
              <circle
                cx="58"
                cy="58"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="text-green transition-all duration-500 ease-in-out"
              />
            </svg>
            <span className="text-milk-white text-xl font-medium">100%</span>
          </Media>
          <Media greaterThanOrEqual="md">
            <svg
              className="absolute inset-0 -rotate-90"
              width="100%"
              height="100%"
              viewBox="0 0 116 116"
            >
              <circle
                cx="58"
                cy="58"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-grey-dark"
              />
              {/* Progress ring */}
              <circle
                cx="58"
                cy="58"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="text-green transition-all duration-500 ease-in-out"
              />
            </svg>
            <span className="text-milk-white text-xl font-medium">100%</span>
          </Media>
        </div>
      </MediaContextProvider>
      <div className="flex flex-col">
        <div className="flex gap-[15px]">
          <div className="size-[14px] bg-green rounded-[4px]"></div>
          <div className="flex flex-col gap-1">
            <p className="text-large md:text-xl font-medium text-milk-white">
              {percentRead.toFixed(2)} %
            </p>
            <p className="text-light md:text-small text-grey-form">
              {pagesRead.toFixed(1)} pages read
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
