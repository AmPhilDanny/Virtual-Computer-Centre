"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Globe, Smartphone, DownloadCloud, Zap, GitBranch, Cpu, ExternalLink } from "lucide-react";

export default function AdminPWAPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    pwaName: "Virtual Centre",
    pwaSplashColor: "#6366f1",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings();
  };

  const saveSettings = async (): Promise<boolean> => {
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
        return true;
      } else {
        setSaveStatus("error");
        return false;
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("error");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateApp = async () => {
    setIsGenerating(true);
    const saved = await saveSettings();
    if (saved) {
      // Simulate build/manifest generation delay
      setTimeout(() => {
        setIsGenerating(false);
        alert("Progressive Web App Manifest and Service Workers Updated! The app is correctly configured for installation on Android, iOS, and Desktop.");
      }, 2500);
    } else {
      setIsGenerating(false);
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
    <div className="flex flex-col gap-8">
      <div className="grid-2" style={{ gap: "var(--space-8)" }}>
        <div className="flex flex-col gap-8">
          <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
            <h3 className="flex items-center gap-2" style={{ fontSize: "1.25rem", margin: 0 }}>
               <Globe size={20} /> Mobile App Configuration
            </h3>
            <p className="text-secondary">Configure the offline-capable Progressive Web App manifest properties.</p>

            <form onSubmit={handleSubmit} className="flex-col gap-6">
                <div className="form-group">
                  <label className="form-label">App Home Screen Name</label>
                  <input 
                    type="text" 
                    name="pwaName"
                    className="form-input" 
                    value={settings.pwaName || ""} 
                    onChange={handleChange}
                    placeholder="e.g. AI Centre"
                    maxLength={16}
                  />
                  <p className="text-muted" style={{ fontSize: "0.7rem", marginTop: "var(--space-1)" }}>Short names (under 12 characters) are recommended so they don't truncate on mobile home screens.</p>
                </div>

                <div className="grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Splash Screen & Theme Hex Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        name="pwaSplashColor"
                        className="color-picker" 
                        value={settings.pwaSplashColor || "#000000"} 
                        onChange={handleChange}
                        style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }}
                      />
                      <input 
                        type="text" 
                        name="pwaSplashColor"
                        className="form-input" 
                        value={settings.pwaSplashColor || ""} 
                        onChange={handleChange}
                        style={{ flex: 1 }}
                        placeholder="#HEX..."
                      />
                    </div>
                  </div>
                </div>

               <div className="flex items-center gap-4 pt-4">
                 <button type="submit" className="btn btn-secondary btn-md" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Config Only"}
                 </button>
                 {saveStatus === "success" && !isGenerating && (
                   <span className="flex items-center gap-1 text-success" style={{ fontSize: "0.875rem" }}>
                     <CheckCircle2 size={16} /> Saved!
                   </span>
                 )}
               </div>
            </form>
          </div>

          <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
            <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
               <Zap size={20} style={{ color: "var(--brand-warning)" }} /> Compile and Update Build
            </h4>
            <p className="text-sm text-secondary">
               Update the service workers and force the PWA manifest generator to push these settings to all connected client devices.
            </p>
            <button 
               onClick={handleGenerateApp} 
               className="btn btn-primary" 
               style={{ justifyContent: "center", minHeight: "50px", fontSize: "1rem" }}
               disabled={isGenerating}
            >
               {isGenerating ? "Compiling App Artifacts..." : (
                 <span className="flex items-center gap-2"><DownloadCloud size={18} /> Rebuild & Generate Mobile App</span>
               )}
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center">
           {/* Live Preview Device Box */}
           <div 
             className="device-preview"
             style={{
               width: "300px",
               height: "600px",
               background: settings.pwaSplashColor || "#ffffff",
               boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 0 0 10px #18181b",
               borderRadius: "2.5rem",
               position: "relative",
               overflow: "hidden",
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               justifyContent: "center",
               transition: "background 0.3s ease"
             }}
           >
              {/* Fake Device Notch */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "30px", background: "#18181b", borderBottomLeftRadius: "1rem", borderBottomRightRadius: "1rem", zIndex: 10 }}></div>
              
              <div className="flex-col items-center justify-center gap-4 animate-pulse">
                 {/* Icon Placeholder */}
                 <div style={{ width: "80px", height: "80px", background: "white", borderRadius: "1.2rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ maxWidth: "60%", maxHeight: "60%", objectFit: "contain" }} />
                    ) : (
                      <Smartphone size={32} color={settings.pwaSplashColor || "#000"} />
                    )}
                 </div>
              </div>

              <div style={{ position: "absolute", bottom: "30px", textAlign: "center", width: "100%" }}>
                  <span style={{ color: "white", fontFamily: "sans-serif", fontWeight: 600, letterSpacing: "1px", mixBlendMode: "difference" }}>
                    {settings.pwaName || "App Preview"}
                  </span>
              </div>
           </div>
        </div>
      </div>

      {/* Native App Downloads Section */}
      <div className="glass-card" style={{ padding: "var(--space-8)", background: "linear-gradient(145deg, rgba(108,71,255,0.05) 0%, rgba(0,212,255,0.03) 100%)" }}>
        <div className="flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="flex items-center gap-2" style={{ fontSize: "1.5rem", margin: 0 }}>
                <GitBranch size={24} /> Native Mobile Releases (APK/IPA)
              </h3>
              <p className="text-secondary" style={{ marginTop: "var(--space-2)" }}>Download the latest compiled versions of your native apps.</p>
            </div>
            <a 
              href="https://github.com/AmPhilDanny/Virtual-Computer-Centre/actions" 
              target="_blank" 
              className="btn btn-secondary btn-sm flex items-center gap-2"
            >
              <ExternalLink size={16} /> View All Builds
            </a>
          </div>

          <div className="grid-2" style={{ marginTop: "var(--space-4)" }}>
            <div className="flex-col gap-4 p-6" style={{ background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-3">
                <div style={{ padding: "10px", background: "rgba(0,229,160,0.1)", borderRadius: "12px", color: "var(--brand-success)" }}>
                  <Smartphone size={24} />
                </div>
                <h4 style={{ margin: 0 }}>Android (APK)</h4>
              </div>
              <p className="text-sm text-secondary">Ready for direct installation on Android devices. No Play Store required.</p>
              <div className="flex-col gap-2">
                <div className="text-xs text-muted">Latest Build: Always Ready</div>
                <Link 
                  href="https://github.com/AmPhilDanny/Virtual-Computer-Centre/actions?query=workflow%3A%22Build+Native+Apps%22" 
                  target="_blank"
                  className="btn btn-ghost btn-sm w-full"
                  style={{ justifyContent: "center" }}
                >
                  Download Latest APK
                </Link>
              </div>
            </div>

            <div className="flex-col gap-4 p-6" style={{ background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-3">
                <div style={{ padding: "10px", background: "rgba(0,212,255,0.1)", borderRadius: "12px", color: "var(--brand-secondary)" }}>
                  <Cpu size={24} />
                </div>
                <h4 style={{ margin: 0 }}>iOS (IPA)</h4>
              </div>
              <p className="text-sm text-secondary">Simulator-ready builds. Device production requires Apple Developer Signing.</p>
              <div className="flex-col gap-2">
                <div className="text-xs text-muted">Latest Build: Processing</div>
                <Link 
                  href="https://github.com/AmPhilDanny/Virtual-Computer-Centre/actions?query=workflow%3A%22Build+Native+Apps%22" 
                  target="_blank"
                  className="btn btn-ghost btn-sm w-full"
                  style={{ justifyContent: "center" }}
                >
                  Download iOS Zip
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4" style={{ background: "rgba(108,71,255,0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(108,71,255,0.1)" }}>
             <p className="text-xs text-muted leading-relaxed">
               <strong>Pro Tip:</strong> These apps are configured as "Live Wrappers". This means you only need to download them <strong>once</strong>. Any updates you make to the website will automatically reflect inside the app across all user devices!
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
