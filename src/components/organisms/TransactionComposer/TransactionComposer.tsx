import { Button } from "@/components/atoms/Button/Button";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { TextInput } from "@/components/atoms/TextInput/TextInput";
import { AmountInput } from "@/components/molecules/AmountInput/AmountInput";
import { ContactRow } from "@/components/molecules/ContactRow/ContactRow";
import { FormField } from "@/components/molecules/FormField/FormField";
import { SummaryRow } from "@/components/molecules/SummaryRow/SummaryRow";

export type ComposerContact = {
  id: string;
  name: string;
  identifier: string;
};

type TransactionComposerProps = {
  amount: string;
  contacts: ComposerContact[];
  selectedContactId: string | null;
  newContactName: string;
  newContactIdentifier: string;
  savingContact: boolean;
  loading: boolean;
  summary: { amountLabel: string; recipientLabel: string } | null;
  availableHint?: string;
  amountError?: string;
  recipientError?: string;
  contactError?: string;
  onAmountChange: (value: string) => void;
  onSelectContact: (id: string) => void;
  onNewContactNameChange: (value: string) => void;
  onNewContactIdentifierChange: (value: string) => void;
  onSaveContact: () => void;
};

export function TransactionComposer({
  amount,
  contacts,
  selectedContactId,
  newContactName,
  newContactIdentifier,
  savingContact,
  loading,
  summary,
  availableHint,
  amountError,
  recipientError,
  contactError,
  onAmountChange,
  onSelectContact,
  onNewContactNameChange,
  onNewContactIdentifierChange,
  onSaveContact,
}: TransactionComposerProps) {
  return (
    <div className="flex flex-col gap-6">
      <AmountInput
        value={amount}
        onChange={onAmountChange}
        error={amountError}
        hint={availableHint}
      />
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Favoritos</h2>
        {recipientError ? (
          <p className="text-sm text-danger" role="alert">
            {recipientError}
          </p>
        ) : null}
        {contacts.length === 0 ? (
          <p className="text-sm text-muted">Todavía no hay contactos.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <ContactRow
                  name={contact.name}
                  identifier={contact.identifier}
                  selected={contact.id === selectedContactId}
                  onSelect={() => onSelectContact(contact.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      <details className="rounded-2xl border border-line bg-surface">
        <summary className="min-h-11 cursor-pointer list-none px-3 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          Nuevo contacto
        </summary>
        <div className="flex flex-col gap-3 px-3 pb-3">
          <FormField label="Nombre" htmlFor="contact-name">
            <TextInput
              id="contact-name"
              value={newContactName}
              onChange={(event) => onNewContactNameChange(event.target.value)}
            />
          </FormField>
          <FormField
            label="Teléfono o email"
            htmlFor="contact-identifier"
            error={contactError}
          >
            <TextInput
              id="contact-identifier"
              value={newContactIdentifier}
              onChange={(event) =>
                onNewContactIdentifierChange(event.target.value)
              }
            />
          </FormField>
          <Button
            type="button"
            variant="secondary"
            disabled={savingContact || loading}
            onClick={onSaveContact}
          >
            {savingContact ? <Spinner /> : null}
            Guardar contacto
          </Button>
        </div>
      </details>
      {summary ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Resumen</h2>
          <dl className="flex flex-col gap-2 rounded-2xl border border-line bg-surface px-4 py-3">
            <SummaryRow label="Monto" value={summary.amountLabel} />
            <SummaryRow label="Destinatario" value={summary.recipientLabel} />
          </dl>
        </section>
      ) : null}
    </div>
  );
}
