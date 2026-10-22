"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/domain/wallet";

type SessionState = {
  userId: string | null;
  name: string | null;
  setSession: (user: SessionUser) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      name: null,
      setSession: (user) => set({ userId: user.userId, name: user.name }),
    }),
    {
      name: "wallet-session",
      partialize: (state) => ({ userId: state.userId, name: state.name }),
    },
  ),
);
