"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/components/Ui/FormInput";
import {
  filterRecommendedBookSchema,
  FilterRecommendedFormData,
} from "./schemas/filter-schemas";

type FilterFormType = {
  onSubmit: SubmitHandler<FilterRecommendedFormData>;
};

export default function FilterForm({ onSubmit }: FilterFormType) {
  const { control, handleSubmit } = useForm<FilterRecommendedFormData>({
    resolver: yupResolver(filterRecommendedBookSchema),

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
      <h2 className="text-light md:text-large text-milk-white">Filters</h2>
      <FormInput control={control} name="title" label="Book title" />
      <FormInput control={control} name="author" label="The author" />
      <button
        type="submit"
        className="cursor-pointer max-w-[100px] md:max-w-[122px] mt-3 py-[10px] md:py-3 md:px-6 px-[20px] bg-transparent text-large md:text-[16px] text-milk-white border rounded-[30px] border-white-transp lg:hover:border-milk-white lg:hover:bg-milk-white lg:hover:text-grey-dark transition-colors"
      >
        To apply
      </button>
    </form>
  );
}
