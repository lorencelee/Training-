import { clsx } from "clsx";

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("bg-panel border border-border rounded-2xl p-5 mb-4", className)}>
      {children}
    </div>
  );
}
