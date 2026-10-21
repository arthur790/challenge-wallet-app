import type { ReactNode } from "react";

type AuthTemplateProps = {
  title: string;
  children: ReactNode;
};

export function AuthTemplate({ title, children }: AuthTemplateProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-10">
      <p className="text-sm font-semibold tracking-wide text-accent">Wallet</p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-8">{children}</div>
    </main>
  );
}
