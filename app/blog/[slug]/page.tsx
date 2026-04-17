import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import CommentSection from "@/components/blog/CommentSection";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: slug },
  });

  if (!post) return {};

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    openGraph: {
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: slug },
    include: {
      author: { select: { name: true, image: true } },
      category: true,
      comments: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="section" style={{ paddingTop: "120px" }}>
        <article className="container-sm">
          <Link href="/blog" className="btn btn-ghost btn-sm mb-8 flex items-center gap-2" style={{ paddingLeft: 0 }}>
            <ArrowLeft size={16} /> Back to Articles
          </Link>

          <header className="flex-col gap-6 mb-12">
            <div className="flex items-center gap-3">
               <span className="badge badge-primary">{post.category?.name || "General"}</span>
               <div className="flex items-center gap-4 text-muted text-sm">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
            
            <h1 style={{ fontSize: "3rem", lineHeight: 1.1, margin: 0 }}>{post.title}</h1>
            
            <p className="text-secondary" style={{ fontSize: "1.25rem", borderLeft: "4px solid var(--brand-primary)", paddingLeft: "var(--space-6)" }}>
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 py-4 border-y border-subtle">
               <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                 {post.author.name.charAt(0)}
               </div>
               <div className="flex-col">
                  <div className="font-bold text-sm">By {post.author.name}</div>
                  <div className="text-secondary text-xs">AI Computer Centre Specialist</div>
               </div>
            </div>
          </header>

          {post.coverImage && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <img src={post.coverImage} alt="" style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} />
            </div>
          )}

          <div 
            className="prose-container mb-24" 
            style={{ 
              fontSize: "1.125rem", 
              lineHeight: 1.8, 
              color: "var(--text-primary)"
            }}
          >
            {/* Simple Markdown-to-HTML conversion for now */}
            <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n\n/g, '<p style="margin-bottom: 2rem"></p>').replace(/\n/g, '<br/>') || "" }} />
          </div>

          <hr className="mb-12 border-subtle" />

          {/* Comment Section Component */}
          <CommentSection postId={post.id} initialComments={post.comments} />
          
        </article>
      </main>
      <Footer />
    </>
  );
}
