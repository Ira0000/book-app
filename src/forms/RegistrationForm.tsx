"use client";

import React, { useState } from "react";
import { registrationSchema, RegisterFormData } from "./schemas/auth-schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/ui/FormInput";
import Link from "next/link";

export default function RegistrationForm() {
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      name: "",
      mail: "",
      password: "",
    },
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: RegisterFormData) => console.log(data);

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <FormInput
          validationVisible={true}
          control={control}
          name="name"
          label="name"
          required
        />
        <FormInput
          validationVisible={true}
          control={control}
          name="mail"
          label="mail"
          required
        />
        <FormInput
          type={showPassword ? "text" : "password"}
          control={control}
          validationVisible={true}
          name="password"
          label="password"
          required
          isPasswordField={true}
          isPasswordShown={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className="flex gap-[14px] justify-center">
        <button
          type="submit"
          className="bg-milk-white rounded-[30px] w-[140px] text-center py-3 text-grey-dark"
        >
          Registration
        </button>
        <Link
          href={"/login"}
          className="flex items-center text-small leading-[14px] -tracking-[2%] text-grey-form underline"
        >
          Already have an account?
        </Link>
      </div>
    </form>
  );
}
