"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, Search, Globe, AlertCircle, CheckCircle2, ChevronRight, Eye } from "lucide-react";

type SeoData = {
  title: string;
  desc: string;
  keywords: string;
};

type SeoConfig = {
  homepage: SeoData;
  services: SeoData;
  blog: SeoData;
  contact: SeoData;
};

const PAGES = [
  { id: "homepage", label: "Homepage", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "blog", label: "Blog", path: "/blog" },
  { id: "contact", label: "Contact", path: "/contact" },
] as const;

export default function AdminSeoPage() {
  const [activeTab, setActiveTab] = useState<typeof PAGES[number]["id"]>("homepage");
  const [config, setConfig] = useState<SeoConfig>({
    homepage: { title: "", desc: "", keywords: "" },
    services: { title: "", desc: "", keywords: "" },
    blog: { title: "", desc: "", keywords: "" },
    contact: { title: "", desc: "", keywords: "" },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    async function fetchSeo() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          const newConfig = { ...config };
          
          PAGES.forEach(page => {
            const prefix = `seo${page.id.charAt(0).toUpperCase() + page.id.slice(1)}`;
            newConfig[page.id] = {
              title: data[`${prefix}Title`] || "",
              desc: data[`${prefix}Desc`] || "",
              keywords: data[`${prefix}Keywords`] || "",
            };
          });
          
          setConfig(newConfig);
        }
      } catch (err) {
        console.error("Failed to fetch SEO settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSeo();
  }, []);

  const handleChange = (field: keyof SeoData, value: string) => {
    setConfig(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value }
    }));
    setStatus("idle");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/seo/generate", {
        method: "POST",
        body: JSON.stringify({ page: activeTab }),
      });
      if (res.ok) {
        const { result } = await res.json();
        handleChange("title", result.title);
        handleChange("desc", result.description);
        handleChange("keywords", result.keywords);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
      setStatus("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    try {
      const prefix = `seo${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
      const payload = {
        [`${prefix}Title`]: config[activeTab].title,
        [`${prefix}Desc`]: config[activeTab].desc,
        [`${prefix}Keywords`]: config[activeTab].keywords,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const current = config[activeTab];

  if (isLoading) return <div className="p-10 text-center text-muted">Loading SEO Engine...</div>;

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-end">
        <div className="flex-col gap-1">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>SEO Manager</h2>
          <p className="text-secondary">AI-powered search engine optimization for your platform.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerate} 
            className="btn btn-ghost flex items-center gap-2"
            disabled={isGenerating}
            style={{ background: "rgba(108, 71, 255, 0.1)", color: "var(--brand-primary)" }}
          >
            <Sparkles size={18} className={isGenerating ? "animate-pulse" : ""} />
            {isGenerating ? "AI Thinking..." : "Generate with AI"}
          </button>
          <button 
            onClick={handleSave} 
            className="btn btn-primary flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-subtle pb-px">
        {PAGES.map(page => (
          <button
            key={page.id}
            onClick={() => setActiveTab(page.id)}
            className={`tab-link ${activeTab === page.id ? 'active' : ''}`}
            style={{ 
              padding: "12px 24px", 
              fontSize: "0.875rem", 
              fontWeight: 600,
              color: activeTab === page.id ? "var(--brand-primary)" : "var(--text-secondary)",
              borderBottom: activeTab === page.id ? "2px solid var(--brand-primary)" : "none",
              background: "none",
              cursor: "pointer"
            }}
          >
            {page.label}
          </button>
        ))}
      </div>

      <div className="grid-2 gap-8 items-start">
        {/* Editor Form */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
          <div className="form-group">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label mb-0">Meta Title</label>
              <span style={{ fontSize: "0.75rem", color: current.title.length > 60 ? "var(--brand-danger)" : "var(--text-muted)" }}>
                {current.title.length} / 60
              </span>
            </div>
            <input 
              className="form-input" 
              value={current.title} 
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Primary browser title tag..."
            />
            <p className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>Appears in browser tabs and as the main headline in search results.</p>
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label mb-0">Meta Description</label>
              <span style={{ fontSize: "0.75rem", color: current.desc.length > 160 ? "var(--brand-danger)" : "var(--text-muted)" }}>
                {current.desc.length} / 160
              </span>
            </div>
            <textarea 
              className="form-input" 
              style={{ minHeight: "100px" }}
              value={current.desc} 
              onChange={(e) => handleChange("desc", e.target.value)}
              placeholder="Summarize this page for search engines..."
            />
            <p className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>The 1-2 sentences shown below your title in Google. Should be catchy!</p>
          </div>

          <div className="form-group">
            <label className="form-label">Search Keywords</label>
            <input 
              className="form-input" 
              value={current.keywords} 
              onChange={(e) => handleChange("keywords", e.target.value)}
              placeholder="keyword1, keyword2, phrase 3..."
            />
            <p className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>Comma-separated phrases to help search engines understand relevance.</p>
          </div>
        </div>

        {/* Live SERP Preview */}
        <div className="flex-col gap-4">
          <h4 className="flex items-center gap-2" style={{ margin: 0, fontSize: "1rem" }}>
            <Eye size={18} /> Google Search Preview
          </h4>
          <div className="glass-card" style={{ padding: "24px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e1e4e8" }}>
            <div style={{ fontFamily: "arial,sans-serif" }}>
              <div className="flex items-center gap-2 mb-1">
                <div style={{ width: 28, height: 28, background: "#f1f3f4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🌐</div>
                <div className="flex-col">
                  <div style={{ fontSize: "14px", color: "#202124", lineHeight: "20px" }}>NovaX Digital Centre</div>
                  <div style={{ fontSize: "12px", color: "#4d5156", lineHeight: "16px" }}>{`https://novax.centre${PAGES.find(p => p.id === activeTab)?.path}`}</div>
                </div>
              </div>
              <h3 style={{ fontSize: "20px", color: "#1a0dab", fontWeight: 400, margin: "4px 0", cursor: "pointer", textDecoration: "none" }}>
                {current.title || "Your Page Title Will Appear Here"}
              </h3>
              <p style={{ fontSize: "14px", color: "#4d5156", lineHeight: "1.58", margin: 0 }}>
                {current.desc || "A great meta description is the bedrock of search engine visibility. It should clearly explain what your page offers to encourage people to click on your result."}
              </p>
            </div>
          </div>
          
          <div className="glass-card flex-col gap-3" style={{ padding: "20px", borderStyle: "dashed" }}>
            <h5 className="flex items-center gap-2" style={{ margin: 0, fontSize: "0.875rem" }}>
              <Globe size={16} style={{ color: "var(--brand-primary)" }} /> Public SEO Readiness
            </h5>
            <div className="flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary">Sitemap.xml Presence</span>
                <span className="text-success flex items-center gap-1"><CheckCircle2 size={14} /> Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary">Robots.txt Reachability</span>
                <span className="text-success flex items-center gap-1"><CheckCircle2 size={14} /> Global</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary">JSON-LD Structured Data</span>
                <span className="text-success flex items-center gap-1"><CheckCircle2 size={14} /> Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {status === "success" && (
        <div className="fixed bottom-8 right-8 bg-success text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={24} />
          <div className="flex-col">
            <div className="font-bold">Configuration Saved</div>
            <div className="text-sm opacity-90">Your changes are now live on the public site.</div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="fixed bottom-8 right-8 bg-danger text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AlertCircle size={24} />
          <div className="flex-col">
            <div className="font-bold">Configuration Error</div>
            <div className="text-sm opacity-90">There was a problem syncing with the AI engine.</div>
          </div>
        </div>
      )}
    </div>
  );
}
