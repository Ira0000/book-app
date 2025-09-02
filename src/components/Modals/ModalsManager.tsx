"use client";

import { useModal } from "@/components/Providers/ModalProvider";
import { Media, MediaContextProvider } from "@/helpers/Media";
import { animated, SpringValue, useTransition } from "@react-spring/web";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import AddToLibraryModal from "./AddToLibraryModal";
import BurgerModal from "./BurgerModal";
import AddedToLibraryModal from "./AddedToLibraryModal";
import ErrorModal from "./ErrorModal";
import { Book } from "@/types/BookTypes";

const modals = [
  {
    name: "burger",
    className: "flex h-full w-[50%] bg-grey px-10 py-8 text-white",
    backdrop: "fixed inset-0 z-50 flex justify-end bg-black/50  ",
  },
  {
    name: "addToLibrary",
    className:
      "w-[335px] mx-[20px]  md:w-[500px]  bg-grey-dark rounded-xl border border-[#68686833]",
    backdrop:
      "fixed inset-0 z-50 flex justify-center items-center bg-black/50  ",
  },
  {
    name: "addedToLibrary",
    className:
      "w-[335px] mx-[20px] h-[272px] md:w-[342px] md:h-[290px]  bg-grey-dark rounded-xl border border-[#68686833]",
    backdrop:
      "fixed inset-0 z-50 flex justify-center items-center bg-black/50  ",
  },
  {
    name: "error",
    className:
      "w-[335px] mx-[20px] h-[272px] md:w-[342px] md:h-[290px]  bg-grey-dark rounded-xl border border-[#68686833]",
    backdrop:
      "fixed inset-0 z-50 flex justify-center items-center bg-black/50  ",
  },
];

type ModalType = {
  name: string;
  className: string;
  backdrop: string;
};

type AnimationStyle = {
  opacity: SpringValue<number>;
  transform: SpringValue<string>;
};

export default function ModalManager() {
  const pathname = usePathname();
  const {
    isModalOpen,
    closeModal,
    modals: activeModals,
    modalData,
  } = useModal();

  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      Object.keys(activeModals).forEach((modalName) => {
        if (activeModals[modalName]) {
          closeModal(modalName);
        }
      });
      prevPathnameRef.current = pathname;
    }
  }, [pathname, activeModals, closeModal]);

  const transitions = useTransition<ModalType, AnimationStyle>(
    modals.filter((modal) => isModalOpen(modal.name)),
    {
      from: { transform: "translateX(100%)", opacity: 0 },
      enter: { transform: "translateX(0%)", opacity: 1 },
      leave: { transform: "translateX(100%)", opacity: 0 },
      keys: (modal) => modal.name,
    }
  );

  return (
    <>
      <MediaContextProvider>
        <Media greaterThanOrEqual="md">
          {transitions(
            (
              style: {
                opacity: SpringValue<number>;
                transform: SpringValue<string>;
              },
              modal
            ) => (
              <animated.div
                className={modal.backdrop}
                style={{ opacity: style.opacity }}
                onClick={() => closeModal(modal.name)}
              >
                <animated.div
                  style={{ transform: style.transform }}
                  onClick={(e) => e.stopPropagation()}
                  key={modal.name}
                  className={modal.className}
                >
                  {modal.name === "addToLibrary" && (
                    <AddToLibraryModal book={modalData.addToLibrary as Book} />
                  )}
                  {modal.name === "addedToLibrary" && <AddedToLibraryModal />}
                  {modal.name === "error" && (
                    <ErrorModal
                      error={modalData.error as { message?: string }}
                    />
                  )}
                </animated.div>
              </animated.div>
            )
          )}
        </Media>
        <Media lessThan="md">
          {transitions(
            (
              style: {
                opacity: SpringValue<number>;
                transform: SpringValue<string>;
              },
              modal
            ) => (
              <animated.div
                className={modal.backdrop}
                onClick={() => closeModal(modal.name)}
              >
                <animated.div
                  onClick={(e) => e.stopPropagation()}
                  key={modal.name}
                  style={{ transform: style.transform }}
                  className={modal.className}
                >
                  {modal.name === "burger" && <BurgerModal />}
                  {modal.name === "addToLibrary" && (
                    <AddToLibraryModal book={modalData.addToLibrary as Book} />
                  )}
                  {modal.name === "addedToLibrary" && <AddedToLibraryModal />}
                </animated.div>
              </animated.div>
            )
          )}
        </Media>
      </MediaContextProvider>
    </>
  );
}
