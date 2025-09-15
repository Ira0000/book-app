"use client";

import { useModal } from "@/components/Providers/ModalProvider";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/cn";
import Icon from "@/components/Ui/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default function BurgerModal() {
  const { closeModal } = useModal();
  const { signOut } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    if (signOut) {
      signOut();
      toast.success("Signed out!");
    }
    closeModal("burger");
  };

  const isHomePageActive = pathname === "/recommended";
  const isLibraryPageActive = pathname === "/library";

  return (
    <>
      <ul className="size-full flex flex-col justify-between items-center">
        <li className="lg:cursor-pointer size-7 self-end">
          <button
            type="button"
            onClick={() => closeModal("burger")}
            className="size-full flex items-center justify-center lg:cursor-pointer"
          >
            <Icon id="icon-x" w={28} h={28} className="text-white " />
          </button>
        </li>
        <li className="flex flex-col gap-4 text-grey-form text-large lg:cursor-pointer">
          <Link href="/recommended" onClick={() => closeModal("burger")}>
            <span
              className={cn({
                "relative after:content-[''] after:w-[100%] after:absolute after:translate-y-1 after:bottom-0 after:left-0 after:h-[3px] after:bg-[#4F92F7] after:rounded-xs":
                  isHomePageActive,
              })}
            >
              Home
            </span>
          </Link>
          <Link
            className={cn({
              "relative after:content-[''] after:w-[100%] after:absolute after:translate-y-1 after:bottom-0 after:left-0 after:h-[3px] after:bg-[#4F92F7] after:rounded-xs":
                isLibraryPageActive,
            })}
            href="/library"
            onClick={() => closeModal("burger")}
          >
            My Library
          </Link>
        </li>
        <li className="border py-[10px] px-[20px] text-milk-white text-large border-milk-white rounded-[30px] lg:cursor-pointer lg:hover:bg-milk-white lg:hover:text-grey-dark">
          <button className="size-full" type="button" onClick={handleLogout}>
            Log out
          </button>
        </li>
      </ul>
    </>
  );
}
