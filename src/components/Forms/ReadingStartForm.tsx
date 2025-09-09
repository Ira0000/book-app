"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/components/Ui/FormInput";
import {
  StartReadingBookFormData,
  startReadingBookSchema,
} from "./schemas/filter-schemas";

type ReadingStartFormType = {
  onSubmit: SubmitHandler<StartReadingBookFormData>;
  buttonText: string;
  totalPages?: number;
};

export default function ReadingStartForm({
  onSubmit,
  buttonText,
  totalPages,
}: ReadingStartFormType) {
  const { control, handleSubmit } = useForm<StartReadingBookFormData>({
    resolver: yupResolver(startReadingBookSchema(totalPages)),

    defaultValues: {
      page: 0,
    },
    mode: "onChange",
  });

  return (
    <form
      noValidate
      className="bg-transparent flex flex-col gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-light text-milk-white">Start page:</h2>
      <FormInput
        validationVisible={true}
        control={control}
        name="page"
        label="Page number"
      />
      <button
        type="submit"
        className="cursor-pointer max-w-[100px] mt-3 py-[10px] px-[20px] bg-transparent text-large text-milk-white border rounded-[30px] border-white-transp lg:hover:border-milk-white lg:hover:bg-milk-white lg:hover:text-grey-dark transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
}
