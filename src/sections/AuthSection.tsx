import Icon from "@/components/Ui/Icon";
import Image from "next/image";
import React, { PropsWithChildren } from "react";

export default function AuthSection({ children }: PropsWithChildren) {
  return (
    <section className="flex flex-col gap-[10px] h-full">
      <div className="bg-grey-dark rounded-[30px] w-full p-5 md:py-10 md:px-16 h-screen">
        <div className="mb-10 md:mb-[150px] flex gap-1">
          <Icon id="icon-icon" w={42} h={17} className="fill-white" />
          <h1 className="hidden md:block uppercase text text-large text-[18px] items-center">
            read journey
          </h1>
        </div>
        <h1 className="text-milk-white  text-xxl mb-5 md:text-[64px] md:leading-[60px] md:max-w-[444px] md:mb-10">
          Expand your mind, reading
          <span className="text-grey-light"> a book</span>
        </h1>
        {children}
      </div>
      <div className="flex justify-center md:hidden items-center bg-grey-dark rounded-[30px] w-full p-5 pb-0">
        <Image
          src={"/images/telephone-1x.avif"}
          width={255}
          height={518}
          alt="iPhone image"
        />
      </div>
    </section>
  );
}
