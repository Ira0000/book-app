"use client";

import { useModal } from "../Providers/ModalProvider";
import Icon from "../Ui/Icon";

type ErrorModalProps = {
  error?: {
    message?: string;
  };
};

export default function ErrorModal({ error }: ErrorModalProps) {
  const { closeModal } = useModal();

  const errorMessage =
    error?.message || "Something went wrong! Please try again later!";

  return (
    <div className="relative flex px-10 py-[60px] flex-col size-full items-center gap-[20px] text-milk-white">
      <button
        type="button"
        onClick={() => closeModal("error")}
        className="absolute top-4 right-4 size-[22px] flex items-center justify-center lg:cursor-pointer"
      >
        <Icon id="icon-x" w={22} h={22} className="text-white " />
      </button>
      <div className="text-[50px] text-center">❌</div>
      <h3 className="text-center text-large text-[18px] text-milk-white">
        Error
      </h3>
      <div className="text-center text-large font-medium text-grey-form">
        {errorMessage}
      </div>
    </div>
  );
}
