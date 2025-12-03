"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DataTable, TableColumn } from "@/components/data-table";
import { FormModal } from "@/components/form-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CategoryForm, CategoryFormData } from "@/components/category-form";
import { useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from "@/lib/api/categories-api";
import { useCategoriesRealtime } from "@/lib/firebase/use-categories-realtime";
import { formatDate } from "@/lib/utils/date-formatter";
import type { Category } from "@/types/api";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const { categories, isLoading, error } = useCategoriesRealtime();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategorySubmit = async (data: CategoryFormData) => {
    try {
      if (categoryToEdit) {
        await updateCategory({ id: categoryToEdit.id, name: data.name }).unwrap();
      } else {
        await addCategory({ name: data.name }).unwrap();
      }
      setIsDialogOpen(false);
      setCategoryToEdit(null);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setCategoryToEdit(null);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) setCategoryToDelete(null);
  };

  const categoryColumns: TableColumn<Category>[] = [
    {
      header: "ID",
      accessor: "id",
      className: "font-medium",
      render: (_category, index) => {
        return (currentPage - 1) * 5 + (index ?? 0) + 1;
      },
    },
    {
      header: "Category Name",
      accessor: "name",
    },
    {
      header: "Created Date",
      accessor: "createdAt",
      render: (category) => formatDate(category.createdAt),
    },
  ];

  const categoryStats = [
    {
      title: "Total Categories",
      value: categories.length,
    },
    {
      title: "Active Categories",
      value: categories.length,
    },
    {
      title: "Latest Category",
      value: categories[categories.length - 1]?.name || "N/A",
    },
    {
      title: "Oldest Category",
      value: categories[0]?.name || "N/A",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load categories: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage your product categories"
      >
        <Button className="gap-2 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
          <Plus className="size-4" />
          Add Category
        </Button>
      </PageHeader>

      <FormModal
        isOpen={isDialogOpen}
        onOpenChange={handleDialogChange}
        title={categoryToEdit ? "Edit Category" : "Add New Category"}
        description={categoryToEdit ? "Update the category name." : "Add a new category for your products."}
        showFooter={false}
        size="sm"
      >
        <CategoryForm
          onSubmit={handleCategorySubmit}
          onCancel={() => handleDialogChange(false)}
          defaultValues={categoryToEdit ? { name: categoryToEdit.name } : undefined}
          submitButtonText={categoryToEdit ? "Update Category" : "Add Category"}
          cancelButtonText="Cancel"
          isLoading={categoryToEdit ? isUpdating : isAdding}
        />
      </FormModal>

      <DataTable
        title="All Categories"
        data={categories}
        columns={categoryColumns}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search categories..."
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={5}
        noDataMessage="No categories found"
        onEdit={handleEdit}
        onDelete={handleDelete}
        filterFunction={(category, searchTerm) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.id.toLowerCase().includes(searchTerm.toLowerCase())
        }
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
