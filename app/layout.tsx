import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Refaccionaria Campos",
  description: "Panel de gestion - Campos Herramientas Automotrices",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0b09" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('theme');
              if (t === 'light') document.documentElement.classList.add('light');
              else document.documentElement.classList.add('dark');
            } catch(e) { document.documentElement.classList.add('dark'); }
          })();
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
