import { FormField } from "@/components/molecules/FormField/FormField";
import { TextInput } from "@/components/atoms/TextInput/TextInput";

type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
};

export function AmountInput({ value, onChange, error, hint }: AmountInputProps) {
  return (
    <FormField label="Monto (MXN)" htmlFor="amount" error={error} hint={hint}>
      <TextInput
        id="amount"
        inputMode="decimal"
        value={value}
        placeholder="0.00"
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}
