import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "in" | "out" | "neutral";
};

const toneClass = {
  in: "bg-success/10 text-success",
  out: "bg-danger/10 text-danger",
  neutral: "bg-line text-ink",
} as const;

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
