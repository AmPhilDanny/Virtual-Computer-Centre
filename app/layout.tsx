import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Computer Centre – Smart Digital Services",
    template: "%s | AI Computer Centre",
  },
  description:
    "Get professional typing, academic, government, and AI-powered digital services completed fast — powered by intelligent AI agents.",
  keywords: [
    "computer centre",
    "typing services",
    "assignment help",
    "NIN registration",
    "document services",
    "AI services",
    "online computer centre Nigeria",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "AI Computer Centre",
    title: "AI Computer Centre – Smart Digital Services",
    description:
      "AI-powered digital computer centre. Submit any task and our intelligent agents handle the rest.",
  },
  manifest: "/manifest.json",
  themeColor: "#6C47FF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
