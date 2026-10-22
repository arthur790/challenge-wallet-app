import {
  CONFIRMATION_STATUSES,
  isConfirmationStatus,
  type ConfirmationOutcome,
  type ConfirmationStatus,
} from "@/domain/confirmation";
import type {
  Contact,
  Movement,
  MovementPage,
  SessionUser,
  Wallet,
} from "@/domain/wallet";
import { delay } from "@/server/delay";
import { paginateMovements } from "@/server/paginate-movements";

const USER: SessionUser = {
  userId: "user-ada",
  name: "Ada López",
};

const SIMULATED_IDENTIFIERS = new Set(["error@wallet.test", "0000000000"]);

type WalletState = {
  balance: number;
  movements: Movement[];
  contacts: Contact[];
};

type GlobalWithWallet = typeof globalThis & {
  __walletState?: WalletState;
};

function initialState(): WalletState {
  return {
    balance: 2500,
    movements: seedMovements(),
    contacts: [
      { id: "contact-ana", name: "Ana Ruiz", identifier: "5511111111" },
      { id: "contact-luis", name: "Luis Mora", identifier: "5522222222" },
      { id: "contact-mia", name: "Mia Chen", identifier: "mia@wallet.test" },
    ],
  };
}

function state(): WalletState {
  const target = globalThis as GlobalWithWallet;

  if (!target.__walletState) {
    target.__walletState = initialState();
  }

  return target.__walletState;
}

export function getSessionUser(): SessionUser {
  return USER;
}

export function isSimulatedIdentifier(value: string): boolean {
  return SIMULATED_IDENTIFIERS.has(value);
}

export async function getWallet(view?: string): Promise<Wallet> {
  if (view === "loading") {
    await delay(1500);
  }

  const current = state();
  const page = listMovements({ cursor: null, view });

  return {
    user: USER,
    balance: current.balance,
    movements: page.movements,
  };
}

export function listMovements(input: {
  cursor?: string | null;
  view?: string;
} = {}): MovementPage {
  if (input.view === "empty") {
    return { movements: [], nextCursor: null };
  }

  return paginateMovements(state().movements, input.cursor ?? null);
}

export function listContacts(): Contact[] {
  return [...state().contacts];
}

export function addContact(input: { name: string; identifier: string }): Contact {
  const contact: Contact = {
    id: `contact-${crypto.randomUUID()}`,
    name: input.name.trim(),
    identifier: input.identifier.trim(),
  };

  const current = state();
  current.contacts = [contact, ...current.contacts];
  return contact;
}

export async function settleTransfer(input: {
  amount: number;
  recipientId: string;
  forcedStatus?: string | null;
}): Promise<ConfirmationOutcome> {
  const status = resolveStatus(input.forcedStatus);

  if (status === "timeout") {
    await delay(3000);
  }

  if (status !== "success") {
    return { status };
  }

  const contact = state().contacts.find((item) => item.id === input.recipientId);

  if (!contact) {
    return { status: "unknown-error" };
  }

  const current = state();
  current.balance -= input.amount;

  const createdAt = new Date().toISOString();
  const id = `txn-${crypto.randomUUID()}`;
  const movement: Movement = {
    id,
    title: `Envío a ${contact.name}`,
    amount: input.amount,
    direction: "out",
    createdAt,
  };

  current.movements = [movement, ...current.movements];

  return {
    status: "success",
    receipt: {
      id,
      amount: input.amount,
      recipientName: contact.name,
      createdAt,
      balanceAfter: current.balance,
    },
  };
}

function seedMovements(): Movement[] {
  return [
    {
      id: "mov-3",
      title: "Transferencia a Ana",
      amount: 150,
      direction: "out",
      createdAt: "2026-10-20T09:10:00.000Z",
    },
    {
      id: "mov-2",
      title: "Café",
      amount: 85,
      direction: "out",
      createdAt: "2026-10-19T13:30:00.000Z",
    },
    {
      id: "mov-1",
      title: "Nómina",
      amount: 3200,
      direction: "in",
      createdAt: "2026-10-18T15:00:00.000Z",
    },
  ];
}

function resolveStatus(forcedStatus?: string | null): ConfirmationStatus {
  if (forcedStatus && isConfirmationStatus(forcedStatus)) {
    return forcedStatus;
  }

  const index = Math.floor(Math.random() * CONFIRMATION_STATUSES.length);
  return CONFIRMATION_STATUSES[index] ?? "unknown-error";
}
