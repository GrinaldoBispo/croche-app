import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";

export const metadata: Metadata = { title: "Croche App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Nav />
        <div style={{ paddingBottom: 84 }}>{children}</div>
      </body>
    </html>
  );
}
