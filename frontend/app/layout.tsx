import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PM-Intel Agent",
  description:
    "AI-powered competitive intelligence for Data Integrity Product Managers. Monitors Informatica, Talend, Collibra and more, automatically.",
  keywords: ["competitive intelligence", "product management", "Precisely", "data integrity", "AI"],
  openGraph: {
    title: "PM-Intel Agent",
    description:
      "AI-powered competitive intelligence for Data Integrity Product Managers. Monitors Informatica, Talend, Collibra and more, automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-[#F8F9FA] antialiased font-sans">{children}</body>
    </html>
  );
}
