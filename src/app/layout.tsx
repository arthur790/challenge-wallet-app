import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Mini wallet de demostración",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
