"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button, buttonClassName } from "@/components/atoms/Button/Button";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { SummaryRow } from "@/components/molecules/SummaryRow/SummaryRow";
import { ConfirmationStatus } from "@/components/organisms/ConfirmationStatus/ConfirmationStatus";
import { ReceiptCard } from "@/components/organisms/ReceiptCard/ReceiptCard";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";
import {
  isConfirmationStatus,
  type ConfirmationOutcome,
  type ConfirmationStatus as OutcomeStatus,
} from "@/domain/confirmation";
import { maskIdentifier } from "@/lib/mask";
import { formatMoney } from "@/lib/money";
import { confirmTransfer } from "@/services/transfers";
import { fetchWallet } from "@/services/wallet";
import { useDraftStore } from "@/store/draft";
import { RequireSession } from "../../require-session";

function readForcedOutcome(): OutcomeStatus | undefined {
  const value = new URLSearchParams(window.location.search).get("outcome");
  return value && isConfirmationStatus(value) ? value : undefined;
}

const errorCopy: Record<
  Exclude<OutcomeStatus, "success">,
  { title: string; description: string }
> = {
  "network-error": {
    title: "Error de conexión",
    description: "No se hizo el cargo. Puedes reintentar.",
  },
  "insufficient-funds": {
    title: "Fondos insuficientes",
    description: "No se hizo el cargo. Este monto ya no cabe en tu saldo.",
  },
  timeout: {
    title: "La confirmación tardó demasiado",
    description:
      "La espera fue larga y no se hizo el cargo. No es una falla de conexión. Puedes reintentar.",
  },
  "unknown-error": {
    title: "Algo salió mal",
    description: "No se hizo el cargo y no hay folio.",
  },
};

export default function ConfirmPage() {
  const router = useRouter();
  const draft = useDraftStore((state) => state.draft);
  const recipientName = useDraftStore((state) => state.recipientName);
  const recipientIdentifier = useDraftStore((state) => state.recipientIdentifier);
  const clearDraft = useDraftStore((state) => state.clearDraft);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<ConfirmationOutcome | null>(null);
  const [available, setAvailable] = useState<number | null>(null);

  useEffect(() => {
    const stored = useDraftStore.getState().draft;

    if (!stored && outcome?.status !== "success") {
      router.replace("/transaction");
    }
  }, [draft, outcome, router]);

  useEffect(() => {
    if (outcome?.status !== "success") {
      return;
    }

    clearDraft();
  }, [clearDraft, outcome]);

  useEffect(() => {
    if (!draft) {
      return;
    }

    let cancelled = false;

    void fetchWallet()
      .then((wallet) => {
        if (!cancelled) {
          setAvailable(wallet.balance);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailable(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [draft]);

  async function handleConfirm() {
    if (!draft?.recipientId) {
      return;
    }

    setSubmitting(true);
    const forced = readForcedOutcome();

    if (forced) {
      window.history.replaceState(null, "", "/transaction/confirm");
    }

    const next = await confirmTransfer(
      { amount: draft.amount, recipientId: draft.recipientId },
      forced,
    );

    setOutcome(next);
    setSubmitting(false);
  }

  if (!draft && outcome?.status !== "success") {
    return (
      <RequireSession>
        <WalletTemplate title="Confirmación">
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        </WalletTemplate>
      </RequireSession>
    );
  }

  const retry =
    outcome &&
    (outcome.status === "network-error" || outcome.status === "timeout")
      ? () => {
          void handleConfirm();
        }
      : undefined;

  let primaryAction: ReactNode = null;

  if (outcome?.status === "success") {
    primaryAction = (
      <Link href="/home" className={buttonClassName()}>
        Volver al inicio
      </Link>
    );
  } else if (retry) {
    primaryAction = (
      <Button type="button" disabled={submitting} onClick={retry}>
        {submitting ? <Spinner /> : null}
        Reintentar
      </Button>
    );
  } else if (outcome?.status === "insufficient-funds") {
    primaryAction = (
      <Link href="/transaction" className={buttonClassName()}>
        Corregir monto
      </Link>
    );
  } else if (outcome?.status === "unknown-error") {
    primaryAction = (
      <div className="flex flex-col gap-3">
        <Link href="/transaction" className={buttonClassName()}>
          Volver a la transacción
        </Link>
        <Link href="/home" className={buttonClassName("secondary")}>
          Ver movimientos
        </Link>
      </div>
    );
  } else if (draft) {
    primaryAction = (
      <Button
        type="button"
        disabled={submitting}
        onClick={() => {
          void handleConfirm();
        }}
      >
        {submitting ? <Spinner /> : null}
        Transferir {formatMoney(draft.amount)}
      </Button>
    );
  }

  const remaining =
    draft && available !== null
      ? Math.round((available - draft.amount) * 100) / 100
      : null;

  return (
    <RequireSession>
      <WalletTemplate title="Confirmación" primaryAction={primaryAction}>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          {draft && outcome?.status !== "success" ? (
            <section className="flex flex-col gap-3">
              <dl className="flex flex-col gap-2 rounded-2xl border border-line bg-surface px-4 py-3">
                <SummaryRow label="Monto" value={formatMoney(draft.amount)} />
                <SummaryRow
                  label="Destinatario"
                  value={
                    recipientIdentifier
                      ? `${recipientName} · ${maskIdentifier(recipientIdentifier)}`
                      : recipientName
                  }
                />
                <SummaryRow label="Comisión" value="Sin comisión" />
                {remaining !== null && remaining >= 0 ? (
                  <SummaryRow label="Saldo después" value={formatMoney(remaining)} />
                ) : null}
                {remaining !== null && remaining < 0 && available !== null ? (
                  <SummaryRow label="Saldo disponible" value={formatMoney(available)} />
                ) : null}
              </dl>
              {!submitting && !outcome ? (
                <Link href="/transaction" className="self-start text-sm font-semibold text-accent">
                  Corregir
                </Link>
              ) : null}
            </section>
          ) : null}
          <div aria-live="polite" className="flex flex-col gap-4">
            {submitting ? (
              <p className="text-sm font-medium">Confirmando la transferencia…</p>
            ) : null}
            {!submitting && outcome && outcome.status !== "success" ? (
              <ConfirmationStatus
                title={errorCopy[outcome.status].title}
                description={errorCopy[outcome.status].description}
              />
            ) : null}
            {!submitting && outcome?.status === "success" ? (
              <ReceiptCard receipt={outcome.receipt} />
            ) : null}
          </div>
        </div>
      </WalletTemplate>
    </RequireSession>
  );
}
