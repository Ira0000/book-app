import { cn } from "@/lib/cn";
import Icon from "@/ui/Icon";
import React, { MouseEventHandler } from "react";

type ArrowButtonPropType = {
  isLeft: boolean;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled: boolean | undefined;
};

export default function ArrowButton({
  isLeft,
  onClick,
  disabled,
}: ArrowButtonPropType) {
  return (
    <button
      className="size-[32px] cursor-pointer rounded-full border border-white-transp
        transition-colors hover:border-milk-white disabled:cursor-not-allowed 
        "
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon
        id="icon-chevron-r"
        h={16}
        w={16}
        className={cn("flex items-center justify-center stroke-milk-white", {
          "rotate-180": isLeft,
          "stroke-white-transp": disabled,
        })}
      />
    </button>
  );
}
