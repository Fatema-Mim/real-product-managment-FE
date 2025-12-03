import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./config";
import type { Product } from "@/types/api";

interface UseProductsRealtimeResult {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}

export function useProductsRealtime(): UseProductsRealtimeResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const productsRef = collection(db, "products");
    const productQuery = query(productsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      productQuery,
      (snapshot) => {
        const productsData: Product[] = [];

        snapshot.forEach((productDocument) => {
          const productDetails = productDocument.data();

          const createdAt = productDetails.createdAt instanceof Timestamp
            ? productDetails.createdAt.toDate()
            : productDetails.createdAt;

          const updatedAt = productDetails.updatedAt instanceof Timestamp
            ? productDetails.updatedAt.toDate()
            : productDetails.updatedAt;

          productsData.push({
            id: productDocument.id,
            name: productDetails.name,
            description: productDetails.description,
            price: productDetails.price,
            category_id: productDetails.category_id || [],
            images: productDetails.images || [],
            stock_quantity: productDetails.stock_quantity,
            status: productDetails.status,
            createdAt,
            updatedAt,
          });
        });

        setProducts(productsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setError(error as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, isLoading, error };
}
