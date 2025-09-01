"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddBookFormData,
  AddBookSchema,
} from "../Forms/schemas/filter-schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../Ui/FormInput";

type AddBookPropsType = {
  onSubmit: SubmitHandler<AddBookFormData>;
};

export default function AddBook({ onSubmit }: AddBookPropsType) {
  const { control, handleSubmit } = useForm<AddBookFormData>({
    resolver: yupResolver(AddBookSchema),

    defaultValues: {
      title: "",
      author: "",
    },
    mode: "onChange",
  });

  return (
    <form
      noValidate
      className="bg-transparent flex flex-col gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-light text-milk-white">Book details</h2>
      <FormInput control={control} name="title" label="Book title" />
      <FormInput control={control} name="author" label="The author" />

      <FormInput control={control} name="totalPages" label="Number of pages" />

      <button
        type="submit"
        className="cursor-pointer max-w-[110px] mt-3 py-[10px] px-[20px] bg-transparent text-large text-milk-white border rounded-[30px] border-white-transp lg:hover:border-milk-white lg:hover:bg-milk-white lg:hover:text-grey-dark transition-colors"
      >
        Add book
      </button>
    </form>
  );
}
