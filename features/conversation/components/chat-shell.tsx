"use client";

import {AppSidebar} from "@/features/conversation/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


export function ChatShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen min-h-0 w-full overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}