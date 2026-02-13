import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FibLinks - Dashboard de Asignaturas",
  description: "Unifica todos los enlaces de tus asignaturas universitarias en un solo lugar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
