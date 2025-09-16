"use client";

import {
  deleteReadingSessionRequest,
  UserBookResponse,
} from "@/types/BookTypes";
import { useState } from "react";
import Icon from "../Ui/Icon";
import { cn } from "@/lib/cn";
import Diary from "./Diary";
import Statistics from "./Statistics";
import { useBookStore } from "@/store/bookStore";
import { toast } from "react-toastify";

type DetailsPropsType = {
  bookDetails: UserBookResponse;
};

export default function Details({ bookDetails }: DetailsPropsType) {
  const [switchDetails, setSwitchDetails] = useState(true);

  const sectionName = switchDetails ? "Diary" : "Statistics";

  const { deleteReadingSession } = useBookStore();

  const onDiaryClick = () => {
    setSwitchDetails(true);
  };

  const onStatisticsClick = () => {
    setSwitchDetails(false);
  };

  const onDeleteSessionClick = async (readingId: string, bookId: string) => {
    const requestData: deleteReadingSessionRequest = {
      readingId: readingId,
      bookId: bookId,
    };
    try {
      await deleteReadingSession(requestData);
      toast.success("Reading info deleted!");
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
    }
  };

  if (
    bookDetails.progress.length < 1 ||
    !bookDetails.progress[0].finishReading
  ) {
    return (
      <div className="w-full">
        <h2 className="text-large md:text-xl text-[18px] text-milk-white mb-[14px]">
          Progress
        </h2>
        <p className="mb-[20px] text-large font-medium text-grey-form">
          Here you will see when and how much you read. To record, click on the
          red button above.
        </p>
        <div className="flex text-[32px] md:text-[50px] md:size-[100px] items-center justify-center  size-[80px] rounded-full bg-grey mx-auto">
          🌟
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex justify-between">
        <h2 className="text-large md:text-xl text-[18px]">{sectionName}</h2>
        <div className="flex gap-2">
          <button
            onClick={onDiaryClick}
            className="flex items-center justify-center cursor-pointer"
          >
            <Icon
              id="icon-hourglass-02"
              w={17}
              h={17}
              className={cn("fill-transparent transition-colors", {
                "stroke-milk-white": switchDetails,
                " stroke-grey-form": !switchDetails,
              })}
            />
          </button>
          <button
            onClick={onStatisticsClick}
            className="flex items-center justify-center cursor-pointer"
          >
            <Icon
              id="icon-pie-chart-03"
              w={16}
              h={16}
              className={cn("fill-transparent transition-colors", {
                "stroke-milk-white": !switchDetails,
                " stroke-grey-form": switchDetails,
              })}
            />
          </button>
        </div>
      </div>
      {switchDetails ? (
        <Diary
          bookDetails={bookDetails}
          onDeleteSessionClick={onDeleteSessionClick}
        />
      ) : (
        <>
          <div className="text-large font-medium hidden lg:block text-grey-form">
            Each page, each chapter is a new round of knowledge, a new step
            towards understanding. By rewriting statistics, we create our own
            reading history.
          </div>
          <Statistics bookDetails={bookDetails} />
        </>
      )}
    </div>
  );
}
