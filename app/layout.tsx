import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DraftForge - LoL Build MVP",
  description: "MVP SaaS para descobrir builds e planos de jogo por campeao e modo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
