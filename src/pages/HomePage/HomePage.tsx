"use client";

import { useModal } from "@/components/ModalProvider";
import Icon from "@/ui/Icon";

export default function HomePage() {
  const userName = "I";

  const { openModal } = useModal();

  return (
    <div>
      <div className="flex w-full justify-between items-center bg-grey-dark rounded-2xl px-[20px] py-[11px]">
        <Icon id="icon-icon" w={42} h={17} className="fill-white" />
        <div className="flex gap-[10px]">
          <button className="flex justify-center items-center rounded-full size-[35px] border border-[#F9F9F933]">
            {userName}
          </button>
          <button
            onClick={() => openModal("burger")}
            className="flex justify-center items-center"
          >
            <Icon id="icon-burger1" w={28} h={28} className="fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
