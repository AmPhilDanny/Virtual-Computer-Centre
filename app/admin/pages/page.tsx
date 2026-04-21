"use client";

import { useState, useEffect } from "react";
import { 
  Menu, 
  Save, 
  Home, 
  Info, 
  ShieldCheck, 
  Scale, 
  RefreshCcw, 
  UserCheck, 
  Briefcase, 
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react";

type PageConfig = {
  id: string;
  label: string;
  icon: any;
  type: "hero" | "article";
  fields: { key: string; label: string; type: "text" | "textarea" | "rich" }[];
};

const PAGES: PageConfig[] = [
  {
    id: "homepage",
    label: "Homepage Hero",
    icon: Home,
    type: "hero",
    fields: [
      { key: "homeHeroBadge", label: "Small Badge Text", type: "text" },
      { key: "homeHeroTitle", label: "Main Headline", type: "text" },
      { key: "homeHeroSubtitle", label: "Subtext Description", type: "textarea" },
      { key: "homeHeroCta", label: "Primary Button Text", type: "text" },
    ]
  },
  {
    id: "about",
    label: "About Us",
    icon: Info,
    type: "article",
    fields: [
      { key: "pageContent_about", label: "Page Content", type: "rich" }
    ]
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: ShieldCheck,
    type: "article",
    fields: [
      { key: "pageContent_privacy", label: "Full Policy Text", type: "rich" }
    ]
  },
  {
    id: "terms",
    label: "Terms of Service",
    icon: Scale,
    type: "article",
    fields: [
      { key: "pageContent_terms", label: "Full Terms Text", type: "rich" }
    ]
  },
  {
    id: "refund",
    label: "Refund Policy",
    icon: RefreshCcw,
    type: "article",
    fields: [
      { key: "pageContent_refund", label: "Full Refund Policy Text", type: "rich" }
    ]
  },
  {
    id: "legal",
    label: "Legal Information",
    icon: Scale,
    type: "article",
    fields: [
      { key: "pageContent_legal", label: "Legal Disclaimer Text", type: "rich" }
    ]
  },
  {
    id: "careers",
    label: "Careers",
    icon: Briefcase,
    type: "article",
    fields: [
      { key: "pageContent_careers", label: "Work With Us Content", type: "rich" }
    ]
  },
  {
    id: "aiDisclosure",
    label: "AI Disclosure",
    icon: UserCheck,
    type: "article",
    fields: [
      { key: "pageContent_aiDisclosure", label: "AI Usage Disclosure", type: "rich" }
    ]
  }
];

export default function AdminPagesManager() {
  const [activePageId, setActivePageId] = useState(PAGES[0].id);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const activePage = PAGES.find(p => p.id === activePageId) || PAGES[0];

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) setSettings(await res.json());
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdate = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      // Only save fields relevant to current page to avoid huge payloads
      const payload: Record<string, string> = {};
      activePage.fields.forEach(f => {
        payload[f.key] = settings[f.key] || "";
      });

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-muted">Initializing Page Editor...</div>;

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-end">
        <div className="flex-col gap-1">
          <h2 className="flex items-center gap-2" style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            <Menu size={24} className="text-primary" /> Pages Manager
          </h2>
          <p className="text-secondary">Edit all static content and policy pages across the platform.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          {isSaving ? "Publishing..." : "Save Changes"}
        </button>
      </div>

      <div className="grid-sidebar gap-8">
        {/* Sidebar Navigation */}
        <div className="flex-col gap-1">
          {PAGES.map(page => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => {
                  setActivePageId(page.id);
                  setSaveStatus("idle");
                }}
                className={`flex items-center gap-3 w-100 text-left p-3 rounded-lg transition-all ${
                  activePageId === page.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'hover:bg-subtle text-secondary'
                }`}
                style={{ border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
              >
                <Icon size={18} />
                {page.label}
              </button>
            );
          })}
        </div>

        {/* Editor Area */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
          <div className="flex items-center justify-between border-b border-subtle pb-4">
            <h3 style={{ margin: 0 }}>{activePage.label}</h3>
            {activePage.type === "article" && (
              <div className="flex items-center gap-2 text-xs text-muted bg-subtle p-2 rounded-md">
                <Clock size={14} /> Live at: /p/{activePageId}
              </div>
            )}
          </div>

          <div className="flex-col gap-6">
            {activePage.fields.map(field => (
              <div key={field.key} className="form-group">
                <label className="form-label">{field.label}</label>
                {field.type === "text" ? (
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings[field.key] || ""} 
                    onChange={(e) => handleUpdate(field.key, e.target.value)}
                    placeholder={`Enter ${field.label}...`}
                  />
                ) : field.type === "textarea" ? (
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: "100px" }}
                    value={settings[field.key] || ""} 
                    onChange={(e) => handleUpdate(field.key, e.target.value)}
                    placeholder={`Enter ${field.label}...`}
                  />
                ) : (
                  <div className="flex-col gap-2">
                    <textarea 
                      className="form-input" 
                      style={{ minHeight: "400px", fontFamily: "monospace", fontSize: "0.8125rem", lineHeight: 1.6 }}
                      value={settings[field.key] || ""} 
                      onChange={(e) => handleUpdate(field.key, e.target.value)}
                      placeholder="Enter full page content (Markdown/HTML supported)..."
                    />
                    <div className="flex items-start gap-2 p-3 bg-subtle rounded-md border border-subtle" style={{ fontSize: "0.75rem" }}>
                      <AlertCircle size={14} className="text-secondary mt-0.5" />
                      <div>
                        <strong>Pro-tip:</strong> Use basic HTML tags for styling (e.g. <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>) or plain text. High quality typography is applied automatically.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {saveStatus === "success" && (
        <div className="fixed bottom-8 right-8 bg-success text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Save size={24} />
          <div className="flex-col">
            <div className="font-bold">Content Published</div>
            <div className="text-sm opacity-90">All changes are now live on the public site.</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .grid-sidebar {
          display: grid;
          grid-template-columns: 240px 1fr;
        }
        @media (max-width: 768px) {
          .grid-sidebar {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
