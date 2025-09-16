"use client";

import { useModal } from "../Providers/ModalProvider";
import Icon from "../Ui/Icon";

export default function BookReadModal() {
  const { closeModal } = useModal();

  return (
    <div className="relative flex px-[47px] md:p-[50px] py-[60px] flex-col size-full items-center gap-[20px] text-milk-white">
      <button
        type="button"
        onClick={() => closeModal("bookFinished")}
        className="absolute top-4 right-4 size-[22px] flex items-center justify-center lg:cursor-pointer"
      >
        <Icon id="icon-x" w={22} h={22} className="text-white " />
      </button>
      <div className="text-[50px] md:text-[68px] text-center">&#128218;</div>
      <h3 className="text-center text-large text-[18px] text-milk-white">
        The book is read
      </h3>
      <p className="text-center text-large font-medium text-grey-form">
        It was an <span className="text-milk-white">exciting journey</span>,
        where each page revealed new horizons, and the characters became
        inseparable friends.
      </p>
    </div>
  );
}
