import * as yup from "yup";

export const filterRecommendedBookSchema = yup.object().shape({
  title: yup.string(),
  author: yup.string(),
});

export const AddBookSchema = yup.object().shape({
  title: yup
    .string()
    .required()
    .min(2, "Title must be at least 2 characters")
    .max(50, "Title must not exceed 50 characters"),
  author: yup
    .string()
    .required()
    .min(2, "Title must be at least 2 characters")
    .max(50, "Title must not exceed 50 characters"),
  totalPages: yup.number().required(),
});

export type FilterRecommendedFormData = yup.InferType<
  typeof filterRecommendedBookSchema
>;

export type AddBookFormData = yup.InferType<
  typeof AddBookSchema
>;
