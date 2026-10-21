"use client";

import { create } from "zustand";
import type { TransferDraft } from "@/domain/transfer";

type DraftState = {
  draft: TransferDraft | null;
  recipientName: string;
  setDraft: (draft: TransferDraft, recipientName: string) => void;
};

export const useDraftStore = create<DraftState>()((set) => ({
  draft: null,
  recipientName: "",
  setDraft: (draft, recipientName) => set({ draft, recipientName }),
}));
