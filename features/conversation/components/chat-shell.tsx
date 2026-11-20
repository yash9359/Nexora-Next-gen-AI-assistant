"use client";

import {AppSidebar} from "@/features/conversation/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";


export function ChatShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
    

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen min-h-0 w-full overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>

    </Suspense>
  );
}