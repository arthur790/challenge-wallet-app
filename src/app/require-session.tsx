"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";
import { useSessionStore } from "@/store/session";

function useHasHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => useSessionStore.persist.onFinishHydration(onStoreChange),
    () => useSessionStore.persist.hasHydrated(),
    () => false,
  );
}

type RequireSessionProps = {
  children: ReactNode;
};

export function RequireSession({ children }: RequireSessionProps) {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const userId = useSessionStore((state) => state.userId);

  useEffect(() => {
    if (hasHydrated && !userId) {
      router.replace("/login");
    }
  }, [hasHydrated, router, userId]);

  if (!hasHydrated || !userId) {
    return (
      <WalletTemplate title="Cargando">
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      </WalletTemplate>
    );
  }

  return children;
}
