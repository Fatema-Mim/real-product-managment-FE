import { baseApi } from "./base-api";
import type {
  ProductsResponse,
  ProductResponse,
  AddProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
} from "@/types/api";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () => "/api/products",
      providesTags: ["Products"],
    }),

    getProduct: builder.query<ProductResponse, string>({
      query: (id) => `/api/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    addProduct: builder.mutation<AddProductResponse, FormData>({
      query: (formData) => ({
        url: "/api/products/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<UpdateProductResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<DeleteProductResponse, string>({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
