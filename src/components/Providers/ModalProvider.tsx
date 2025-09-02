"use client";

import { Book } from "@/types/BookTypes";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ModalData = { message?: string } | Book | null;

type ModalState = {
  [key: string]: boolean;
};

type ModalDataContext = {
  [key: string]: ModalData | null;
};

type ModalContextType = {
  modals: ModalState;
  modalData: ModalDataContext;
  openModal: (name: string, data?: ModalData) => void;
  closeModal: (name: string) => void;
  toggleModal: (name: string) => void;
  isModalOpen: (name: string) => boolean;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalState>({});
  const [modalData, setModalData] = useState<ModalDataContext>({});

  const openModal = (name: string, data: ModalData = null) => {
    setModals((prev) => ({ ...prev, [name]: true }));
    setModalData((prev) => ({ ...prev, [name]: data }));
  };

  const closeModal = (name: string) => {
    setModals((prev) => ({ ...prev, [name]: false }));
    setModalData((prev) => ({ ...prev, [name]: null }));
  };

  const toggleModal = (name: string, data: ModalData = null) => {
    if (modals[name]) {
      closeModal(name);
    } else {
      openModal(name, data);
    }
  };

  const isModalOpen = (name: string) => !!modals[name];

  useEffect(() => {
    const hasOpenModal = Object.values(modals).some((isOpen) => isOpen);

    if (hasOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modals]);

  return (
    <ModalContext.Provider
      value={{
        modals,
        openModal,
        modalData,
        closeModal,
        toggleModal,
        isModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};
