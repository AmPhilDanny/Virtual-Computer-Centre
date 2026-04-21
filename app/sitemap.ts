import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://novaxdigitalcentre.vercel.app";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
  { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/auth/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/auth/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  // Individual service pages
  { url: `${BASE}/services/document-typing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE}/services/assignment-writing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE}/services/cv-resume-writing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE}/services/nin-assistance`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE}/services/document-summarization`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE}/services/data-entry`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE}/services/transcription`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE}/services/ngo-grant-application`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch published blog posts dynamically
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    blogEntries = posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {
    // Silently skip if DB unavailable during build
  }

  return [...staticRoutes, ...blogEntries];
}
