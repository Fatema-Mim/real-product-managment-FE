"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetProductQuery } from "@/lib/api/products-api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data, isLoading, error } = useGetProductQuery(productId);
  const product = data?.product;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load product details</p>
          <Button onClick={() => router.push("/dashboard/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const capitalizedName = product.name.charAt(0).toUpperCase() + product.name.slice(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title={capitalizedName}
        description="Product Details"
      >
        <Button
          variant="outline"
          className="gap-2 cursor-pointer"
          onClick={() => router.push("/dashboard/products")}
        >
          <ArrowLeft className="size-4" />
          Back to Products
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Images Section */}
        <div className="space-y-4">
          {product.images && product.images.length > 0 ? (
            <div className="space-y-4">
              {/* Main large image */}
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={product.images[0].startsWith('/') ? `${API_BASE_URL}${product.images[0]}` : product.images[0]}
                  alt={`${product.name} - Main Image`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Smaller thumbnail images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((image, index) => (
                    <div key={index + 1} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={image.startsWith('/') ? `${API_BASE_URL}${image}` : image}
                        alt={`${product.name} - Image ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square rounded-lg border flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Product Information</h2>

            <div className="grid gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{capitalizedName}</p>
              </div>

              {product.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{product.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium text-lg">
                  ৳{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Stock Quantity</p>
                <p className="font-medium">{product.stock_quantity}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.status === "active"
                      ? "text-green-500 bg-green-500/10"
                      : "text-red-500 bg-red-500/10"
                  }`}
                >
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                {product.category_id && Array.isArray(product.category_id) && product.category_id.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.category_id.map((categoryId, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500"
                      >
                        {categoryId}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No categories</p>
                )}
              </div>

              {product.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="text-sm">
                    {(() => {
                      const date = product.createdAt instanceof Date
                        ? product.createdAt
                        : new Date(product.createdAt);
                      return !isNaN(date.getTime())
                        ? date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A";
                    })()}
                  </p>
                </div>
              )}

              {product.updatedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">
                    {(() => {
                      const date = product.updatedAt instanceof Date
                        ? product.updatedAt
                        : new Date(product.updatedAt);
                      return !isNaN(date.getTime())
                        ? date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A";
                    })()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
