import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Refaccionaria Campos - CRM",
  description: "Sistema de gestion - Campos Herramientas Automotrices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme');
            if (theme === 'light') document.documentElement.classList.add('light');
            else document.documentElement.classList.add('dark');
          })();
        `}} />
      </head>
      <body className="antialiased transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}
