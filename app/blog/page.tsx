import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Clock, User, ChevronRight } from "lucide-react";

const blogPosts = [
  {
    title: "How AI is Revolutionizing Document Typing",
    excerpt: "Discover how intelligent agents are speeding up data entry and manuscript typing processes by 90%.",
    date: "May 12, 2024",
    author: "AI Admin",
    category: "Technology",
  },
  {
    title: "Tips for Crafting a Winning Scholarship Application",
    excerpt: "Learn the secrets of successful applications and how our experts can help you stand out.",
    date: "June 05, 2024",
    author: "Career Coach",
    category: "Education",
  },
  {
    title: "Navigating Government Portals with Ease",
    excerpt: "A guide to using our NIN, JAMB, and NYSC assistance services for a stress-free experience.",
    date: "July 20, 2024",
    author: "Service Expert",
    category: "Guides",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Blog & News</span>
            <h1>Latest Updates</h1>
            <p>Insights, guides, and news from the AI Computer Centre team.</p>
          </div>

          <div className="grid-3">
            {blogPosts.map((post, idx) => (
              <div key={idx} className="glass-card flex-col gap-4">
                <div style={{ height: "180px", background: "rgba(108, 71, 255, 0.1)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
                   📝
                </div>
                <div className="flex justify-between items-center">
                   <span className="badge badge-primary">{post.category}</span>
                   <div className="flex items-center gap-2 text-muted" style={{ fontSize: "0.75rem" }}>
                      <Clock size={12} /> {post.date}
                   </div>
                </div>
                <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{post.title}</h3>
                <p style={{ fontSize: "0.875rem", margin: 0 }}>{post.excerpt}</p>
                <div className="flex items-center gap-2 text-secondary" style={{ fontSize: "0.875rem", marginTop: "var(--space-2)" }}>
                   <User size={14} /> {post.author}
                </div>
                <Link href="#" className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", marginTop: "var(--space-4)" }}>
                   Read More <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
