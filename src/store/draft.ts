"use client";

import { create } from "zustand";
import type { TransferDraft } from "@/domain/transfer";

type DraftState = {
  draft: TransferDraft | null;
  recipientName: string;
  recipientIdentifier: string;
  setDraft: (
    draft: TransferDraft,
    recipientName: string,
    recipientIdentifier: string,
  ) => void;
  clearDraft: () => void;
};

export const useDraftStore = create<DraftState>()((set) => ({
  draft: null,
  recipientName: "",
  recipientIdentifier: "",
  setDraft: (draft, recipientName, recipientIdentifier) =>
    set({ draft, recipientName, recipientIdentifier }),
  clearDraft: () =>
    set({ draft: null, recipientName: "", recipientIdentifier: "" }),
}));
