import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Homies Clean | Floor Cleaners, Spin Mops & Toilet Care",
  description: "High-performance home cleaning essentials. Antibacterial floor cleaners, spin mops, toilet stain removers, and combo bundles with fast doorstep delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
