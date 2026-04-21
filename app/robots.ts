import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://novaxdigitalcentre.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/blog", "/contact", "/auth/login", "/auth/register"],
        disallow: ["/admin/", "/dashboard/", "/vendor/", "/api/", "/pitch/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
