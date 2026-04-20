"use client";

import { useState, useEffect } from "react";
import { Database, CheckCircle2, Cpu } from "lucide-react";

export default function AdminAIPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    geminiApiKey: "",
    geminiModel: "gemini-1.5-pro-latest",
    groqApiKey: "",
    groqModel: "llama-3.3-70b-versatile",
    mistralApiKey: "",
    mistralModel: "mistral-large-latest",
    togetherApiKey: "",
    togetherModel: "meta-llama/Llama-Vision-Free",
    openRouterApiKey: "",
    openRouterModel: "google/gemini-1.5-pro",
    activeAiProvider: "google",
    aiAutonomy: "AI_PLUS_HUMAN",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          formData.append(key, value);
        }
      });

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data.updates }));
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid-2" style={{ gap: "var(--space-8)" }}>
      <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
        <h3 className="flex items-center gap-2" style={{ fontSize: "1.25rem", margin: 0 }}>
           <Cpu size={20} /> AI Providers Configuration
        </h3>
        <p className="text-secondary">Configure the intelligence engine powers internal and external automations.</p>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
            <div className="form-group">
              <label className="form-label">Active AI Provider</label>
              <select 
                name="activeAiProvider" 
                className="form-select" 
                value={settings.activeAiProvider || "google"}
                onChange={handleChange}
                style={{ border: "2px solid var(--brand-primary)" }}
              >
                <option value="google">Google Gemini (Default)</option>
                <option value="groq">Groq (Llama 3 / Mixtral)</option>
                <option value="mistral">Mistral AI</option>
                <option value="togetherai">Together AI (Llama Vision)</option>
                <option value="openrouter">OpenRouter Serverless</option>
              </select>
            </div>

            <div className="flex-col gap-6" style={{ background: "var(--bg-subtle)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
              {/* Google Gemini */}
              <div className="form-group">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label" style={{ margin: 0 }}>Google Gemini Config</label>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={async () => {
                      const res = await fetch("/api/admin/ai/status", { 
                        method: "POST",
                        body: JSON.stringify({ provider: 'google', apiKey: settings.geminiApiKey, model: settings.geminiModel })
                      });
                      const data = await res.json();
                      alert(data.message);
                    }}
                  >Check Status</button>
                </div>
                <div className="grid-2 gap-4">
                  <input 
                    type="password" 
                    name="geminiApiKey"
                    className="form-input" 
                    placeholder="Gemini API Key..."
                    value={settings.geminiApiKey || ""} 
                    onChange={handleChange}
                  />
                  <select 
                    name="geminiModel" 
                    className="form-select" 
                    value={settings.geminiModel || "gemini-1.5-pro-latest"}
                    onChange={handleChange}
                  >
                    <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
                    <option value="gemini-2.0-pro-exp">Gemini 2.0 Pro</option>
                    <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash</option>
                  </select>
                </div>
              </div>

              {/* Groq */}
              <div className="form-group">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label" style={{ margin: 0 }}>Groq Configuration</label>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={async () => {
                      const res = await fetch("/api/admin/ai/status", { 
                        method: "POST",
                        body: JSON.stringify({ provider: 'groq', apiKey: settings.groqApiKey, model: settings.groqModel })
                      });
                      const data = await res.json();
                      alert(data.message);
                    }}
                  >Check Status</button>
                </div>
                <div className="grid-2 gap-4">
                  <input 
                    type="password" 
                    name="groqApiKey"
                    className="form-input" 
                    placeholder="Groq API Key..."
                    value={settings.groqApiKey || ""} 
                    onChange={handleChange}
                  />
                  <select 
                    name="groqModel" 
                    className="form-select" 
                    value={settings.groqModel || "llama-3.3-70b-versatile"}
                    onChange={handleChange}
                  >
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
                    <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                  </select>
                </div>
              </div>

               {/* Mistral */}
               <div className="form-group">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label" style={{ margin: 0 }}>Mistral AI Configuration</label>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={async () => {
                      const res = await fetch("/api/admin/ai/status", { 
                        method: "POST",
                        body: JSON.stringify({ provider: 'mistral', apiKey: settings.mistralApiKey, model: settings.mistralModel })
                      });
                      const data = await res.json();
                      alert(data.message);
                    }}
                  >Check Status</button>
                </div>
                <div className="grid-2 gap-4">
                  <input 
                    type="password" 
                    name="mistralApiKey"
                    className="form-input" 
                    placeholder="Mistral API Key..."
                    value={settings.mistralApiKey || ""} 
                    onChange={handleChange}
                  />
                  <select 
                    name="mistralModel" 
                    className="form-select" 
                    value={settings.mistralModel || "mistral-large-latest"}
                    onChange={handleChange}
                  >
                    <option value="mistral-large-latest">Mistral Large</option>
                    <option value="pixtral-12b-2409">Pixtral 12B</option>
                  </select>
                </div>
              </div>
              
               {/* Together AI */}
               <div className="form-group">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label" style={{ margin: 0 }}>Together AI Configuration</label>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={async () => {
                      const res = await fetch("/api/admin/ai/status", { 
                        method: "POST",
                        body: JSON.stringify({ provider: 'togetherai', apiKey: settings.togetherApiKey, model: settings.togetherModel })
                      });
                      const data = await res.json();
                      alert(data.message);
                    }}
                  >Check Status</button>
                </div>
                <div className="grid-2 gap-4">
                  <input 
                    type="password" 
                    name="togetherApiKey"
                    className="form-input" 
                    placeholder="Together API Key..."
                    value={settings.togetherApiKey || ""} 
                    onChange={handleChange}
                  />
                   <input 
                    type="text" 
                    name="togetherModel"
                    className="form-input" 
                    placeholder="meta-llama/Llama-Vision-Free..."
                    value={settings.togetherModel || ""} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* OpenRouter */}
              <div className="form-group">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label" style={{ margin: 0 }}>OpenRouter Configuration</label>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={async () => {
                      const res = await fetch("/api/admin/ai/status", { 
                        method: "POST",
                        body: JSON.stringify({ provider: 'openrouter', apiKey: settings.openRouterApiKey, model: settings.openRouterModel })
                      });
                      const data = await res.json();
                      alert(data.message);
                    }}
                  >Check Status</button>
                </div>
                <div className="grid-2 gap-4">
                  <input 
                    type="password" 
                    name="openRouterApiKey"
                    className="form-input" 
                    placeholder="OpenRouter API Key..."
                    value={settings.openRouterApiKey || ""} 
                    onChange={handleChange}
                  />
                   <input 
                    type="text" 
                    name="openRouterModel"
                    className="form-input" 
                    placeholder="google/gemini-1.5-pro..."
                    value={settings.openRouterModel || ""} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Global AI Autonomy</label>
              <select 
                name="aiAutonomy" 
                className="form-select" 
                value={settings.aiAutonomy}
                onChange={handleChange}
              >
                  <option value="AI_ONLY">AI Only (Automatic Workflow)</option>
                  <option value="AI_PLUS_HUMAN">AI + Human Review (Suggested)</option>
                  <option value="HUMAN_ONLY">Human Only (Disabled)</option>
              </select>
            </div>

           <div className="flex items-center gap-4 pt-4">
             <button type="submit" className="btn btn-primary btn-md" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save AI Credentials"}
             </button>
             {saveStatus === "success" && (
               <span className="flex items-center gap-1 text-success" style={{ fontSize: "0.875rem" }}>
                 <CheckCircle2 size={16} /> Saved!
               </span>
             )}
           </div>
        </form>
      </div>

      <div className="flex-col gap-8">
        {/* Placeholder widget for right column */}
        <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Database size={18} style={{ color: "var(--brand-primary)" }} /> Context Health
           </h4>
           <div className="flex justify-between items-center">
              <span className="text-secondary">RAG Datasets Connected:</span>
              <span className="badge badge-success">Online</span>
           </div>
           <div className="text-xs text-muted leading-relaxed">
             This centre provides up-to-date context injection via attached global datasets. Check "Services Catalog" to append specific prompts.
           </div>
        </div>
      </div>
    </div>
  );
}
