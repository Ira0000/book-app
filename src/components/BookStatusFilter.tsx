import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import Icon from "./Ui/Icon";
import { BookStatus } from "@/types/BookTypes";
import { cn } from "@/lib/cn";

type BookStatusFilterPropsType = {
  statusList: string[];
  selectedStatus: string;
  handleSelect: (value: string) => void;
};

export default function BookStatusFilter({
  selectedStatus,
  handleSelect,
  statusList,
}: BookStatusFilterPropsType) {
  return (
    <div className="w-[120px]">
      <Combobox<BookStatus | string>
        value={selectedStatus}
        onChange={handleSelect}
      >
        <div className="relative">
          <ComboboxButton
            as="div"
            className="group cursor-default w-full border border-grey-border rounded-xl  transition-colors hover:border-milk-white "
          >
            <ComboboxInput<BookStatus | string>
              aria-label="Assignee"
              readOnly
              displayValue={(value) => value}
              className={
                "w-full  text-small text-milk-white focus:outline-none py-3 px-[12px]"
              }
            />
            <Icon
              id="icon-chevron-r"
              h={16}
              w={16}
              className={cn(
                "stroke-grey-border absolute top-3 right-3 rotate-90 stroke-[1.5px] fill-transparent group-data-hover:stroke-milk-white group-data-[open]:-rotate-90 transition-all group-data-focus:stroke-milk-white duration-300"
              )}
            />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor="bottom"
          className="w-[120px] bg-grey rounded-xl p-[14px] empty:invisible transition duration-1000 ease-out data-[leave]:data-[closed]:opacity-0 [--anchor-gap:4px] "
        >
          {statusList.map((value) => (
            <ComboboxOption
              key={value}
              value={value}
              className={
                "data-focus:text-milk-white gap-2 cursor-default text-grey-form text-small transition-colors duration-300"
              }
            >
              {value}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
