import RegistrationForm from "@/components/Forms/RegistrationForm";
import AuthSection from "@/sections/AuthSection";
import React from "react";

export default function RegisterPage() {
  return (
    <>
      <AuthSection>
        <RegistrationForm />
      </AuthSection>
    </>
  );
}
