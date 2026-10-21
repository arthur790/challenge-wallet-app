"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, buttonClassName } from "@/components/atoms/Button/Button";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { ConfirmationStatus } from "@/components/organisms/ConfirmationStatus/ConfirmationStatus";
import { ReceiptCard } from "@/components/organisms/ReceiptCard/ReceiptCard";
import { SummaryRow } from "@/components/molecules/SummaryRow/SummaryRow";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";
import {
  isConfirmationStatus,
  type ConfirmationOutcome,
  type ConfirmationStatus as OutcomeStatus,
} from "@/domain/confirmation";
import { formatMoney } from "@/lib/money";
import { confirmTransfer } from "@/services/transfers";
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
    description: "No pudimos confirmar la transferencia. Puedes reintentar.",
  },
  "insufficient-funds": {
    title: "Fondos insuficientes",
    description:
      "El saldo ya no cubre este monto. Revisa el monto e inténtalo de nuevo.",
  },
  timeout: {
    title: "La confirmación tardó demasiado",
    description:
      "La espera fue excesiva y no es un fallo de red genérico. Puedes reintentar.",
  },
  "unknown-error": {
    title: "Algo salió mal",
    description:
      "No pudimos completar la transferencia. Vuelve a la transacción.",
  },
};

export default function ConfirmPage() {
  const router = useRouter();
  const draft = useDraftStore((state) => state.draft);
  const recipientName = useDraftStore((state) => state.recipientName);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<ConfirmationOutcome | null>(null);

  useEffect(() => {
    if (!draft) {
      router.replace("/transaction");
    }
  }, [draft, router]);

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

  if (!draft) {
    return (
      <WalletTemplate title="Confirmación">
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      </WalletTemplate>
    );
  }

  const retry =
    outcome &&
    (outcome.status === "network-error" || outcome.status === "timeout")
      ? () => {
          void handleConfirm();
        }
      : undefined;

  return (
    <RequireSession>
      <WalletTemplate
        title="Confirmación"
        primaryAction={
          outcome?.status === "success" ? (
            <Link href="/home" className={buttonClassName()}>
              Volver al inicio
            </Link>
          ) : outcome && !retry ? (
            <Link href="/transaction" className={buttonClassName("secondary")}>
              Volver a la transacción
            </Link>
          ) : outcome ? null : (
            <Button
              type="button"
              disabled={submitting}
              onClick={() => {
                void handleConfirm();
              }}
            >
              {submitting ? <Spinner /> : null}
              Confirmar
            </Button>
          )
        }
      >
        <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface px-4 py-3">
          <SummaryRow label="Monto" value={formatMoney(draft.amount)} />
          <SummaryRow label="Destinatario" value={recipientName} />
        </section>
        {outcome?.status === "success" ? (
          <ReceiptCard receipt={outcome.receipt} />
        ) : null}
        {outcome && outcome.status !== "success" ? (
          <ConfirmationStatus
            title={errorCopy[outcome.status].title}
            description={errorCopy[outcome.status].description}
            onRetry={submitting ? undefined : retry}
          />
        ) : null}
      </WalletTemplate>
    </RequireSession>
  );
}
