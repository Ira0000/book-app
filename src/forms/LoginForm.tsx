"use client";

import React, { useState } from "react";
import { LoginFormData, loginSchema } from "./schemas/auth-schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/ui/FormInput";
import Link from "next/link";

export default function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      mail: "",
      password: "",
    },
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validating, setValidating] = useState(false);
  const onSubmit = (data: LoginFormData) => {
    console.log(data);
    setValidating(true);
  };

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <FormInput control={control} name="mail" label="mail" required />
        <FormInput
          validating={validating}
          type={showPassword ? "text" : "password"}
          control={control}
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
          Log in
        </button>
        <Link
          href={"/register"}
          className="flex items-center text-small leading-[14px] -tracking-[2%] text-grey-form underline"
        >
          Don&apos;t have an account?
        </Link>
      </div>
    </form>
  );
}
