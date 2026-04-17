"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2,
  Calendar,
  User,
  CheckCircle,
  Clock
} from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/blog/posts");
      if (res.ok) setPosts(await res.json());
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`, { method: "DELETE" });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="flex items-center gap-2" style={{ margin: 0 }}>
            <FileText size={24} className="text-primary" /> Blog Management
          </h2>
          <p className="text-secondary">Create and publish articles to boost SEO and engage your audience.</p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-primary flex items-center gap-2 shadow-lg">
          <Plus size={18} /> New Article
        </Link>
      </div>

      <div className="glass-card" style={{ padding: "var(--space-6)" }}>
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="form-input" 
              style={{ paddingLeft: "var(--space-10)" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost border border-subtle flex items-center gap-2">
            <Filter size={18} /> Filter
          </button>
        </div>

        {isLoading ? (
          <div className="p-20 text-center animate-pulse">Loading blog feed...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-muted opacity-30 mb-4" style={{ fontSize: "4rem" }}>✍️</div>
            <p className="text-secondary">No articles found. Start writing your first masterpiece!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Author</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <div style={{ 
                          width: "48px", 
                          height: "48px", 
                          background: "var(--bg-subtle)", 
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden"
                        }}>
                          {post.coverImage ? (
                            <img src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <FileText size={20} className="text-muted" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold">{post.title}</div>
                          <div className="text-xs text-muted">/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${post.isPublished ? 'badge-success' : 'badge-warning'}`}>
                        {post.isPublished ? (
                          <span className="flex items-center gap-1"><CheckCircle size={12} /> Published</span>
                        ) : (
                          <span className="flex items-center gap-1"><Clock size={12} /> Draft</span>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <User size={14} /> {post.author.name}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="flex justify-end gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank" className="btn btn-ghost btn-sm p-2" title="Preview">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/blog/${post.id}/edit`} className="btn btn-ghost btn-sm p-2" title="Edit">
                          <Edit3 size={16} />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="btn btn-ghost btn-sm p-2 text-danger" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
