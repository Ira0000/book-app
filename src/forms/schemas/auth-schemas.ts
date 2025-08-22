import * as yup from "yup";

export const registrationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email address"
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(7, "Password must be at least 7 characters")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/,
      "Password must contain at least one letter and one number"
    )
    .max(50, "Password must not exceed 50 characters"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email address"
    ),

  password: yup.string().required("Password is required"),
});

export type RegisterFormData = yup.InferType<typeof registrationSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
