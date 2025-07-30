import { cn } from "@/lib/utils";

export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-landing-primary/40 mx-auto w-16 h-px", className)}
    ></div>
  );
}
