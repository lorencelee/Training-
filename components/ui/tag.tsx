import { clsx } from "clsx";
import type { BlockType } from "@/lib/types";

const tagStyles: Record<BlockType | "pap" | "test", string> = {
  lift:   "bg-amber-950 text-amber-300",
  skill:  "bg-cyan-950 text-cyan-300",
  cond:   "bg-red-950 text-red-300",
  mob:    "bg-violet-950 text-violet-300",
  team:   "bg-yellow-950 text-yellow-300",
  recov:  "bg-green-950 text-green-300",
  pillar: "bg-orange-950 text-orange-300",
  plyo:   "bg-pink-950 text-pink-300",
  mb:     "bg-blue-950 text-blue-300",
  speed:  "bg-emerald-950 text-emerald-300",
  pap:    "bg-red-600 text-white",
  test:   "bg-red-600 text-white",
};

const typeLabels: Record<BlockType | "pap" | "test", string> = {
  lift:   "Strength & Power",
  skill:  "Skill",
  cond:   "Energy System",
  mob:    "Movement Prep",
  team:   "Team",
  recov:  "Regeneration",
  pillar: "Pillar Prep",
  plyo:   "Plyometrics",
  mb:     "Med Ball",
  speed:  "Speed",
  pap:    "PAP pair",
  test:   "1RM TEST",
};

export function Tag({ type, label }: { type: BlockType | "pap" | "test"; label?: string }) {
  return (
    <span className={clsx("text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide", tagStyles[type])}>
      {label ?? typeLabels[type]}
    </span>
  );
}
