import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./config";
import type { Category } from "@/types/api";

interface UseCategoriesRealtimeResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}

export function useCategoriesRealtime(): UseCategoriesRealtimeResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const categoriesRef = collection(db, "categories");
    const categoryQuery = query(categoriesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      categoryQuery,
      (snapshot) => {
        const categoriesData: Category[] = [];

        snapshot.forEach((categoryDocument) => {
          const categoryDetails = categoryDocument.data();

          const createdAt = categoryDetails.createdAt instanceof Timestamp
            ? categoryDetails.createdAt.toDate()
            : categoryDetails.createdAt;

          const updatedAt = categoryDetails.updatedAt instanceof Timestamp
            ? categoryDetails.updatedAt.toDate()
            : categoryDetails.updatedAt;

          categoriesData.push({
            id: categoryDocument.id,
            name: categoryDetails.name,
            createdAt,
            updatedAt,
          });
        });

        setCategories(categoriesData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching categories:", error);
        setError(error as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { categories, isLoading, error };
}
