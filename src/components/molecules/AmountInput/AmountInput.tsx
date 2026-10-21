import { FormField } from "@/components/molecules/FormField/FormField";
import { TextInput } from "@/components/atoms/TextInput/TextInput";

type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function AmountInput({ value, onChange, error }: AmountInputProps) {
  return (
    <FormField label="Monto" htmlFor="amount" error={error}>
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
