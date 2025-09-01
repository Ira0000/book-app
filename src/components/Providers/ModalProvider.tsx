"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ModalState = {
  [key: string]: boolean;
};

type ModalContextType = {
  modals: ModalState;
  openModal: (name: string) => void;
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

  const openModal = (name: string) => {
    // FIX: Merge with previous state instead of overwriting
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = (name: string) => {
    // This function is correct as is
    setModals((prev) => ({ ...prev, [name]: false }));
  };

  const toggleModal = (name: string) => {
    // FIX: Merge with previous state instead of overwriting or clearing
    setModals((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isModalOpen = (name: string) => !!modals[name];

  useEffect(() => {
    // This is a great piece of code for controlling body overflow!
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
      value={{ modals, openModal, closeModal, toggleModal, isModalOpen }}
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
