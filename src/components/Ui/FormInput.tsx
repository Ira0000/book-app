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
  validationVisible?: boolean;
  toggleShowPassword?: () => void;
};
export default function FormInput({
  control,
  name,
  label,
  className,
  isPasswordField = false,
  isPasswordShown,
  validationVisible = false,
  toggleShowPassword,
  ...inputProps
}: FormInputProps) {
  const {
    // fieldState: { isTouched },
    formState: { errors, isSubmitted },
    field,
  } = useController({ control, name });

  const [isFocused, setIsFocused] = useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const hasValidationBorder = validationVisible && !isFocused && isSubmitted;
  //   const hasValidationBorder = validationVisible && !isFocused && isTouched;

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
          `group items-center relative h-11 w-full rounded-[12px] bg-grey 
            text-small pl-[10px] flex gap-[10px] transition-colors  ${className}`,
          {
            "border border-green hover:border-grey-form":
              hasValidationBorder && !errors?.[name],
            "border border-red hover:border-grey-form":
              hasValidationBorder && errors?.[name],
            "border border-transparent hover:border-grey-form":
              !hasValidationBorder,
          }
        )}
      >
        {label && (
          <label
            htmlFor={name}
            className="capitalize whitespace-nowrap  text-small text-grey-form "
          >
            {label}:
          </label>
        )}
        <input
          id={name}
          className="outline-none flex-1 h-full overflow-hidden cursor-pointer "
          autoComplete="on"
          {...field}
          value={field.value ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (name === "totalPages") {
              field.onChange(value === "" ? undefined : Number(value));
            } else {
              field.onChange(value);
            }
          }}
          {...inputProps}
        />
        {isPasswordField &&
          toggleShowPassword &&
          (isFocused || !isSubmitted) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleShowPassword();
              }}
              className="absolute right-[10px] top-[13px] cursor-pointer z-10"
            >
              <Icon
                id={isPasswordShown ? "icon-eye" : "icon-eye-off"}
                w={18}
                h={18}
                className="stroke-white fill-none"
              />
            </button>
          )}
      </div>
      {hasValidationBorder && errors[name] ? (
        <>
          <div className="absolute right-[10px] top-[13px]">
            <Icon className="fill-red" id="icon-error" w={18} h={18} />
          </div>
          <p className="absolute -bottom-4 left-[10px] text-light text-red ">
            {errors[name].message?.toString()}
          </p>
        </>
      ) : (
        hasValidationBorder &&
        !errors[name] && (
          <>
            <div className="absolute right-[10px] top-[13px]">
              <Icon className="fill-green" id="icon-check" w={18} h={18} />
            </div>
            {isPasswordField && (
              <p className="mt-2 text-light text-green ml-[10px] ">
                Password is secure
              </p>
            )}
          </>
        )
      )}
    </div>
  );
}
