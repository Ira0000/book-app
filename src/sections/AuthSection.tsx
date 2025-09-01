import Icon from "@/components/Ui/Icon";
import Image from "next/image";
import React, { PropsWithChildren } from "react";

export default function AuthSection({ children }: PropsWithChildren) {
  return (
    <section className="flex flex-col gap-[10px]">
      <div className="bg-grey-dark rounded-[30px] w-full p-5">
        <div className="mb-10">
          <Icon id="icon-icon" w={42} h={17} className="fill-white" />
        </div>
        <h1 className="text-milk-white  text-xxl mb-5">
          Expand your mind, reading
          <span className="text-grey-light"> a book</span>
        </h1>
        {children}
      </div>
      <div className="flex justify-center items-center bg-grey-dark rounded-[30px] w-full p-5 pb-0">
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
