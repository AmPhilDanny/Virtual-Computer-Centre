import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { prisma } from "@/lib/prisma";
import PrivacyModal from "@/components/modals/PrivacyModal";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export async function generateMetadata(): Promise<Metadata> {
  const settingsList = await prisma.siteSettings.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteName = settings.siteName || "AI Computer Centre";
  const siteDescription = settings.siteDescription || "AI-powered digital computer centre delivering online services.";
  const faviconUrl = settings.faviconUrl || "/favicon.ico";

  return {
    title: {
      default: `${siteName} – Smart Digital Services`,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
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
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      type: "website",
      siteName: siteName,
      title: `${siteName} – Smart Digital Services`,
      description: siteDescription,
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteName,
    },
  };
}

export const viewport = {
  themeColor: "#6C47FF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsList = await prisma.siteSettings.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  // Generate dynamic CSS variables for branding
  const brandStyles = `
    :root {
      ${settings.brandPrimary ? `--brand-primary: ${settings.brandPrimary};` : ""}
      ${settings.brandSecondary ? `--brand-secondary: ${settings.brandSecondary};` : ""}
      ${settings.brandAccent ? `--brand-accent: ${settings.brandAccent};` : ""}
    }
  `;

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
        <style dangerouslySetInnerHTML={{ __html: brandStyles }} />
      </head>
      <body>
        <Providers>
          <PrivacyModal />
          {children}
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
