"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />

          <div className="flex flex-1 flex-col">
            <Header />

            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </AuthGuard>
  );
}
