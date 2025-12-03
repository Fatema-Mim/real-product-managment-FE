import { baseApi } from "./base-api";
import type {
  CategoriesResponse,
  AddCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
} from "@/types/api";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/api/categories",
      providesTags: ["Categories"],
    }),

    addCategory: builder.mutation<AddCategoryResponse, { name: string }>({
      query: (body) => ({
        url: "/api/categories/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation<
      UpdateCategoryResponse,
      { id: string; name: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Categories",
        { type: "Categories", id },
      ],
    }),

    deleteCategory: builder.mutation<DeleteCategoryResponse, string>({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
