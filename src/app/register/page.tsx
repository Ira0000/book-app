import RegistrationForm from "@/forms/RegistrationForm";
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
