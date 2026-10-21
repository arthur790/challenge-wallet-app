import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white",
  secondary: "border border-line bg-surface text-ink",
  danger: "bg-danger text-white",
};

export function buttonClassName(variant: ButtonVariant = "primary"): string {
  return [
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClass[variant],
  ].join(" ");
}

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({
  children,
  variant = "primary",
  disabled = false,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
