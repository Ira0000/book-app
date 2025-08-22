"use client";

import { useModal } from "@/components/ModalProvider";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function BurgerModal() {
  const { closeModal } = useModal();
  const { signOut } = useAuth();

  const handleLogout = () => {
    console.log("Signing out...");
    signOut();
    closeModal("burger");
  };

  return (
    <ul className="flex flex-col gap-4">
      <li className="text-grey-form text-large">
        <Link href="/" onClick={() => closeModal("burger")}>
          Home
        </Link>
      </li>
      <li className="text-grey-form text-large">
        <Link href="/library" onClick={() => closeModal("burger")}>
          My Library
        </Link>
      </li>
      <li className="border py-[10px] px-[20px] text-milk-white text-large border-milk-white rounded-[30px]">
        <button onClick={handleLogout}>Logout</button>
      </li>
    </ul>
  );
}
