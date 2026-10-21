"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { TransactionComposer } from "@/components/organisms/TransactionComposer/TransactionComposer";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";
import { validateNewContact, type ContactViolation } from "@/domain/contact";
import { validateTransfer, type TransferViolation } from "@/domain/transfer";
import type { Contact } from "@/domain/wallet";
import { formatMoney, parseAmountInput } from "@/lib/money";
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
  const selected = contacts.find((contact) => contact.id === selectedContactId);
  const summary =
    selected && Number.isFinite(parsedAmount)
      ? {
          amountLabel: formatMoney(parsedAmount),
          recipientLabel: selected.name,
        }
      : null;

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
      setViolation(null);
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
    );
    router.push("/transaction/confirm");
  }

  return (
    <RequireSession>
      <WalletTemplate title="Nueva transacción">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : null}
        {loadError ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-danger" role="alert">
              No pudimos cargar tu saldo y tus contactos.
            </p>
            <Button type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Reintentar
            </Button>
          </div>
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
            violationMessage={violation ? transferMessages[violation] : undefined}
            contactError={contactError}
            onAmountChange={(value) => {
              setAmount(value);
              setViolation(null);
            }}
            onSelectContact={(id) => {
              setSelectedContactId(id);
              setViolation(null);
            }}
            onNewContactNameChange={setNewContactName}
            onNewContactIdentifierChange={setNewContactIdentifier}
            onSaveContact={() => {
              void handleSaveContact();
            }}
            onContinue={handleContinue}
          />
        ) : null}
      </WalletTemplate>
    </RequireSession>
  );
}
