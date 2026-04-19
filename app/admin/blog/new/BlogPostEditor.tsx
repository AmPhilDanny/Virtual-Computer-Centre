"use client";

import { useState } from "react";
import { 
  Bold, Italic, List, ListOrdered, Link, 
  Image as ImageIcon, Eye, Code, Save, X 
} from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface BlogPostEditorProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    category: string;
    image: string;
  };
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function BlogPostEditor({ initialData, onSave, onCancel, loading }: BlogPostEditorProps) {
  const [data, setData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    categoryId: initialData?.category || "",
    image: initialData?.image || ""
  });

  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [view, setView] = useState<"edit" | "preview">("edit");

  useState(() => {
    fetch("/api/admin/blog/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0 && !initialData?.category) {
          setData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      });
  });

  const getCleanPreview = () => {
    if (!data.content) return "";
    const rawHtml = marked.parse(data.content) as string;
    return DOMPurify.sanitize(rawHtml);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("post-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setData({ ...data, content: newValue });
    
    // Reset focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

  return (
    <div className="flex-col gap-6 bg-glass p-8 rounded-3xl border border-subtle shadow-2xl">
      <div className="flex justify-between items-center pb-6 border-b border-subtle">
        <h2 className="text-2xl font-black tracking-tight">Post Composer</h2>
        <div className="flex gap-2 bg-subtle p-1 rounded-xl">
          <button 
            onClick={() => setView("edit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'edit' ? 'bg-primary text-white shadow-lg' : 'hover:bg-glass'}`}
          >
            <Code size={16} /> Write
          </button>
          <button 
            onClick={() => setView("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'preview' ? 'bg-primary text-white shadow-lg' : 'hover:bg-glass'}`}
          >
            <Eye size={16} /> Preview
          </button>
        </div>
      </div>

      <div className="grid-2 gap-8">
        <div className="form-group">
          <label className="form-label">Post Title</label>
          <input 
            type="text" 
            name="title"
            className="form-input text-lg font-bold" 
            placeholder="Enter a catchy title..."
            value={data.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select 
            name="categoryId"
            className="form-select" 
            value={data.categoryId}
            onChange={handleChange}
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Summary / Excerpt</label>
        <textarea 
          name="excerpt"
          className="form-textarea h-20" 
          placeholder="A brief summary for the feed..."
          value={data.excerpt}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Cover Image URL</label>
        <input 
          type="text" 
          name="image"
          className="form-input font-mono text-xs" 
          placeholder="https://..."
          value={data.image}
          onChange={handleChange}
        />
      </div>

      <div className="form-group flex-col flex-1 min-h-[400px]">
        <label className="form-label flex justify-between">
          Content (Markdown Supported)
          {view === 'edit' && (
            <div className="flex gap-1">
              <button type="button" onClick={() => insertText("**", "**")} className="p-1 hover:bg-subtle rounded" title="Bold"><Bold size={14} /></button>
              <button type="button" onClick={() => insertText("*", "*")} className="p-1 hover:bg-subtle rounded" title="Italic"><Italic size={14} /></button>
              <button type="button" onClick={() => insertText("\n- ")} className="p-1 hover:bg-subtle rounded" title="List"><List size={14} /></button>
              <button type="button" onClick={() => insertText("\n1. ")} className="p-1 hover:bg-subtle rounded" title="Ordered List"><ListOrdered size={14} /></button>
              <button type="button" onClick={() => insertText("[", "](url)")} className="p-1 hover:bg-subtle rounded" title="Link"><Link size={14} /></button>
              <button type="button" onClick={() => insertText("![Alt text](", ")")} className="p-1 hover:bg-subtle rounded" title="Image"><ImageIcon size={14} /></button>
            </div>
          )}
        </label>
        
        {view === "edit" ? (
          <textarea 
            id="post-content"
            name="content"
            className="form-textarea flex-1 font-mono text-sm leading-relaxed p-6 bg-glass/50" 
            placeholder="Start writing your story..."
            value={data.content}
            onChange={handleChange}
            style={{ minHeight: "400px" }}
          />
        ) : (
          <div className="flex-1 p-8 bg-white text-black rounded-2xl overflow-auto dark:bg-zinc-900 dark:text-gray-100" style={{ minHeight: "400px" }}>
             <div 
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: getCleanPreview() || "<p class='text-gray-400 italic'>No content to preview.</p>" }}
             />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-subtle">
        <button 
          type="button" 
          className="btn btn-ghost flex items-center gap-2"
          onClick={onCancel}
        >
          <X size={18} /> Discard
        </button>
        <button 
          type="button" 
          className="btn btn-primary flex items-center gap-2 px-8 shadow-xl"
          onClick={() => onSave(data)}
          disabled={loading || !data.title || !data.content}
        >
          <Save size={18} /> {loading ? "Saving..." : "Publish Post"}
        </button>
      </div>
    </div>
  );
}
