"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-[76.5px] items-center justify-between gap-4 border-b bg-background px-6">
      <SidebarTrigger />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 flex size-2 rounded-full bg-red-600" />
        </Button>

        <Button variant="ghost" size="icon">
          <User className="size-5" />
        </Button>
      </div>
    </header>
  );
}
