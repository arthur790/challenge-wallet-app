import type { ReactNode } from "react";
import { BrandMark } from "@/components/atoms/BrandMark/BrandMark";

type WalletTemplateProps = {
  title: string;
  children: ReactNode;
  primaryAction?: ReactNode;
};

export function WalletTemplate({
  title,
  children,
  primaryAction,
}: WalletTemplateProps) {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col px-4">
      <header className="shrink-0 pt-8">
        <BrandMark />
        <h1 className="mt-2 text-xl font-semibold tracking-tight">{title}</h1>
      </header>
      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
        {children}
      </div>
      {primaryAction ? (
        <div className="shrink-0 border-t border-line bg-canvas py-3">{primaryAction}</div>
      ) : null}
    </main>
  );
}
