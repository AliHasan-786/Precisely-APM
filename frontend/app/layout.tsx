import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM-Intel Agent | Precisely",
  description:
    "AI-powered competitive intelligence for Precisely Product Managers. Track competitor moves and draft counter-requirements in one click.",
  keywords: ["competitive intelligence", "product management", "Precisely", "data integrity"],
  openGraph: {
    title: "PM-Intel Agent | Precisely",
    description: "AI-powered competitive intelligence for Precisely Product Managers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#F8F9FA] antialiased">{children}</body>
    </html>
  );
}
