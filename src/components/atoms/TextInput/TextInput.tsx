import type { ChangeEvent } from "react";

type TextInputProps = {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputMode?: "text" | "decimal" | "email" | "tel";
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
};

export function TextInput({
  id,
  value,
  onChange,
  inputMode = "text",
  placeholder,
  autoComplete,
  disabled = false,
  invalid = false,
  describedBy,
}: TextInputProps) {
  return (
    <input
      id={id}
      className={`h-11 w-full rounded-2xl border border-line bg-surface px-3 text-base text-ink outline-none focus:border-accent disabled:opacity-50 aria-invalid:border-danger ${
        inputMode === "decimal" ? "tabular-nums" : ""
      }`}
      value={value}
      onChange={onChange}
      inputMode={inputMode}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    />
  );
}
