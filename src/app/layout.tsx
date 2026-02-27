import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderClient from "@/components/SessionProviderClient";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FibLinks — Tu espacio academico",
    template: "%s | FibLinks",
  },
  description:
    "Dashboard para gestionar asignaturas, guardar enlaces privados y compartir recursos revisados para toda la clase.",
  keywords: ["FibLinks", "FIB", "UPC", "asignaturas", "enlaces", "estudiantes"],
  icons: {
    icon: [{ url: "/fiblinks-logo.svg", type: "image/svg+xml" }],
    shortcut: ["/fiblinks-logo.svg"],
    apple: [{ url: "/fiblinks-logo.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "FibLinks",
    title: "FibLinks — Tu espacio academico",
    description:
      "Organiza tus asignaturas, añade enlaces útiles y comparte recursos con moderación.",
    images: [
      {
        url: "/logos/FibLinks.png",
        width: 512,
        height: 512,
        alt: "Logo de FibLinks",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "FibLinks — Tu espacio academico",
    description:
      "Organiza tus asignaturas, añade enlaces útiles y comparte recursos con moderación.",
    images: ["/logos/FibLinks.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProviderClient>{children}</SessionProviderClient>
      </body>
    </html>
  );
}
