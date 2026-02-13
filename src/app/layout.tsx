import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FibLinks - Gestión de Asignaturas",
  description: "Dashboard para gestionar asignaturas y sus enlaces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
