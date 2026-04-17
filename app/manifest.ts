import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Fetch settings from DB
  const settingsList = await prisma.siteSettings.findMany({
    where: {
      key: {
        in: ["pwaName", "pwaSplashColor", "siteName", "brandPrimary"]
      }
    }
  });

  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const name = settings.pwaName || settings.siteName || "Virtual Computer Centre";
  const splashColor = settings.pwaSplashColor || settings.brandPrimary || "#6366f1";

  return {
    name: name,
    short_name: name.split(" ")[0],
    description: "Premium AI-powered digital services and training centre.",
    start_url: "/",
    display: "standalone",
    background_color: splashColor,
    theme_color: settings.brandPrimary || "#6366f1",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "portrait",
  };
}
