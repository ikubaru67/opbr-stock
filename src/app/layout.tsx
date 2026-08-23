import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "OPBR Ikubaru - RD Accounts Stock",
  description: "One Piece Bounty Rush — Jual Akun Premium",
  themeColor: "#080e1a",
  icons: {
    icon: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1784165210/1000704453.jpg_idnwa3.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${rubik.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/jpeg" href="https://res.cloudinary.com/dx0gg88mk/image/upload/v1784165210/1000704453.jpg_idnwa3.jpg" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
        {children}
      </body>
    </html>
  );
}
