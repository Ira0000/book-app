"use client";

import Icon from "@/components/Ui/Icon";
import React from "react";
import { useModal } from "../Providers/ModalProvider";
import Link from "next/link";
import { Media, MediaContextProvider } from "@/helpers/Media";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { cn } from "@/lib/cn";

export default function NavigationBar() {
  const userName = "I";

  const { openModal, isModalOpen, closeModal } = useModal();
  const { signOut } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    if (signOut) {
      signOut();
      toast.success("Signed out!");
    }
    if (isModalOpen("burger")) {
      closeModal("burger");
    }
  };

  const isHomePageActive = pathname === "/recommended";
  const isLibraryPageActive = pathname === "/library";

  return (
    <>
      <MediaContextProvider>
        <div className="w-full bg-grey-dark rounded-2xl px-[20px] md:px-6 md:py-4 py-[11px]">
          <Media
            lessThan="md"
            className="w-full flex items-center justify-between"
          >
            <Link href={"/recommended"}>
              <Icon id="icon-icon" w={42} h={17} className="fill-white" />
            </Link>{" "}
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
          </Media>
          <Media greaterThanOrEqual="md" className="w-full">
            <div className="flex w-full justify-between items-center">
              <Link href={"/recommended"}>
                <Icon id="icon-icon" w={42} h={17} className="fill-white" />
              </Link>{" "}
              <div className="flex gap-8">
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
              </div>
              <div className="flex gap-4">
                <button className="flex shrink-0 justify-center items-center rounded-full size-10 border border-[#F9F9F933]">
                  {userName}
                </button>
                <button
                  className="px-7 border rounded-[30px] border-milk-white/20"
                  type="button"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </Media>
        </div>
      </MediaContextProvider>
    </>
  );
}
