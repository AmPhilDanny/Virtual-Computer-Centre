import type { Metadata, Viewport } from "next";
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

  const siteName = settings.siteName || "NovaX Digital Centre";
  const siteDescription = settings.seoHomepageDesc || settings.siteDescription || "AI-powered digital computer centre — professional typing, NIN registration, academic help, AI tutoring and document services in Nigeria.";
  const faviconUrl = settings.faviconUrl || "/favicon.png";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://novaxdigitalcentre.vercel.app";
  const ogImage = settings.logoUrl || `${baseUrl}/favicon.png`;

  const dynamicKeywords = settings.seoHomepageKeywords ? settings.seoHomepageKeywords.split(",").map(k => k.trim()) : [];
  const defaultKeywords = [
    "computer centre Nigeria",
    "typing services Nigeria",
    "NIN registration help",
    "document typing Nigeria",
    "assignment help Nigeria",
    "academic writing Nigeria",
    "AI computer centre",
    "online document services",
    "CV writing Nigeria",
    "data entry Nigeria",
    "transcription Nigeria",
    "grant writing Nigeria",
    "JAMB form assistance",
    "NYSC form assistance",
    "AI tutor Nigeria",
    "business plan writing Nigeria",
    "digital services Nigeria",
    "NovaX Digital Centre",
    "virtual computer centre",
  ];

  return {
    title: {
      default: settings.seoHomepageTitle || `${siteName} — AI-Powered Digital Services in Nigeria`,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: dynamicKeywords.length > 0 ? dynamicKeywords : defaultKeywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    authors: [{ name: "NovaX Digital Centre", url: baseUrl }],
    creator: "NovaX Digital Centre",
    publisher: "NovaX Digital Centre",
    category: "Technology, Digital Services",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: baseUrl,
      siteName: siteName,
      title: `${siteName} — AI-Powered Digital Services in Nigeria`,
      description: siteDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} — AI-Powered Digital Services`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — AI-Powered Digital Services in Nigeria`,
      description: siteDescription,
      images: [ogImage],
      creator: "@novaxdigital",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteName,
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const settingsList = await prisma.siteSettings.findMany({
    where: { key: { in: ["pwaThemeColor", "brandPrimary"] } }
  });
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    themeColor: settings.pwaThemeColor || settings.brandPrimary || "#6C47FF",
  };
}

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://novaxdigitalcentre.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": baseUrl,
    name: settings.siteName || "NovaX Digital Centre",
    description: settings.siteDescription || "AI-powered digital computer centre delivering professional typing, NIN registration, academic help, AI tutoring and document services in Nigeria.",
    url: baseUrl,
    logo: settings.logoUrl || `${baseUrl}/favicon.png`,
    image: settings.logoUrl || `${baseUrl}/favicon.png`,
    telephone: settings.contactNumber || "",
    email: settings.supportEmail || "",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
      addressRegion: "Nigeria",
    },
    sameAs: [baseUrl],
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "₦₦",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Services Catalogue",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Document Typing" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Academic Assignment Help" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "NIN Registration Assistance" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "CV and Resume Writing" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Document Summarization" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Data Entry and Excel" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Tutoring" } },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: brandStyles }} />
        {settings.googleSearchConsoleTag && (
           <div dangerouslySetInnerHTML={{ __html: settings.googleSearchConsoleTag }} />
        )}
        {settings.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
