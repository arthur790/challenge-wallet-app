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
      className="flex flex-col gap-5"
      aria-busy={loading}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <FormField label="Teléfono o email" htmlFor="identifier" error={error}>
        <TextInput
          id="identifier"
          value={identifier}
          autoComplete="username"
          disabled={loading}
          onChange={(event) => onIdentifierChange(event.target.value)}
        />
      </FormField>
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner /> : null}
        Entrar
      </Button>
    </form>
  );
}
