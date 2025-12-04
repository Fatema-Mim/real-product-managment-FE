import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useCategoriesRealtime } from "@/lib/firebase/use-categories-realtime";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  images: z.any().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  status: z.enum(["Active", "Inactive"]),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit?: (data: ProductFormData) => void;
  defaultValues?: Partial<ProductFormData>;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

export function ProductForm({
  onSubmit,
  defaultValues,
  onCancel,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  isLoading = false,
}: ProductFormProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(defaultValues?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const existingPreviews = existingImageUrls.map((url) =>
    url.startsWith('/') ? `${API_BASE_URL}${url}` : url
  );
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const allPreviews = [...existingPreviews, ...newImagePreviews];

  const maxImages = 5;

  const { categories } = useCategoriesRealtime();
  const availableCategories = categories.map((cat) => cat.name);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      images: [],
      categories: defaultValues?.categories || [],
      price: defaultValues?.price,
      stock: defaultValues?.stock,
      status: defaultValues?.status || "Active",
    },
  });

  const selectedCategories = watch("categories");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remainingSlots = maxImages - allPreviews.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);

      const previews: string[] = [];
      const filesList: File[] = [];

      filesToAdd.forEach((file) => {
        filesList.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === filesToAdd.length) {
            setNewImagePreviews((prev) => [...prev, ...previews]);
            setNewImageFiles((prev) => {
              const updated = [...prev, ...filesList];
              setValue("images", updated);
              return updated;
            });
          }
        };
        reader.readAsDataURL(file);
      });

      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const existingCount = existingImageUrls.length;

    if (index < existingCount) {
      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingCount;
      setNewImagePreviews((prev) => prev.filter((_, i) => i !== newIndex));
      setNewImageFiles((prev) => {
        const updated = prev.filter((_, i) => i !== newIndex);
        setValue("images", updated);
        return updated;
      });
    }
  };

  const toggleCategory = (category: string) => {
    const current = selectedCategories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setValue("categories", updated);
  };

  const removeCategory = (category: string) => {
    const updated = (selectedCategories || []).filter((c) => c !== category);
    setValue("categories", updated);
  };

  const onFormSubmit = (data: ProductFormData) => {
    if (onSubmit) {
      const combinedData = {
        ...data,
        images: newImageFiles,
        existingImages: existingImageUrls,
      };
      onSubmit(combinedData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="contents">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          className="w-full"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <textarea
          id="description"
          placeholder="Enter product description"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="images">
          Product Images (Max {maxImages})
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {allPreviews.map((preview, index) => (
            <div key={index} className="relative h-24 w-full">
              <img
                src={preview}
                alt={`Product preview ${index + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {allPreviews.length < maxImages && (
            <label
              htmlFor="images"
              className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background transition-colors hover:border-primary hover:bg-accent"
            >
              <Upload className="size-6 text-muted-foreground" />
              <span className="mt-1 text-xs text-muted-foreground">
                Add image
              </span>
              <Input
                id="images"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {allPreviews.length} / {maxImages} images uploaded
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category-select">Categories</Label>

        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded-md border border-input bg-background p-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500"
              >
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="hover:text-blue-700"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <select
          id="category-select"
          value=""
          onChange={(e) => {
            if (e.target.value && !selectedCategories.includes(e.target.value)) {
              toggleCategory(e.target.value);
            }
          }}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" className="bg-background text-foreground">Select categories...</option>
          {availableCategories
            .filter((cat) => !selectedCategories.includes(cat))
            .map((category) => (
              <option key={category} value={category} className="bg-background text-foreground">
                {category}
              </option>
            ))}
        </select>
        {errors.categories && (
          <p className="text-sm text-red-500">{errors.categories.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price (৳)</Label>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            placeholder="0"
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="text-sm text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register("status")}
        >
          <option value="Active" className="bg-background text-foreground">Active</option>
          <option value="Inactive" className="bg-background text-foreground">Inactive</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="cursor-pointer">
            {cancelButtonText}
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="cursor-pointer">
          {isLoading ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
