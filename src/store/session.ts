"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/domain/wallet";

type SessionState = {
  userId: string | null;
  name: string | null;
  hasHydrated: boolean;
  setSession: (user: SessionUser) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      name: null,
      hasHydrated: false,
      setSession: (user) => set({ userId: user.userId, name: user.name }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "wallet-session",
      partialize: (state) => ({ userId: state.userId, name: state.name }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

if (typeof window !== "undefined") {
  const markHydrated = () => {
    useSessionStore.getState().setHasHydrated(true);
  };

  useSessionStore.persist.onFinishHydration(markHydrated);

  if (useSessionStore.persist.hasHydrated()) {
    markHydrated();
  }
}
