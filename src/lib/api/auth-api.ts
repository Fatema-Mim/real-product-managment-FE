import { baseApi } from "./base-api";
import type { LoginRequest, LoginResponse, LogoutResponse } from "@/types/api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "Products", "Categories"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
