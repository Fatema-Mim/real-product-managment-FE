"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ProductStatus } from "@/components/product-status";
import { DataTable, TableColumn } from "@/components/data-table";
import { FormModal } from "@/components/form-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ProductForm, ProductFormData } from "@/components/product-form";
import { useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } from "@/lib/api/products-api";
import { useProductsRealtime } from "@/lib/firebase/use-products-realtime";
import type { Product } from "@/types/api";
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const { products, isLoading, error } = useProductsRealtime();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleProductSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("price", data.price.toString());
      formData.append("stock_quantity", data.stock.toString());
      formData.append("status", data.status.toLowerCase());
      formData.append("category_id", JSON.stringify(data.categories || []));

      if (data.existingImages && data.existingImages.length > 0) {
        formData.append("existing_images", JSON.stringify(data.existingImages));
      }

      if (data.images && data.images.length > 0) {
        data.images.forEach((image: File) => {
          formData.append("images", image);
        });
      }

      if (productToEdit) {
        await updateProduct({ id: productToEdit.id, formData }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await addProduct(formData).unwrap();
        toast.success("Product added successfully!");
      }
      setIsDialogOpen(false);
      setProductToEdit(null);
    } catch (error: any) {
      console.error("Failed to save product:", error);
      const errorMessage = error?.data?.message || "Failed to save product. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setProductToEdit(null);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id).unwrap();
      toast.success("Product deleted successfully!");
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      const errorMessage = error?.data?.message || "Failed to delete product. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) setProductToDelete(null);
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "active":
        return "text-green-500 bg-green-500/10";
      case "inactive":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const productColumns: TableColumn<Product>[] = [
    {
      header: "ID",
      accessor: "id",
      className: "font-medium",
      render: (_product, index) => {
        return (currentPage - 1) * 5 + (index ?? 0) + 1;
      },
    },
    {
      header: "Product Name",
      accessor: "name",
      render: (product) => {
        const capitalizedName = product.name.charAt(0).toUpperCase() + product.name.slice(1);
        return (
          <button
            onClick={() => router.push(`/dashboard/products/${product.id}`)}
            className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer text-left"
          >
            {capitalizedName}
          </button>
        );
      },
    },
    {
      header: "Category",
      accessor: "category_id",
      render: (product) => {
        const categories = Array.isArray(product.category_id) ? product.category_id : [];
        return (
          <div className="flex flex-wrap gap-1">
            {categories.length > 0 ? (
              categories.map((categoryId, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500"
                >
                  {categoryId}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No categories</span>
            )}
          </div>
        );
      },
    },
    {
      header: "Price",
      accessor: "price",
      render: (product) => {
        const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
        return `৳${price.toFixed(2)}`;
      },
    },
    {
      header: "Stock",
      accessor: "stock_quantity",
    },
    {
      header: "Status",
      accessor: "status",
      render: (product) => {
        const capitalizedStatus = product.status.charAt(0).toUpperCase() + product.status.slice(1);
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
              product.status
            )}`}
          >
            {capitalizedStatus}
          </span>
        );
      },
    },
  ];

  const productStats = [
    {
      title: "Total Products",
      value: products.length,
    },
    {
      title: "Active Products",
      value: products.filter((p) => p.status === "active").length,
    },
    {
      title: "Inactive Products",
      value: products.filter((p) => p.status === "inactive").length,
    },
    {
      title: "Total Stock",
      value: products.reduce((acc, p) => acc + p.stock_quantity, 0),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product inventory and pricing"
      >
        <Button className="gap-2 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
          <Plus className="size-4" />
          Add Product
        </Button>
      </PageHeader>

      <FormModal
        isOpen={isDialogOpen}
        onOpenChange={handleDialogChange}
        title={productToEdit ? "Edit Product" : "Add New Product"}
        description={productToEdit ? "Update the product information." : "Add a new product to your inventory."}
        showFooter={false}
        size="md"
      >
        <ProductForm
          onSubmit={handleProductSubmit}
          onCancel={() => handleDialogChange(false)}
          defaultValues={productToEdit ? {
            name: productToEdit.name,
            description: productToEdit.description || "",
            price: productToEdit.price,
            stock: productToEdit.stock_quantity,
            status: productToEdit.status === "active" ? "Active" : "Inactive",
            categories: Array.isArray(productToEdit.category_id)
              ? productToEdit.category_id.map(String)
              : [],
            images: productToEdit.images || [],
          } : undefined}
          submitButtonText={productToEdit ? "Update Product" : "Add Product"}
          cancelButtonText="Cancel"
          isLoading={productToEdit ? isUpdating : isAdding}
        />
      </FormModal>

      <ProductStatus stats={productStats} columns={4} />

      <DataTable
        title="All Products"
        data={products}
        columns={productColumns}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search products..."
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={5}
        noDataMessage="No products found"
        onEdit={handleEdit}
        onDelete={handleDelete}
        filterFunction={(product, searchTerm) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.category_id && product.category_id.some((cat: number) =>
            cat.toString().toLowerCase().includes(searchTerm.toLowerCase())
          ))
        }
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
