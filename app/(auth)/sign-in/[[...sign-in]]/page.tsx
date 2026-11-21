"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Loader2, ArrowUpRight, Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type OAuthStrategy = "oauth_google" | "oauth_github";

export default function SignInPage() {
  const { signIn, fetchStatus } = useSignIn();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [loadingProvider, setLoadingProvider] =
    useState<OAuthStrategy | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already authenticated, redirect immediately to home
  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isAuthLoaded, isSignedIn, router]);

  const isBusy = fetchStatus === "fetching" || loadingProvider !== null;

  async function handleOAuth(strategy: OAuthStrategy) {
    if (!signIn) return;

    try {
      setLoadingProvider(strategy);

      const result = await signIn.sso({
        strategy,
        redirectCallbackUrl: `${window.location.origin}/sso-callback`,
        redirectUrl: `${window.location.origin}/`,
      });

      if (result?.error) {
        toast.error(result.error.message || "Sign in failed");
        setLoadingProvider(null);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Sign in failed"
      );
      setLoadingProvider(null);
    }
  }

  // Prevent flash of sign-in page if already signed in
  if (isAuthLoaded && isSignedIn) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-white dark:bg-[#08090d]">
        <Loader2 className="size-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <main className="relative grid min-h-svh w-full overflow-y-auto bg-white text-zinc-900 transition-colors dark:bg-[#08090d] dark:text-white lg:h-svh lg:grid-cols-2 lg:overflow-hidden">
      {/* Top-Right Theme Toggle Button */}
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        className="fixed right-5 top-5 z-50 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm backdrop-blur-md transition-all hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-white/[0.12]"
      >
        {mounted && resolvedTheme === "dark" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </button>

      {/* LEFT: Adaptive Rich Branding Panel */}
      <section className="relative hidden h-svh overflow-hidden border-r border-zinc-200 bg-slate-50 text-zinc-900 dark:border-white/[0.06] dark:bg-[#08090d] dark:text-white lg:flex">
        {/* Full Background Logo - Light Mode */}
        <div className="absolute inset-0 dark:hidden">
          <Image
            src="/nexoraIcon_transparentsvg.svg"
            alt=""
            fill
            priority
            sizes="50vw"
            className="scale-[1.25] object-contain opacity-[0.05]"
          />
        </div>

        {/* Full Background Logo - Dark Mode (Exact Original) */}
        <div className="absolute inset-0 hidden dark:block">
          <Image
            src="/nexoraIcon_transparentsvg.svg"
            alt="Nexora AI Background"
            fill
            priority
            sizes="50vw"
            className="scale-[1.25] object-contain opacity-30"
          />
        </div>

        {/* Gradient Overlay - Light Mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-slate-50/80 to-indigo-50/30 dark:hidden" />

        {/* Gradient Overlay - Dark Mode (Exact Original) */}
        <div className="absolute inset-0 hidden bg-gradient-to-br from-[#08090d]/75 via-[#08090d]/65 to-[#08090d]/95 dark:block" />

        {/* Ambient Glows - Light Mode */}
        <div className="absolute inset-0 overflow-hidden dark:hidden">
          <div className="absolute -left-32 -top-32 size-[450px] rounded-full bg-indigo-300/25 blur-[130px]" />
          <div className="absolute -bottom-32 -right-20 size-[450px] rounded-full bg-purple-300/20 blur-[130px]" />
        </div>

        {/* Ambient Glows - Dark Mode (Exact Original) */}
        <div className="absolute inset-0 hidden overflow-hidden dark:block">
          <div className="absolute -left-32 -top-32 size-[450px] rounded-full bg-indigo-600/20 blur-[140px]" />
          <div className="absolute -bottom-32 -right-20 size-[450px] rounded-full bg-violet-600/20 blur-[140px]" />
        </div>

        {/* Grid - Light Mode */}
        <div
          className="absolute inset-0 opacity-[0.5] dark:hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Grid - Dark Mode (Exact Original) */}
        <div
          className="absolute inset-0 hidden opacity-[0.12] dark:block"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Branding Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-12">
          {/* Top Brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative size-9">
              <Image
                src="/nexoraIcon_transparentsvg.svg"
                alt="Nexora"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              Nexora AI
            </span>
          </div>

          {/* Center Hero */}
          <div className="mx-auto w-full max-w-lg">
            {/* Hero Logo */}
            <div className="relative mb-8 flex justify-center">
              {/* Light Mode Hero Glow */}
              <div className="absolute size-48 rounded-full bg-indigo-500/15 blur-[80px] dark:hidden" />
              {/* Dark Mode Hero Glow (Exact Original) */}
              <div className="absolute size-48 rounded-full bg-indigo-500/25 blur-[90px] hidden dark:block" />

              {/* Light Mode Hero Icon */}
              <div className="relative size-44 xl:size-52 dark:hidden">
                <Image
                  src="/nexoraIcon_transparentsvg.svg"
                  alt="Nexora AI"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_12px_30px_rgba(99,102,241,0.2)]"
                />
              </div>

              {/* Dark Mode Hero Icon (Exact Original) */}
              <div className="relative size-44 xl:size-52 hidden dark:block">
                <Image
                  src="/nexoraIcon_transparentsvg.svg"
                  alt="Nexora AI"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_0_45px_rgba(99,102,241,0.4)]"
                />
              </div>
            </div>

            <h1 className="text-center text-4xl font-bold tracking-tight text-zinc-900 xl:text-5xl dark:text-white">
              Think Beyond.
              <span className="mt-1.5 block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
                Build Without Limits.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-md text-center text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Think faster, debug cleaner, and brainstorm without limits. Your
              personal AI workspace built for everyday problem solving.
            </p>
          </div>

          {/* Bottom Copyright */}
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            © 2026 Nexora AI. Built for curious minds.
          </p>
        </div>
      </section>

      {/* RIGHT: Clean Adaptive Sign-In */}
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-8 lg:h-svh">
        {/* Desktop subtle dark-mode glow (Exact Original) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden dark:lg:block"
        >
          <div className="absolute right-0 top-1/2 size-[420px] -translate-y-1/2 translate-x-1/3 rounded-full bg-indigo-500/10 blur-[140px]" />
        </div>

        {/* Mobile Background (Exact Original) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 lg:hidden"
        >
          <div className="hidden dark:block">
            <Image
              src="/nexoraIcon_transparentsvg.svg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-[1.25] object-contain opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#08090d]/75 via-[#08090d]/65 to-[#08090d]/95" />
            <div className="absolute -left-24 -top-24 size-96 rounded-full bg-indigo-600/25 blur-[130px]" />
            <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-violet-600/25 blur-[130px]" />
          </div>
        </div>

        {/* Open Content */}
        <div className="relative z-10 w-full max-w-[380px]">
          {/* Mobile Branding */}
          <div className="mb-9 flex flex-col items-center lg:hidden">
            <div className="relative mb-3 flex items-center justify-center">
              <div className="absolute size-24 rounded-full bg-indigo-500/20 blur-2xl dark:bg-indigo-500/30" />
              <div className="relative size-16">
                <Image
                  src="/nexoraIcon_transparentsvg.svg"
                  alt="Nexora AI"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Nexora AI
            </h1>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Get started
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Sign in or create your Nexora AI account in one click.
            </p>
          </div>

          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              disabled={!signIn || isBusy}
              onClick={() => handleOAuth("oauth_google")}
              className="group relative flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-transparent dark:bg-white dark:text-zinc-900 dark:shadow-lg dark:shadow-white/5 dark:hover:bg-zinc-200"
            >
              {loadingProvider === "oauth_google" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="size-5">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
              <ArrowUpRight className="absolute right-4 size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60" />
            </button>

            {/* GitHub */}
            <button
              type="button"
              disabled={!signIn || isBusy}
              onClick={() => handleOAuth("oauth_github")}
              className="group relative flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-zinc-900 bg-zinc-900 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:backdrop-blur-md dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
            >
              {loadingProvider === "oauth_github" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="size-5 fill-current">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              )}
              <span>Continue with GitHub</span>
              <ArrowUpRight className="absolute right-4 size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60" />
            </button>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6 text-center dark:border-white/[0.06] lg:text-left">
            <p className="text-xs leading-relaxed text-zinc-500">
              By continuing, you agree to use Nexora AI responsibly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}