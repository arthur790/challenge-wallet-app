import type { ReactNode } from "react";
import { BrandMark } from "@/components/atoms/BrandMark/BrandMark";

type AuthTemplateProps = {
  title: string;
  children: ReactNode;
};

export function AuthTemplate({ title, children }: AuthTemplateProps) {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col px-4 pt-10 pb-4">
      <BrandMark />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-8 flex min-h-0 flex-1 flex-col">{children}</div>
    </main>
  );
}
