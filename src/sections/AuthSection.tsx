import Icon from "@/components/Ui/Icon";
import Image from "next/image";
import React, { PropsWithChildren } from "react";

export default function AuthSection({ children }: PropsWithChildren) {
  return (
    <section className="flex flex-col lg:flex-row gap-[10px] h-screen p-5 md:p-8 lg:py-10 lg:px-16">
      <div className="flex flex-col justify-between bg-grey-dark rounded-[30px] w-full p-5 md:py-10 md:px-16 h-full lg:w-[50%]">
        <div className="mb-10 md:mb-[150px] lg:mb-[107px] flex gap-1">
          <Icon id="icon-icon" w={42} h={17} className="fill-white" />
          <h1 className="hidden md:block uppercase text text-large text-[18px] items-center">
            read journey
          </h1>
        </div>
        <h1 className="text-milk-white  text-xxl md:text-[64px] md:leading-[60px] md:max-w-[444px] lg:max-w-full">
          Expand your mind, reading
          <span className="text-grey-light"> a book</span>
        </h1>
        {children}
      </div>
      <div className="relative min-h-[330px] overflow-hidden flex justify-center lg:items-end md:hidden lg:flex items-center bg-grey-dark rounded-[30px] w-full p-5 pb-0 lg:w-[50%] ">
        <Image
          src={"/images/telephone-1x.avif"}
          width={255}
          height={518}
          sizes="(max-width: 1024px) 100vw"
          alt="iPhone image"
          className="overflow-hidden md:hidden"
        />
        <div>
          <Image
            src="/images/telephone-desk-1x.avif"
            alt="iPhone image"
            width={405}
            height={830}
            sizes="(min-width: 1025px) 50vw"
            className="hidden lg:block lg:mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
