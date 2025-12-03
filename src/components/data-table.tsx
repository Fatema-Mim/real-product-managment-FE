import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search } from "lucide-react";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | string;
  className?: string;
  render?: (item: T, index?: number) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: TableColumn<T>[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  filterFunction?: (item: T, searchTerm: string) => boolean;
  noDataMessage?: string;
  showActions?: boolean;
}

export function DataTable<T extends { id: number | string }>({
  title,
  data,
  columns,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  currentPage,
  onPageChange,
  itemsPerPage = 5,
  onEdit,
  onDelete,
  filterFunction,
  noDataMessage = "No data found",
  showActions = true,
}: DataTableProps<T>) {
  const filteredData = filterFunction
    ? data.filter((item) => filterFunction(item, searchTerm))
    : data;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getCellValue = (item: T, accessor: keyof T | string): React.ReactNode => {
    const value = item[accessor as keyof T];
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return String(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-[40%] -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {showActions && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <TableRow key={item.id}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.render
                        ? column.render(item, rowIndex)
                        : getCellValue(item, column.accessor)}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 cursor-pointer"
                            onClick={() => onEdit(item)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer size-8 text-red-500 hover:text-red-600"
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="text-center"
                >
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of{" "}
              {filteredData.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="size-9"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
