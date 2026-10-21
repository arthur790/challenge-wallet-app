"use client";

import { Button } from "@/components/atoms/Button/Button";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";
import { RequireSession } from "../require-session";

type HomeErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function HomeError({ error }: HomeErrorProps) {
  return (
    <RequireSession>
      <WalletTemplate title="Inicio">
        <p className="text-sm text-danger" role="alert">
          {error.message || "No se pudo cargar tu wallet."}
        </p>
        <Button
          type="button"
          onClick={() => {
            // El query view=error sigue activo: un push del router vuelve a montar este error.
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- recarga limpia /home
            window.location.assign("/home");
          }}
        >
          Reintentar
        </Button>
      </WalletTemplate>
    </RequireSession>
  );
}
