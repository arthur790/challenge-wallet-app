import type { ReactNode } from "react";

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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-8">
      <header>
        <p className="text-sm font-semibold tracking-wide text-accent">Wallet</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
      </header>
      <div className="mt-6 flex flex-1 flex-col gap-6">{children}</div>
      {primaryAction ? <div className="mt-8">{primaryAction}</div> : null}
    </main>
  );
}
