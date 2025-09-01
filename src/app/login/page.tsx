import LoginForm from "@/components/Forms/LoginForm";
import AuthSection from "@/sections/AuthSection";
import React from "react";

export default function LoginPage() {
  return (
    <>
      <AuthSection>
        <LoginForm />
      </AuthSection>
    </>
  );
}
