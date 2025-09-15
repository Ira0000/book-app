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
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <FormInput
          className="pr-[32px]"
          control={control}
          name="email"
          label="email"
          required
        />
        <FormInput
          type={showPassword ? "text" : "password"}
          control={control}
          className="pr-[35px]"
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
