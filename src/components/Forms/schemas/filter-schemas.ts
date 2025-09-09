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
  totalPages: yup
    .number()
    .typeError("Total pages must be a number") // This will show if the input is not a number
    .positive("Pages must be a positive number")
    .integer("Pages must be a whole number")
    .required("Number of pages is required"),
});

export const startReadingBookSchema = (totalPages?: number) =>
  yup.object().shape({
    page: yup
      .number()
      .typeError("Page must be a number")
      .integer("Page must be a whole number")
      .min(1, "The page must be at least 1")
      .required("Number of the page is required")
      .test(
        "max-page",
        `Page cannot be greater than (${totalPages})`,
        (page) => {
          if (totalPages === undefined || page === undefined || page === null) {
            return true;
          }
          return page <= totalPages;
        }
      ),
  });

export const fixedStartReadingBookSchema = yup.object().shape({
  page: yup.number().required(),
});

export type FilterRecommendedFormData = yup.InferType<
  typeof filterRecommendedBookSchema
>;

export type AddBookFormData = yup.InferType<typeof AddBookSchema>;

export type StartReadingBookFormData = yup.InferType<
  typeof fixedStartReadingBookSchema
>;
