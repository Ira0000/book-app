"use client";

import { useModal } from "@/components/ModalProvider";
import { Media, MediaContextProvider } from "@/helpers/Media";
import { animated, SpringValue, useTransition } from "@react-spring/web";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import BurgerModal from "./BurgerModal";
import AddToLibraryModal from "./AddToLibraryModal";

const modals = [
  {
    name: "burger",
    className:
      "flex h-full flex-col items-center gap-12 bg-grey p-10 text-white",
    backdrop: "fixed inset-0 z-50 flex justify-end bg-grey-400/75  md:bottom-0",
  },
  {
    name: "addToLibrary",
    className:
      "flex h-full flex-col items-center gap-12 bg-grey-400 p-12 text-white",
    backdrop:
      "fixed inset-0 z-50 flex justify-end bg-grey-400/75 bottom-26 md:bottom-0",
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
    toggleModal,
    closeModal,
    modals: activeModals,
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
      from: (modal) =>
        modal.name === "search"
          ? { transform: "translateY(-3%)", opacity: 0 }
          : { transform: "translateX(100%)", opacity: 0 },

      enter: (modal) =>
        modal.name === "search"
          ? { transform: "translateY(0%)", opacity: 1 }
          : { transform: "translateX(0%)", opacity: 1 },
      leave: (modal) =>
        modal.name === "search"
          ? { transform: "translateY(0%)", opacity: 0 }
          : { transform: "translateX(100%)", opacity: 0 },
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
                onClick={() => toggleModal(modal.name)}
              >
                <animated.div
                  style={{ transform: style.transform }}
                  onClick={(e) => e.stopPropagation()}
                  key={modal.name}
                  className={modal.className}
                >
                  {modal.name === "addToLibrary" && <AddToLibraryModal />}
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
                onClick={() => toggleModal(modal.name)}
              >
                <animated.div
                  onClick={(e) => e.stopPropagation()}
                  key={modal.name}
                  style={{ transform: style.transform }}
                  className={modal.className}
                >
                  {modal.name === "burger" && <BurgerModal />}
                  {modal.name === "addToLibrary" && <AddToLibraryModal />}
                </animated.div>
              </animated.div>
            )
          )}
        </Media>
      </MediaContextProvider>
    </>
  );
}
