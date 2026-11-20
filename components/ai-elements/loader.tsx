import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderProps = {
  size?: number;
  className?: string;
};

export function Loader({ size = 16, className }: LoaderProps) {
  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <Loader2
        size={size}
        className="animate-spin text-muted-foreground"
      />
    </div>
  );
}