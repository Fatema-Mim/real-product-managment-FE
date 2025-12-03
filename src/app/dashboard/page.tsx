"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  FolderTree,
  PackageCheck,
  PackageX,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ProductStatus } from "@/components/product-status";
import { useProductsRealtime } from "@/lib/firebase/use-products-realtime";
import { useCategoriesRealtime } from "@/lib/firebase/use-categories-realtime";
import { capitalizeFirst, formatCurrency } from "@/lib/utils/string-helpers";

export default function DashboardPage() {
  const { products, isLoading: productsLoading } = useProductsRealtime();
  const { categories, isLoading: categoriesLoading } = useCategoriesRealtime();

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const inactiveProducts = products.filter(p => p.status === "inactive").length;
  const totalCategories = categories.length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);
  const lowStockProducts = products.filter(p => p.stock_quantity < 10).length;

  const stats = [
    {
      title: "Total Products",
      value: productsLoading ? "..." : totalProducts.toString(),
      icon: Package,
    },
    {
      title: "Active Products",
      value: productsLoading ? "..." : activeProducts.toString(),
      icon: PackageCheck,
    },
    {
      title: "Low Stock",
      value: productsLoading ? "..." : lowStockProducts.toString(),
      icon: PackageX,
    },
    {
      title: "Categories",
      value: categoriesLoading ? "..." : totalCategories.toString(),
      icon: FolderTree,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your store today."
      />

      <ProductStatus stats={stats} columns={4} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productsLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : products.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products yet</p>
              ) : (
                products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <Package className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{capitalizeFirst(product.name)}</p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.stock_quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{formatCurrency(product.price)}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Inventory Value</p>
                  <p className="text-xs text-muted-foreground">All products combined</p>
                </div>
                <div className="text-lg font-bold">
                  {productsLoading ? "..." : formatCurrency(totalInventoryValue)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm font-medium">Active Products</p>
                  <p className="text-xs text-muted-foreground">Currently available</p>
                </div>
                <div className="text-lg font-bold text-green-500">
                  {productsLoading ? "..." : activeProducts}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm font-medium">Inactive Products</p>
                  <p className="text-xs text-muted-foreground">Not available</p>
                </div>
                <div className="text-lg font-bold text-red-500">
                  {productsLoading ? "..." : inactiveProducts}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">Less than 10 units</p>
                </div>
                <div className="text-lg font-bold text-orange-500">
                  {productsLoading ? "..." : lowStockProducts}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
