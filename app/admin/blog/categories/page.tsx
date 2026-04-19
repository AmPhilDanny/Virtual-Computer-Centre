"use client";

import { useState, useEffect } from "react";
import { FolderTree, Plus, Trash2, Tag, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: {
    posts: number;
  };
}

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [createError, setCreateError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/blog/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, icon: newIcon || null }),
      });

      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      setNewName("");
      setNewIcon("");
      fetchCategories();
    } catch (error: any) {
      setCreateError(error.message || "Failed to create category.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string, postCount: number) => {
    if (postCount > 0) {
      alert("Cannot delete a category that has associated posts. Reassign or delete the posts first.");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/blog/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete.");
      }
    } catch (error) {
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2" style={{ fontSize: "1.75rem", margin: 0 }}>
            <FolderTree size={28} className="text-primary" /> Category Management
          </h2>
          <p className="text-secondary" style={{ marginTop: "var(--space-2)" }}>
            Create and organize categories for the blog.
          </p>
        </div>
        <Link href="/admin/blog" className="btn btn-secondary btn-sm">
          ← Back to Blog
        </Link>
      </div>

      <div className="grid-2 gap-8">
        {/* Creation Form */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-6)" }}>
          <h3 className="flex items-center gap-2" style={{ margin: 0, fontSize: "1.25rem" }}>
            <Plus size={18} /> Add New Category
          </h3>
          <form onSubmit={handleCreate} className="flex-col gap-4">
            {createError && (
              <div className="bg-danger-subtle text-danger" style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", display: "flex", gap: "8px" }}>
                <AlertTriangle size={16} /> {createError}
              </div>
            )}
            <div className="form-group">
              <label className="form-label text-sm font-semibold">Category Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Artificial Intelligence"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label text-sm font-semibold">Icon (Emoji)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 🤖 (Optional)"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                maxLength={2}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreating || !newName.trim()}
              style={{ marginTop: "var(--space-2)" }}
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : "Create Category"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="glass-card" style={{ padding: "var(--space-6)" }}>
          <h3 className="flex items-center gap-2" style={{ margin: 0, fontSize: "1.25rem", marginBottom: "var(--space-6)" }}>
            <Tag size={18} /> Existing Categories
          </h3>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center p-8 text-secondary border border-dashed border-subtle rounded-xl">
              No categories exist yet.
            </div>
          ) : (
            <div className="flex-col gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "1.25rem" }}>{cat.icon || "📁"}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{cat.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        /{cat.slug} • {cat._count.posts} posts
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat._count.posts)}
                    className="btn btn-ghost btn-xs text-danger hover:bg-danger-subtle"
                    title={cat._count.posts > 0 ? "Cannot delete category with posts" : "Delete category"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
