/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { LoginFormData, loginSchema } from "./schemas/auth-schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/components/Ui/FormInput";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    if (!signIn) {
      toast.error("Authentication store is not ready yet.");
      return;
    }

    try {
      await signIn(data);
      toast.success("Login successful!");
      router.push("/");
    } catch (err: any) {
      toast.error(`Login failed: ${err.message}`);
    }
  };

  return (
    <form
      noValidate
      className="flex flex-col gap-5 md:gap-[146px] md:max-w-[475px] lg:max-w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2 md:gap-[14px] lg:mb-[50px]">
        <FormInput
          className="pr-[32px]"
          control={control}
          name="email"
          label="email"
          required
          validationVisible={true}
        />
        <FormInput
          type={showPassword ? "text" : "password"}
          control={control}
          className="pr-[35px]"
          name="password"
          label="password"
          required
          validationVisible={true}
          isPasswordField={true}
          isPasswordShown={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className="flex gap-[14px] md:gap-[20px] justify-center md:justify-start ">
        <button
          type="submit"
          className="bg-milk-white  rounded-[30px] w-[140px] md:w-[166px] md:py-4 text-center md:text-xl py-3 text-grey-dark hover:bg-transparent border border-milk-white hover:border-milk-white/20 cursor-pointer hover:text-milk-white"
        >
          Log in
        </button>
        <Link
          href={"/register"}
          className="flex items-center text-small md:text-large md:font-medium leading-[14px] -tracking-[2%] text-grey-form underline hover:text-milk-white transition-colors"
        >
          Don&apos;t have an account?
        </Link>
      </div>
    </form>
  );
}
