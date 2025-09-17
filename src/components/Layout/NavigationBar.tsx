"use client";

import Icon from "@/components/Ui/Icon";
import React from "react";
import { useModal } from "../Providers/ModalProvider";
import Link from "next/link";
import { Media, MediaContextProvider } from "@/helpers/Media";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/authStore";

export default function NavigationBar() {
  const { user, signOut } = useAuthStore();

  const userName = user && user.name.toString();
  const userInitials = user && user.name.slice(0, 1);

  const { openModal, isModalOpen, closeModal } = useModal();
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
              <div className="flex justify-center items-center rounded-full size-[35px] border border-[#F9F9F933]">
                {userInitials}
              </div>
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
              <Link href={"/recommended"} className="flex gap-1">
                <Icon id="icon-icon" w={42} h={17} className="fill-white" />
                <h1 className="hidden lg:block text-milk-white uppercase lg:text-large lg:text-[18px]">
                  read journey
                </h1>
              </Link>{" "}
              <div className="flex gap-8">
                <Link
                  href="/recommended"
                  onClick={() => closeModal("burger")}
                  className={cn("text-grey-form", {
                    "text-milk-white relative after:content-[''] after:w-[100%] after:absolute after:translate-y-1 after:bottom-0 after:left-0 after:h-[3px] after:bg-[#4F92F7] after:rounded-xs":
                      isHomePageActive,
                  })}
                >
                  Home
                </Link>
                <Link
                  className={cn("text-grey-form", {
                    "text-milk-white relative after:content-[''] after:w-[100%] after:absolute after:translate-y-1 after:bottom-0 after:left-0 after:h-[3px] after:bg-[#4F92F7] after:rounded-xs":
                      isLibraryPageActive,
                  })}
                  href="/library"
                  onClick={() => closeModal("burger")}
                >
                  My Library
                </Link>
              </div>
              <div className="flex gap-4 lg:gap-2 items-center">
                <div className="flex shrink-0 justify-center items-center rounded-full size-10 border border-[#F9F9F933]">
                  {userInitials}
                </div>
                <div className="text-large text-[16px] hidden lg:block lg:mr-2">
                  {userName}
                </div>
                <button
                  className="px-7 py-3 border rounded-[30px] border-milk-white/20 cursor-pointer hover:bg-milk-white hover:border-milk-white hover:text-grey-dark transition-colors"
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
