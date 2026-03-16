import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Refaccionaria Campus - CRM",
  description: "Sistema de gestión de bots - Campos Herramientas Automotrices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#0a0a0f] text-white">
        {children}
      </body>
    </html>
  );
}
