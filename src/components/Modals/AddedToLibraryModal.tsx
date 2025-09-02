"use client";

import { useModal } from "../Providers/ModalProvider";
import Icon from "../Ui/Icon";

export default function AddedToLibraryModal() {
  const { closeModal } = useModal();

  return (
    <div className="relative flex px-10 py-[50px] flex-col size-full items-center gap-[10px] text-milk-white">
      <button
        type="button"
        onClick={() => closeModal("addedToLibrary")}
        className="absolute top-4 right-4 size-[22px] flex items-center justify-center lg:cursor-pointer"
      >
        <Icon id="icon-x" w={22} h={22} className="text-white " />
      </button>
      <div className="text-[50px] text-center">👍</div>
      <h3 className="text-center text-large text-[18px] text-milk-white">
        Good job
      </h3>
      <div className="text-center text-large font-medium text-grey-form">
        Your book is now in
        <span className="text-milk-white"> the library!</span> The joy knows no
        bounds and now you can start your training
      </div>
    </div>
  );
}
