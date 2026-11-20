"use client";

import Image from "next/image";
import {
  Code2,
  Loader2,
  MessageSquarePlus,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCreateConversation } from "@/features/conversation/hooks/use-conversation";

const QUICK_STARTS = [
  {
    icon: Code2,
    title: "Debug & Write Code",
    description: "Next.js, C++, DSA, ya SQL queries fix aur optimize karo",
    chatTitle: "Coding & Debugging",
  },
  {
    icon: Sparkles,
    title: "Brainstorm Ideas",
    description: "Naye project features, architecture, ya system design socho",
    chatTitle: "Project Brainstorming",
  },
  {
    icon: Zap,
    title: "Learn Faster",
    description: "Koi bhi technical concept basic intuition se samjho",
    chatTitle: "Concept Deep Dive",
  },
];

export default function HomePage() {
  const createConversation = useCreateConversation();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
   
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
        <SidebarTrigger className="size-10 sm:size-8" />
        <Separator orientation="vertical" className="mx-1 hidden h-4 sm:block" />
        <span className="text-sm font-medium text-muted-foreground">Home</span>
      </header>


      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:py-10">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          {/* Logo */}
          <div className="relative mb-5 flex size-14 items-center justify-center overflow-hidden rounded-2xl border bg-primary/10 shadow-sm">
            <Image
              src="/nexoraIcon_transparent.png"
              alt="Nexora AI"
              fill
              sizes="56px"
              className="object-cover p-1.5"
            />
          </div>

  
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome to Nexora AI
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Start a new conversation or pick an existing chat from the sidebar
            to continue where you left off.
          </p>

          <Button
            size="lg"
            className="mt-6 gap-2 rounded-full px-6"
            onClick={() => createConversation.mutate()}
            disabled={createConversation.isPending}
          >
            {createConversation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MessageSquarePlus className="size-4" />
            )}
            {createConversation.isPending
              ? "Creating chat..."
              : "Start a New Chat"}
          </Button>

          <div className="mt-8 grid w-full grid-cols-1 gap-3 text-left sm:mt-10 sm:grid-cols-3">
            {QUICK_STARTS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  disabled={createConversation.isPending}
                  onClick={() => createConversation.mutate(item.chatTitle)}
                  className="group flex min-h-28 flex-col gap-2 rounded-2xl border border-border/70 bg-muted/20 p-4 transition-all hover:border-border hover:bg-muted/50 disabled:opacity-50"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
