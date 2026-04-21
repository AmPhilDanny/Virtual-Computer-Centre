import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FileText, Clock } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://novaxdigitalcentre.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const settingsList = await prisma.siteSettings.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteName = settings.siteName || "NovaX Digital Centre";
  const title = settings.seoBlogTitle || `Latest Updates & Insights | ${siteName}`;
  const description = settings.seoBlogDesc || "Insights, guides, and news from the NovaX Digital Centre team. Stay informed about the latest in digital services and AI technology.";
  const keywords = settings.seoBlogKeywords ? settings.seoBlogKeywords.split(",").map(k => k.trim()) : [
    "digital services blog", "AI technology updates", "NovaX center news",
    "academic writing tips", "government registration guides", "Nigeria digital hub",
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `${BASE}/blog` },
    openGraph: {
      title,
      description,
      url: `${BASE}/blog`,
      images: [{ url: `${BASE}/favicon.png`, width: 1200, height: 630, alt: "NovaX Digital Centre Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE}/favicon.png`],
    },
  };
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, icon: true } }
    }
  });

  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container" style={{ minHeight: "60vh" }}>
          <div className="section-header">
            <span className="eyebrow">Blog & News</span>
            <h1>Latest Updates</h1>
            <p>Insights, guides, and news from the AI Computer Centre team.</p>
          </div>

          {posts.length === 0 ? (
            <div className="p-20 text-center glass-card">
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>📖</div>
              <p className="text-secondary">Our first articles are being drafted. Check back soon!</p>
            </div>
          ) : (
            <div className="grid-3">
              {posts.map((post) => (
                <div key={post.id} className="glass-card flex-col gap-4 group hover:translate-y-[-4px] transition-transform">
                  <div style={{ 
                    height: "200px", 
                    background: "rgba(108, 71, 255, 0.05)", 
                    borderRadius: "var(--radius-md)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "3rem",
                    overflow: "hidden",
                    border: "1px solid var(--border-subtle)"
                  }}>
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                       <FileText size={48} className="text-muted" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="badge badge-primary flex items-center gap-1">
                      {post.category?.icon && <span>{post.category.icon}</span>}
                      {post.category?.name || "General"}
                    </span>
                    <div className="flex items-center gap-2 text-muted" style={{ fontSize: "0.75rem" }}>
                      <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", margin: 0, lineHeight: 1.4 }}>{post.title}</h3>
                  <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-secondary" style={{ fontSize: "0.8125rem", marginTop: "var(--space-2)" }}>
                    <User size={14} /> By {post.author.name}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="btn btn-ghost btn-sm group-hover:text-primary" style={{ alignSelf: "flex-start", marginTop: "var(--space-2)", padding: 0 }}>
                    Read Full Story <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
