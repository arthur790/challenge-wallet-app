"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { TransactionComposer } from "@/components/organisms/TransactionComposer/TransactionComposer";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";
import { validateNewContact, type ContactViolation } from "@/domain/contact";
import { validateTransfer, type TransferViolation } from "@/domain/transfer";
import type { Contact } from "@/domain/wallet";
import { amountToInput, formatMoney, parseAmountInput } from "@/lib/money";
import { createContact, fetchContacts } from "@/services/contacts";
import { fetchWallet } from "@/services/wallet";
import { useDraftStore } from "@/store/draft";
import { RequireSession } from "../require-session";

const transferMessages: Record<TransferViolation, string> = {
  "amount-not-positive": "Ingresa un monto mayor a cero.",
  "insufficient-balance": "El monto supera tu saldo disponible.",
  "recipient-required": "Elige o guarda un destinatario.",
};

const contactMessages: Record<ContactViolation, string> = {
  "name-required": "Escribe el nombre del contacto.",
  "identifier-invalid":
    "El contacto necesita un email válido o un teléfono de 10 dígitos.",
};

export default function TransactionPage() {
  const router = useRouter();
  const setDraft = useDraftStore((state) => state.setDraft);
  const storedDraft = useSyncExternalStore(
    useDraftStore.subscribe,
    () => useDraftStore.getState().draft,
    () => null,
  );
  const draftKey = storedDraft
    ? `${storedDraft.amount}:${storedDraft.recipientId ?? ""}`
    : "";
  const [appliedDraftKey, setAppliedDraftKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [balance, setBalance] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [amount, setAmount] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newContactName, setNewContactName] = useState("");
  const [newContactIdentifier, setNewContactIdentifier] = useState("");
  const [savingContact, setSavingContact] = useState(false);
  const [violation, setViolation] = useState<TransferViolation | null>(null);
  const [contactError, setContactError] = useState<string | undefined>();

  if (appliedDraftKey === null) {
    setAppliedDraftKey(draftKey);

    if (storedDraft) {
      setAmount(amountToInput(storedDraft.amount));
      setSelectedContactId(storedDraft.recipientId);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(false);

      try {
        const [wallet, nextContacts] = await Promise.all([
          fetchWallet(),
          fetchContacts(),
        ]);

        if (cancelled) {
          return;
        }

        setBalance(wallet.balance);
        setContacts(nextContacts);
      } catch {
        if (!cancelled) {
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const parsedAmount = parseAmountInput(amount);
  const exceedsBalance = Number.isFinite(parsedAmount) && parsedAmount > balance;
  const selected = contacts.find((contact) => contact.id === selectedContactId);
  const summary =
    selected && Number.isFinite(parsedAmount)
      ? {
          amountLabel: formatMoney(parsedAmount),
          recipientLabel: selected.name,
        }
      : null;
  const amountError =
    violation === "amount-not-positive" || violation === "insufficient-balance"
      ? transferMessages[violation]
      : exceedsBalance
        ? transferMessages["insufficient-balance"]
        : undefined;
  const recipientError =
    violation === "recipient-required" ? transferMessages[violation] : undefined;

  async function handleSaveContact() {
    const nextViolation = validateNewContact({
      name: newContactName,
      identifier: newContactIdentifier,
    });

    if (nextViolation) {
      setContactError(contactMessages[nextViolation]);
      return;
    }

    setSavingContact(true);
    setContactError(undefined);

    try {
      const created = await createContact({
        name: newContactName.trim(),
        identifier: newContactIdentifier.trim(),
      });
      setContacts((current) => [created, ...current]);
      setSelectedContactId(created.id);
      setViolation((current) =>
        current === "recipient-required" ? null : current,
      );
      setNewContactName("");
      setNewContactIdentifier("");
    } catch {
      setContactError("No pudimos guardar el contacto.");
    } finally {
      setSavingContact(false);
    }
  }

  function handleContinue() {
    const draft = {
      amount: parsedAmount,
      recipientId: selectedContactId,
    };
    const nextViolation = validateTransfer(draft, balance);

    if (nextViolation) {
      setViolation(nextViolation);
      return;
    }

    if (!selected) {
      setViolation("recipient-required");
      return;
    }

    setViolation(null);
    setDraft(
      { amount: parsedAmount, recipientId: selected.id },
      selected.name,
      selected.identifier,
    );
    router.push("/transaction/confirm");
  }

  return (
    <RequireSession>
      <WalletTemplate
        title="Nueva transacción"
        primaryAction={
          !loading && !loadError ? (
            <Button
              type="button"
              disabled={savingContact || Boolean(amountError) || Boolean(recipientError)}
              onClick={handleContinue}
            >
              Continuar
            </Button>
          ) : loadError ? (
            <Button type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Reintentar
            </Button>
          ) : null
        }
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <>
            <p className="sr-only" role="status">
              Cargando tu saldo y tus contactos
            </p>
            <div className="flex flex-col gap-4" aria-hidden="true">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </>
        ) : null}
        {loadError ? (
          <p className="text-sm text-danger" role="alert">
            No pudimos cargar tu saldo y tus contactos.
          </p>
        ) : null}
        {!loading && !loadError ? (
          <TransactionComposer
            amount={amount}
            contacts={contacts}
            selectedContactId={selectedContactId}
            newContactName={newContactName}
            newContactIdentifier={newContactIdentifier}
            savingContact={savingContact}
            loading={loading}
            summary={summary}
            availableHint={`Disponible ${formatMoney(balance)}`}
            amountError={amountError}
            recipientError={recipientError}
            contactError={contactError}
            onAmountChange={(value) => {
              setAmount(value);
              setViolation((current) =>
                current === "recipient-required" ? current : null,
              );
            }}
            onSelectContact={(id) => {
              setSelectedContactId(id);
              setViolation((current) =>
                current === "recipient-required" ? null : current,
              );
            }}
            onNewContactNameChange={setNewContactName}
            onNewContactIdentifierChange={setNewContactIdentifier}
            onSaveContact={() => {
              void handleSaveContact();
            }}
          />
        ) : null}
        </div>
      </WalletTemplate>
    </RequireSession>
  );
}
