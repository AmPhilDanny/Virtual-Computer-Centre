"use client";

import { useRouter } from "next/navigation";
import BlogPostEditor from "./BlogPostEditor";
import { useState } from "react";

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog/posts", {
        method: "POST",
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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <BlogPostEditor 
        onSave={handleSave} 
        onCancel={() => router.push("/admin/blog")}
        loading={saving}
      />
    </div>
  );
}
