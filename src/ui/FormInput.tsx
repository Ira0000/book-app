"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/cn";
import React, { ComponentProps, useState } from "react";
import { Control, useController } from "react-hook-form";
import Icon from "./Icon";

type FormInputProps = ComponentProps<"input"> & {
  control: Control<any>;
  label?: string;
  name: string;
  isPasswordField?: boolean;
  isPasswordShown?: boolean;
  toggleShowPassword?: () => void;
};
export default function FormInput({
  control,
  name,
  label,
  className,
  isPasswordField = false,
  isPasswordShown,
  toggleShowPassword,
  ...inputProps
}: FormInputProps) {
  const {
    fieldState: { isDirty },
    formState: { errors },
    field,
  } = useController({ control, name });

  const [isFocused, setIsFocused] = useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col relative">
      <div
        ref={containerRef}
        tabIndex={-1}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsFocused(false);
          }
        }}
        className={cn(
          `items-center relative h-11 w-full rounded-[12px] bg-grey 
            text-small pl-[14px] flex gap-[10px] transition-colors hover:border hover:border-milk-white/10 ${className}`,
          {
            "border border-green": !errors?.[name] && !isFocused && isDirty,
            "border border-red": errors?.[name] && !isFocused && isDirty,
          }
        )}
      >
        {label && (
          <label className="  text-small text-grey-form ">{label}</label>
        )}
        <input
          className="outline-none w-full "
          autoComplete="on"
          {...field}
          {...inputProps}
        />
        {isPasswordField && toggleShowPassword && isFocused && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleShowPassword();
            }}
            className="absolute right-[16px] top-[13px] cursor-pointer z-10"
          >
            <Icon
              id={isPasswordShown ? "icon-eye" : "icon-eye-off"}
              w={18}
              h={18}
              className="stroke-white fill-none"
            />
          </button>
        )}
        {!errors?.[name] && !isFocused && isDirty && (
          <div className="absolute right-[16px] top-[13px]">
            <Icon className="fill-green" id="icon-check" w={18} h={18} />
          </div>
        )}
      </div>
      {errors[name] && !isFocused && isDirty && (
        <>
          <div className="absolute right-[16px] top-[13px]">
            <Icon className="fill-red" id="icon-error" w={18} h={18} />
          </div>
          <p className="mt-2 text-light text-red ml-[14px] ">
            {errors[name].message?.toString()}
          </p>
        </>
      )}
    </div>
  );
}
