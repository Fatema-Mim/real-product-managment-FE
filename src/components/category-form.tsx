import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  onSubmit?: (data: CategoryFormData) => void;
  defaultValues?: Partial<CategoryFormData>;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

export function CategoryForm({
  onSubmit,
  defaultValues,
  onCancel,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  isLoading = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
    },
  });

  const onFormSubmit = (data: CategoryFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="contents">
      <div className="grid gap-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          placeholder="Enter category name"
          className="w-full"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="cursor-pointer">
            {cancelButtonText}
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="cursor-pointer">
          {isLoading ? "Adding..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
