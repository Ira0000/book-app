import Link from "next/link";
import Icon from "../Ui/Icon";

export default function LibraryLink() {
  const workoutInstraction = [
    "Create a personal library: add the books you intend to read to it.",
    "Create your first workout: define a goal, choose a period, start training.",
  ];

  const DivideTextFunction = (text: string): string[] => {
    const index = text.indexOf(":");

    if (index === -1) {
      // Return the original text and an empty string if ":" is not found
      return ["", text];
    }

    const highlightedText = text.slice(0, index + 1);
    const notHighlightedText = text.slice(index + 1);

    return [highlightedText, notHighlightedText];
  };

  return (
    <div className="flex flex-col gap-[20px] p-[20px] bg-grey rounded-xl">
      <h3 className="text-large md:text-xl md:font-bold font-medium text-milk-white">
        Start your workout
      </h3>
      <ul className="flex flex-col gap-[20px]">
        {workoutInstraction.map((item, index) => {
          const [highlighted, notHighlighted] = DivideTextFunction(item);

          return (
            <li className="flex gap-3" key={index}>
              <div className="flex flex-shrink-0 items-center justify-center rounded-full size-10 md:size-11 bg-milk-white text-grey-dark text-large md:text-xl">
                {index + 1}
              </div>
              <div className="text-large md:font-medium text-grey-form">
                <span className="text-milk-white">{highlighted}</span>
                {notHighlighted}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-between items-center">
        <Link
          className="text-large font-medium text-grey-form underline"
          href={"/library"}
        >
          My library
        </Link>
        <Link href={"/library"}>
          <Icon id="icon-arrow-r" w={24} h={24} className="stroke-milk-white" />
        </Link>
      </div>
    </div>
  );
}
