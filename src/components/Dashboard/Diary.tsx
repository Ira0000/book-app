import { UserBookResponse } from "@/types/BookTypes";

type DiaryPropsType = {
  bookDetails: UserBookResponse;
};

export default function Diary({ bookDetails }: DiaryPropsType) {
  return (
    <ul className="bg-grey rounded-[12px] pt-4 pl-[23px] pr-9">
      {bookDetails.progress.map((item) => {
        const pagesRead = item.finishPage - item.startPage;
        const percentRead = (
          (pagesRead * 100) /
          bookDetails.totalPages
        ).toFixed(1);
        const startTime = new Date(item.startReading);
        const finishTime = new Date(item.finishReading);
        const timeReadMilliseconds = finishTime.getTime() - startTime.getTime();

        const totalMinutes = Math.floor(timeReadMilliseconds / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const formattedTimeRead =
          hours > 0 ? `${hours} h ${minutes} min` : `${minutes} minutes`;

        const dateObject = new Date(item.startReading);

        const day = String(dateObject.getDate()).padStart(2, "0");
        const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
        const year = dateObject.getFullYear();

        const formattedDate = `${day}.${month}.${year}`;

        return (
          <li
            className="flex-col relative pl-[27px] pb-4 flex gap-[9px] border-l-2 border-grey-dark"
            key={item._id}
          >
            <div className="absolute top-0] -left-[9px] flex items-center justify-center size-4 rounded-[4px] bg-milk-white">
              <div className="size-2 rounded-[2px] bg-[#141414]"></div>
            </div>
            <div className="w-full flex justify-between items-center">
              <h3 className="text-small font-bold text-milk-white">
                {item.startReading}
              </h3>
              <p className="text-small text-grey-form">{pagesRead} pages</p>
            </div>
            <div>
              <div className="flex flex-col gap-1">
                <p className="text-large text-milk-white font-medium">
                  {percentRead} %
                </p>
                <p className="text-light text-grey-form">{formattedTimeRead}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
