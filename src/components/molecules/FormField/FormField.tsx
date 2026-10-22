import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

type ControlProps = {
  invalid?: boolean;
  describedBy?: string;
};

type FormFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, hint, error, children }: FormFieldProps) {
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;
  const describedBy = [hint ? hintId : undefined, error ? errorId : undefined]
    .filter((id): id is string => Boolean(id))
    .join(" ");
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<ControlProps>, {
        invalid: Boolean(error),
        describedBy: describedBy || undefined,
      })
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {control}
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
