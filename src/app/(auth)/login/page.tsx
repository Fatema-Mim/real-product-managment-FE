"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api/auth-api";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "demo",
      password: "demo123",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");
      await login(data).unwrap();
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 text-white">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gray-700">
        <h1 className="text-2xl font-semibold"> Dashboard</h1>
      </div>

      <div className="flex items-center justify-center p-10 bg-black">
        <Card className="w-full max-w-sm bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-center text-xl">Login</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  readOnly
                  className="cursor-not-allowed opacity-75"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  readOnly
                  className="cursor-not-allowed opacity-75"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
