import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { initializeDatabase } from "@/lib/db-init";

const outfitFont = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

// Trigger database auto-migration on startup asynchronously
initializeDatabase().catch((err) => {
  console.error("Database auto-migration failed on startup:", err);
});

export const metadata: Metadata = {
  title: "JCI India Zone 12 — Empowering Young Leaders",
  description: "JCI India Zone 12 — Empowering young leaders to create positive change in communities across Telangana & Andhra Pradesh.",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfitFont.variable} h-full antialiased font-sans`}
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
