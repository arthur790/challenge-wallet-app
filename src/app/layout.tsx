import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "spin",
  description: "Wallet de demostración",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
