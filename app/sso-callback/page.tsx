"use client";

import { HandleSSOCallback } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-white text-zinc-900 dark:bg-[#08090d] dark:text-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Completing sign in...</p>
      </div>
      <HandleSSOCallback
        navigateToApp={({ decorateUrl }) => {
          const destination = decorateUrl ? decorateUrl("/") : "/";
          if (destination.startsWith("http")) {
            window.location.href = destination;
            return;
          }
          router.replace(destination);
        }}
        navigateToSignIn={() => router.replace("/sign-in")}
        navigateToSignUp={() => router.replace("/sign-in")}
      />
    </div>
  );
}
