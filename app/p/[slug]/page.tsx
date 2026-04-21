import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const PAGE_MAP: Record<string, { title: string; key: string }> = {
  about: { title: "About Us", key: "pageContent_about" },
  privacy: { title: "Privacy Policy", key: "pageContent_privacy" },
  terms: { title: "Terms of Service", key: "pageContent_terms" },
  refund: { title: "Refund Policy", key: "pageContent_refund" },
  legal: { title: "Legal Information", key: "pageContent_legal" },
  careers: { title: "Careers", key: "pageContent_careers" },
  ai: { title: "AI Disclosure", key: "pageContent_aiDisclosure" },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = PAGE_MAP[params.slug];
  if (!page) return { title: "Page Not Found" };
  
  return {
    title: `${page.title} | NovaX Digital Centre`,
    description: `Official ${page.title} for NovaX Digital Centre - Nigeria's premier AI-powered digital services platform.`,
  };
}

export default async function DynamicPolicyPage({ params }: { params: { slug: string } }) {
  const page = PAGE_MAP[params.slug];
  if (!page) notFound();

  const settingsList = await prisma.siteSettings.findMany({
    where: { key: page.key }
  });
  
  const content = settingsList[0]?.value || "";

  return (
    <>
      <Navbar />
      <main className="section" style={{ minHeight: "80vh", pt: "var(--space-20)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="flex-col gap-2 mb-12">
            <span className="eyebrow">Official Document</span>
            <h1 style={{ fontSize: "2.5rem" }}>{page.title}</h1>
            <div 
              style={{ 
                width: "40px", 
                height: "4px", 
                background: "var(--brand-primary)", 
                borderRadius: "2px" 
              }} 
            />
          </div>

          {!content ? (
            <div className="glass-card p-12 text-center flex-col items-center gap-4">
              <div style={{ fontSize: "3rem" }}>🏗️</div>
              <h3 style={{ margin: 0 }}>Under Construction</h3>
              <p className="text-secondary">This page is currently being drafted by our legal and admin team. Please check back later.</p>
            </div>
          ) : (
            <div 
              className="rich-text-content"
              style={{ 
                lineHeight: 1.8, 
                fontSize: "1.0625rem", 
                color: "var(--text-primary)" 
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          <div style={{ marginTop: "var(--space-12)", borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-8)" }}>
            <p className="text-muted text-xs">
              Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}. 
              Contact support@novaxcentre.com for questions regarding this document.
            </p>
          </div>
        </div>
      </main>
      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .rich-text-content h2 { font-size: 1.5rem; margin: 2rem 0 1rem; }
        .rich-text-content h3 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
        .rich-text-content p { margin-bottom: 1.25rem; }
        .rich-text-content ul, .rich-text-content ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
        .rich-text-content li { margin-bottom: 0.5rem; }
      `}} />
    </>
  );
}
