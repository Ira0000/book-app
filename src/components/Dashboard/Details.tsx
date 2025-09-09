"use client";

import { UserBookResponse } from "@/types/BookTypes";
import { useState } from "react";
import Icon from "../Ui/Icon";
import { cn } from "@/lib/cn";
import Diary from "./Diary";
import Statistics from "./Statistics";

type DetailsPropsType = {
  bookDetails: UserBookResponse;
};

export default function Details({ bookDetails }: DetailsPropsType) {
  const [switchDetails, setSwitchDetails] = useState(true);

  console.log(bookDetails);

  const sectionName = switchDetails ? "Diary" : "Statistics";

  const onDiaryClick = () => {
    setSwitchDetails(true);
  };

  const onStatisticsClick = () => {
    setSwitchDetails(false);
  };

  if (bookDetails.progress.length < 1) {
    return (
      <div className="w-full">
        <h2 className="text-large text-[18px] text-milk-white mb-[14px]">
          Progress
        </h2>
        <p className="mb-[20px] text-large font-medium text-grey-form">
          Here you will see when and how much you read. To record, click on the
          red button above.
        </p>
        <div className="flex text-[32px] items-center justify-center  size-[80px] rounded-full bg-grey mx-auto">
          🌟
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex justify-between">
        <h2 className="text-large text-[18px]">{sectionName}</h2>
        <div className="flex gap-2">
          <button
            onClick={onDiaryClick}
            className="flex items-center justify-center"
          >
            <Icon
              id="icon-hourglass-02"
              w={16}
              h={16}
              className={cn("fill-transparent transition-colors", {
                "stroke-milk-white": switchDetails,
                " stroke-grey-form": !switchDetails,
              })}
            />
          </button>
          <button
            onClick={onStatisticsClick}
            className="flex items-center justify-center"
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
      {switchDetails ? <Diary bookDetails={bookDetails} /> : <Statistics />}
    </div>
  );
}
