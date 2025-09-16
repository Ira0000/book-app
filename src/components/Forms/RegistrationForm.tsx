/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { registrationSchema, RegisterFormData } from "./schemas/auth-schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/components/Ui/FormInput";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RegistrationForm() {
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    const requestData: RegisterFormData = {
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
    };

    if (!signUp) {
      toast.error("Authentication store is not ready yet.");
      return;
    }

    try {
      await signUp(requestData);
      toast.success("Registration successful!");
      router.push("/");
    } catch (err: any) {
      toast.error("Registration failed:", err.message);
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
          validationVisible={true}
          control={control}
          name="name"
          label="name"
          required
        />
        <FormInput
          validationVisible={true}
          control={control}
          name="email"
          label="email"
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
      <div className="flex gap-[14px] md:gap-[20px] justify-center md:justify-start">
        <button
          type="submit"
          className="bg-milk-white text-large  rounded-[30px] w-[140px] md:w-[166px] md:py-4 text-center md:text-xl py-3 text-grey-dark hover:bg-transparent border border-milk-white hover:border-milk-white/20 cursor-pointer hover:text-milk-white"
        >
          Registration
        </button>
        <Link
          href={"/login"}
          className="flex items-center text-small leading-[14px] -tracking-[2%] text-grey-form underline md:text-large md:font-medium hover:text-milk-white transition-colors"
        >
          Already have an account?
        </Link>
      </div>
    </form>
  );
}
