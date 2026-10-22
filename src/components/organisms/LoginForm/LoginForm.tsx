import { Button } from "@/components/atoms/Button/Button";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { TextInput } from "@/components/atoms/TextInput/TextInput";
import { FormField } from "@/components/molecules/FormField/FormField";

type LoginFormProps = {
  identifier: string;
  onIdentifierChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string;
};

export function LoginForm({
  identifier,
  onIdentifierChange,
  onSubmit,
  loading,
  error,
}: LoginFormProps) {
  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-5"
      aria-busy={loading}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <FormField
        label="Teléfono o email"
        htmlFor="identifier"
        hint="10 dígitos o un correo. Es una sesión de demostración."
        error={error}
      >
        <TextInput
          id="identifier"
          value={identifier}
          autoComplete="username"
          disabled={loading}
          onChange={(event) => onIdentifierChange(event.target.value)}
        />
      </FormField>
      <div className="mt-auto">
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : null}
          Entrar
        </Button>
      </div>
    </form>
  );
}
