"use client";

import { useRouter } from "next/navigation";
import BlogPostEditor from "../../new/BlogPostEditor";
import { useState, useEffect } from "react";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/blog/posts/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data.post);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        router.push("/admin/blog");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-secondary font-bold">Loading Post Editor...</div>;
  if (!post) return <div className="p-8 text-center text-danger font-bold">Post not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <BlogPostEditor 
        initialData={post} 
        onSave={handleSave} 
        onCancel={() => router.push("/admin/blog")}
        loading={saving}
      />
    </div>
  );
}
