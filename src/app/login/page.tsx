"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "@/components/organisms/LoginForm/LoginForm";
import { AuthTemplate } from "@/components/templates/AuthTemplate/AuthTemplate";
import { parseIdentifier } from "@/domain/identifier";
import { login, SimulatedLoginError } from "@/services/session";
import { useSessionStore } from "@/store/session";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit() {
    if (!parseIdentifier(identifier)) {
      setError("Ingresa un email válido o un teléfono de 10 dígitos.");
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const user = await login(identifier);
      setSession(user);
      router.push("/home");
    } catch (caught) {
      setError(
        caught instanceof SimulatedLoginError
          ? "No pudimos iniciar sesión. Intenta de nuevo."
          : "Ocurrió un error de conexión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthTemplate title="Entra a spin">
      <LoginForm
        identifier={identifier}
        onIdentifierChange={setIdentifier}
        onSubmit={() => {
          void handleSubmit();
        }}
        loading={loading}
        error={error}
      />
    </AuthTemplate>
  );
}
