"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";

type ChatEmptyProps = {
  onSelectPrompt?: (prompt: string) => void;
};

const SUGGESTIONS = [
  "Explain Dynamic Programming with a simple example",
  "Help me debug a Next.js API route",
  "Write a clean SQL query for PostgreSQL",
  "Give me 5 DSA interview tips",
];

export default function ChatEmpty({ onSelectPrompt }: ChatEmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Image src="/nexoraIcon_transparentsvg.svg" alt="Nexora Icon" width={48} height={48} />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight">
        Hello, how can I help you today?
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Ask me anything about coding, DSA, system design, or your projects.
      </p>

      {onSelectPrompt && (
        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}