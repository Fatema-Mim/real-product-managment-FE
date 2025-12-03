"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useProductsRealtime } from "@/lib/firebase/use-products-realtime";
import { useCategoriesRealtime } from "@/lib/firebase/use-categories-realtime";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell, Legend, CartesianGrid } from "recharts";

export default function AnalyticsPage() {
  const { products, isLoading: productsLoading } = useProductsRealtime();
  const { categories, isLoading: categoriesLoading } = useCategoriesRealtime();

  const categoryData = categories.map((category) => {
    const count = products.filter((product) => {
      if (!Array.isArray(product.category_id)) return false;
      return product.category_id.map(String).includes(category.name);
    }).length;
    return {
      name: category.name,
      count: count,
    };
  });

  const activeCount = products.filter((p) => p.status === "active").length;
  const inactiveCount = products.filter((p) => p.status === "inactive").length;

  const statusData = [
    { name: "Active", value: activeCount, color: "#22c55e" },
    { name: "Inactive", value: inactiveCount, color: "#ef4444" },
  ];

  const barChartConfig = {
    count: {
      label: "Products",
      color: "hsl(var(--chart-1))",
    },
  };

  const pieChartConfig = {
    active: {
      label: "Active",
      color: "#22c55e",
    },
    inactive: {
      label: "Inactive",
      color: "#ef4444",
    },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="View insights and statistics about your products"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription>Number of products in each category</CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading || categoriesLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                <BarChart data={categoryData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Status Distribution</CardTitle>
            <CardDescription>Active vs Inactive products</CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {categoriesLoading ? "..." : categories.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {productsLoading || categoriesLoading
                ? "..."
                : categoryData.length > 0
                ? categoryData.reduce((prev, current) =>
                    prev.count > current.count ? prev : current
                  ).name
                : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {categoryData.length > 0 &&
                `${
                  categoryData.reduce((prev, current) =>
                    prev.count > current.count ? prev : current
                  ).count
                } products`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {productsLoading
                ? "..."
                : products.length > 0
                ? `${((activeCount / products.length) * 100).toFixed(0)}%`
                : "0%"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Active products</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
