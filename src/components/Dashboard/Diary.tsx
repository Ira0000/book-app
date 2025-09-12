import {
  formatDate,
  formatReadingSpeed,
  formatTimeRead,
} from "@/lib/dateFormat";
import { UserBookResponse } from "@/types/BookTypes";
import Icon from "../Ui/Icon";

type DiaryPropsType = {
  bookDetails: UserBookResponse;
  onDeleteSessionClick: (readingId: string, bookId: string) => void;
};

export default function Diary({
  bookDetails,
  onDeleteSessionClick,
}: DiaryPropsType) {
  return (
    <ul className="bg-grey rounded-[12px] pt-4 pl-[23px] pr-4">
      {bookDetails.progress.map((item) => {
        const formattedDate = formatDate(item.startReading);
        const pagesRead = item.finishPage - item.startPage;
        const percentRead = (
          (pagesRead * 100) /
          bookDetails.totalPages
        ).toFixed(1);

        const formattedTimeRead = formatTimeRead(
          item.startReading,
          item.finishReading
        );

        const speed = formatReadingSpeed(
          item.startPage,
          item.finishPage,
          item.startReading,
          item.finishReading
        );

        if (item.finishReading)
          return (
            <li
              className="flex relative pl-4 pb-4 gap-[6px] border-l-2 border-grey-dark items-center"
              key={item._id}
            >
              <div className="flex justify-between w-full">
                <div className="absolute top-0] -left-[9px] flex items-center justify-center size-4 rounded-[4px] bg-milk-white">
                  <div className="size-2 rounded-[2px] bg-[#141414]"></div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-small font-bold text-milk-white">
                    {formattedDate}
                  </h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-large text-milk-white font-medium">
                      {percentRead} %
                    </p>
                    <p className="text-light text-grey-form">
                      {formattedTimeRead}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-small text-grey-form">{pagesRead} pages</p>
                  <div className="flex flex-col gap-1 max-w-[43px]">
                    <div
                      className="w-[43px] h-[18px]"
                      style={{
                        background:
                          "linear-gradient(350deg, #30B94D33 calc(55% - 1px), #30b94d calc(55% - 0.5px), #30b94d calc(55% + 0.5px), transparent calc(45% + 1px))",
                      }}
                    ></div>
                    <p className="text-light text-grey-form text-wrap w-full">
                      {speed}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="cursor-pointer flex items-center justify-center size-[14px] group"
                type="button"
                onClick={() => onDeleteSessionClick(item._id, bookDetails._id)}
              >
                <Icon
                  id="icon-trash"
                  w={14}
                  h={14}
                  className="fill-transparent stroke-grey-form group-hover:stroke-milk-white"
                />
              </button>
            </li>
          );
      })}
    </ul>
  );
}
