import type { Metadata } from "next";
import Nav from "@/components/nav";

export const metadata: Metadata = { title: "Croche App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
