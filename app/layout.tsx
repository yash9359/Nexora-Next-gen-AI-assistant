import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexora AI",
  description: "Your intelligent AI assistant for coding, brainstorming, and everyday productivity.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (


    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>

          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster
                position="bottom-right"
                gutter={10}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "var(--popover)",
                    color: "var(--popover-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: 500,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  },
                  success: {
                    iconTheme: {
                      primary: "var(--primary)",
                      secondary: "var(--primary-foreground)",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "var(--destructive)", 
                      secondary: "var(--popover)",
                    },
                  },
                }}
              />
              <TooltipProvider>{children}</TooltipProvider> 

            </ThemeProvider>
          </QueryProvider>

        </ClerkProvider>
      </body>
    </html>


  );
}
