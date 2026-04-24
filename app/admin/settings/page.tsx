"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, Database, Globe, Bell, Palette, Upload, Image as ImageIcon, CheckCircle2, ShieldAlert, Store, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Share2, Link as LinkIcon, Facebook, Twitter, Linkedin, Instagram, MessageCircle, Save } from "lucide-react";

function LinkManager({ 
  links, 
  onChange, 
  title, 
  icon: Icon 
}: { 
  links: { label: string; href: string }[]; 
  onChange: (links: { label: string; href: string }[]) => void;
  title: string;
  icon: any;
}) {
  const addLink = () => onChange([...links, { label: "New Link", href: "/" }]);
  const removeLink = (index: number) => onChange(links.filter((_, i) => i !== index));
  const updateLink = (index: number, field: "label" | "href", value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };
  const moveLink = (index: number, direction: "up" | "down") => {
    const newLinks = [...links];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= links.length) return;
    [newLinks[index], newLinks[swapIndex]] = [newLinks[swapIndex], newLinks[index]];
    onChange(newLinks);
  };

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center">
        <h5 className="flex items-center gap-2" style={{ margin: 0, fontSize: "0.9rem" }}>
          <Icon size={16} className="text-primary" /> {title}
        </h5>
        <button type="button" onClick={addLink} className="btn btn-ghost btn-sm text-primary p-1">
          <Plus size={16} /> Add Link
        </button>
      </div>
      <div className="flex-col gap-2">
        {links.length === 0 && <p className="text-center text-xs text-muted py-4 border border-dashed rounded-lg">No links added.</p>}
        {links.map((link, i) => (
          <div key={i} className="flex gap-2 items-center bg-elevated p-2 rounded-lg border border-subtle">
            <div className="flex-col gap-0.5">
               <button type="button" onClick={() => moveLink(i, "up")} disabled={i === 0} className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-10 cursor-pointer"><ArrowUp size={12} /></button>
               <button type="button" onClick={() => moveLink(i, "down")} disabled={i === links.length - 1} className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-10 cursor-pointer"><ArrowDown size={12} /></button>
            </div>
            <input 
              className="form-input text-xs" style={{ padding: "6px 10px", flex: 1 }}
              value={link.label} onChange={(e) => updateLink(i, "label", e.target.value)} 
              placeholder="Label"
            />
            <input 
              className="form-input text-xs" style={{ padding: "6px 10px", flex: 1.5 }}
              value={link.href} onChange={(e) => updateLink(i, "href", e.target.value)} 
              placeholder="URL (/path or https://)"
            />
            <button type="button" onClick={() => removeLink(i)} className="text-danger p-1 opacity-60 hover:opacity-100 cursor-pointer">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    siteName: "AI Computer Centre",
    siteDescription: "AI-powered digital computer centre delivering online services.",
    supportEmail: "support@aicomputercentre.com",
    contactNumber: "+234 812 345 6789",
    brandPrimary: "#0070f3",
    brandSecondary: "#7928ca",
    brandAccent: "#ff0080",
    logoUrl: "",
    faviconUrl: "",
    geminiApiKey: "",
    geminiModel: "gemini-2.0-flash-exp",
    groqApiKey: "",
    groqModel: "llama-3.3-70b-versatile",
    mistralApiKey: "",
    mistralModel: "mistral-large-latest",
    togetherApiKey: "",
    togetherModel: "meta-llama/Llama-Vision-Free",
    fireworksApiKey: "",
    fireworksModel: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    openRouterApiKey: "",
    openRouterModel: "google/gemini-2.0-flash-001",
    activeAiProvider: "google",
    aiAutonomy: "AI_PLUS_HUMAN",
    resendApiKey: "",
    emailFromAddress: "onboarding@resend.dev",
    adminNotificationEmail: "",
    twilioSid: "",
    twilioToken: "",
    twilioFromNumber: "",
    JOB_CREATED_EMAIL_TEMPLATE: "",
    JOB_CREATED_WHAPP_TEMPLATE: "",
    STATUS_UPDATE_EMAIL_TEMPLATE: "",
    STATUS_UPDATE_WHAPP_TEMPLATE: "",
    AI_COMPLETED_EMAIL_TEMPLATE: "",
    AI_COMPLETED_WHAPP_TEMPLATE: "",
    pwaName: "Virtual Computer Centre",
    pwaSplashColor: "#6366f1",
    pwaThemeColor: "#6C47FF",
    pwaIconUrl: "",
    pwaSplashUrl: "",
    paystackSecretKey: "",
    flutterwaveSecretKey: "",
    virusScannerApiKey: "",
    walletFundingRate: "1", // 1 NGN = 1 Wallet Unit
    TUTOR_MONTHLY_PRICE: "5000",
    topNavLinks: JSON.stringify([
      { label: "Home", href: "/" },
      { label: "Services", href: "/#services" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ]),
    footerMenuLinks: JSON.stringify({
      Services: [
        { label: "Typing Services", href: "/services/document-typing" },
        { label: "Academic Help", href: "/services/assignment-writing" },
        { label: "NIN Assistance", href: "/services/nin-assistance" },
        { label: "CV & Resume", href: "/services/cv-resume-writing" },
        { label: "AI Summarizer", href: "/services/document-summarization" },
      ],
      Company: [
        { label: "About Us", href: "/p/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/p/careers" },
      ],
      Legal: [
        { label: "Privacy Policy", href: "/p/privacy" },
        { label: "Terms of Service", href: "/p/terms" },
        { label: "Refund Policy", href: "/p/refund" },
        { label: "AI Disclosure", href: "/p/ai" },
      ],
    }),
    footerCopyright: `© ${new Date().getFullYear()} NovaX Digital Centre. All rights reserved.`,
    footerBrandText: "Nigeria's #1 AI-powered digital computer centre. Professional services delivered by intelligent agents, reviewed by experts.",
    twitterUrl: "#",
    facebookUrl: "#",
    linkedinUrl: "#",
    instagramUrl: "#",
    whatsappUrl: "#",
  });


  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const pwaIconInputRef = useRef<HTMLInputElement>(null);
  const pwaSplashInputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      // Append files if they were selected
      if (logoInputRef.current?.files?.[0]) {
        formData.append("logoUrl", logoInputRef.current.files[0]);
      }
      if (faviconInputRef.current?.files?.[0]) {
        formData.append("faviconUrl", faviconInputRef.current.files[0]);
      }
      if (pwaIconInputRef.current?.files?.[0]) {
        formData.append("pwaIconUrl", pwaIconInputRef.current.files[0]);
      }
      if (pwaSplashInputRef.current?.files?.[0]) {
        formData.append("pwaSplashUrl", pwaSplashInputRef.current.files[0]);
      }

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
    <div className="flex-col gap-8">
      {/* Top Banner with Save button */}
      <div className="glass-card flex items-center justify-between p-4 sticky top-4 z-10" style={{ backdropFilter: "blur(20px)" }}>
         <div className="flex items-center gap-3">
           <div style={{ background: "var(--brand-primary)", color: "#fff", padding: "8px", borderRadius: "10px" }}>
             <Settings size={20} />
           </div>
           <div>
             <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Settings Hub</h2>
             <p className="text-xs text-muted" style={{ margin: 0 }}>Configure platform core, navigation, and branding.</p>
           </div>
         </div>
         <div className="flex items-center gap-4">
            {saveStatus === "success" && (
              <span className="flex items-center gap-1 text-success animate-in fade-in" style={{ fontSize: "0.875rem" }}>
                <CheckCircle2 size={16} /> Saved
              </span>
            )}
            <button 
              onClick={handleSubmit}
              className="btn btn-primary btn-md flex items-center gap-2" 
              disabled={isSaving}
            >
               {isSaving ? "Publishing..." : <><Save size={18} /> Save All Changes</>}
            </button>
         </div>
      </div>

      <div className="grid-2" style={{ gap: "var(--space-8)" }}>

      <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
        <h3 className="flex items-center gap-2" style={{ fontSize: "1.25rem", margin: 0 }}>
           <Settings size={20} /> System Configuration
        </h3>
        <p className="text-secondary">Configure global settings for the computer centre platform.</p>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
           <div className="form-group">
             <label className="form-label">Platform Name</label>
             <input 
               type="text" 
               name="siteName"
               className="form-input" 
               value={settings.siteName} 
               onChange={handleChange}
             />
           </div>
           <div className="form-group">
             <label className="form-label">Platform Description</label>
             <textarea 
               name="siteDescription"
               className="form-input" 
               style={{ minHeight: "80px" }}
               value={settings.siteDescription} 
               onChange={handleChange}
             />
           </div>
             <div className="grid-2 gap-4">
               <div className="form-group">
                 <label className="form-label">Support Email</label>
                 <input 
                   type="email" 
                   name="supportEmail"
                   className="form-input" 
                   value={settings.supportEmail} 
                   onChange={handleChange}
                 />
               </div>
               <div className="form-group">
                 <label className="form-label">Tutor Monthly Price (NGN)</label>
                 <input 
                   type="number" 
                   name="TUTOR_MONTHLY_PRICE"
                   className="form-input" 
                   value={settings.TUTOR_MONTHLY_PRICE || "5000"} 
                   onChange={handleChange}
                 />
               </div>
             </div>

           <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "var(--space-4) 0" }} />

           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Palette size={18} /> Branding & Visuals
           </h4>

           <div className="grid-2 gap-6">
              <div className="form-group">
                <label className="form-label">Logo</label>
                <div className="flex-col gap-3">
                  {settings.logoUrl && (
                    <div className="branding-preview" style={{ 
                      width: "120px", 
                      height: "60px", 
                      background: "var(--bg-subtle)", 
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      border: "1px solid var(--border-subtle)"
                    }}>
                      <img src={settings.logoUrl} alt="Logo Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={logoInputRef}
                      style={{ display: "none" }} 
                      accept="image/*"
                      onChange={() => setSaveStatus("idle")}
                    />
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-sm flex items-center gap-2"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload size={14} /> Upload Logo
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Favicon</label>
                <div className="flex-col gap-3">
                  {settings.faviconUrl && (
                    <div className="branding-preview" style={{ 
                      width: "32px", 
                      height: "32px", 
                      background: "var(--bg-subtle)", 
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      border: "1px solid var(--border-subtle)"
                    }}>
                      <img src={settings.faviconUrl} alt="Favicon Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={faviconInputRef}
                      style={{ display: "none" }} 
                      accept="image/x-icon,image/png,image/svg+xml"
                      onChange={() => setSaveStatus("idle")}
                    />
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-sm flex items-center gap-2"
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      <Upload size={14} /> Upload Favicon
                    </button>
                  </div>
                </div>
              </div>
           </div>

           <div className="grid-3 gap-4">
              <div className="form-group">
                <label className="form-label">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    name="brandPrimary"
                    className="color-picker" 
                    value={settings.brandPrimary} 
                    onChange={handleChange}
                    style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }}
                  />
                  <input 
                    type="text" 
                    name="brandPrimary"
                    className="form-input" 
                    value={settings.brandPrimary} 
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    name="brandSecondary"
                    className="color-picker" 
                    value={settings.brandSecondary} 
                    onChange={handleChange}
                    style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }}
                  />
                  <input 
                    type="text" 
                    name="brandSecondary"
                    className="form-input" 
                    value={settings.brandSecondary} 
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    name="brandAccent"
                    className="color-picker" 
                    value={settings.brandAccent} 
                    onChange={handleChange}
                    style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }}
                  />
                  <input 
                    type="text" 
                    name="brandAccent"
                    className="form-input" 
                    value={settings.brandAccent} 
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
           </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "var(--space-4) 0" }} />

            <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
              <Store size={18} /> Multi-Vendor Marketplace
            </h4>
            <div className="grid-2 gap-6">
              <div className="form-group flex-col" style={{ gap: "var(--space-2)" }}>
                <label className="form-label flex items-center gap-2" style={{ cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    name="multiVendorEnabled" 
                    checked={settings.multiVendorEnabled === "true"} 
                    onChange={(e) => setSettings(prev => ({ ...prev, multiVendorEnabled: e.target.checked ? "true" : "false" }))}
                  />
                  Enable Marketplace Features
                </label>
                <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                  When enabled, users can apply to become vendors and sell their own services.
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Default Commission (%)</label>
                <input 
                  type="number" 
                  name="vendorCommission" 
                  className="form-input" 
                  value={settings.vendorCommission || "20"} 
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "var(--space-4) 0" }} />

            <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
              <Globe size={18} /> PWA & Mobile App Branding
            </h4>

            <div className="grid-2 gap-6">
               <div className="form-group">
                 <label className="form-label">App / PWA Name</label>
                 <input 
                   type="text" 
                   name="pwaName"
                   className="form-input" 
                   value={settings.pwaName} 
                   onChange={handleChange}
                 />
               </div>
               <div className="form-group">
                 <label className="form-label">App Icon (Square 512x512)</label>
                 <div className="flex items-center gap-3">
                    {settings.pwaIconUrl && (
                       <img src={settings.pwaIconUrl} alt="App Icon" style={{ width: "48px", height: "48px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }} />
                    )}
                    <input 
                       type="file" 
                       ref={pwaIconInputRef}
                       style={{ display: "none" }} 
                       accept="image/png,image/webp"
                       onChange={() => setSaveStatus("idle")}
                    />
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => pwaIconInputRef.current?.click()}>
                       <Upload size={14} /> Upload Icon
                    </button>
                 </div>
               </div>
            </div>

            <div className="grid-2 gap-6">
              <div className="form-group">
                <label className="form-label">Theme Color (Status Bar)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    name="pwaThemeColor"
                    className="color-picker" 
                    value={settings.pwaThemeColor} 
                    onChange={handleChange}
                  />
                  <input type="text" name="pwaThemeColor" className="form-input" value={settings.pwaThemeColor} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Splash Screen Background</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    name="pwaSplashColor"
                    className="color-picker" 
                    value={settings.pwaSplashColor} 
                    onChange={handleChange}
                  />
                  <input type="text" name="pwaSplashColor" className="form-input" value={settings.pwaSplashColor} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group">
               <label className="form-label">Optional: PWA Splash Logo (centered on splash screen)</label>
               <div className="flex items-center gap-4">
                  {settings.pwaSplashUrl && (
                     <img src={settings.pwaSplashUrl} alt="Splash Logo" style={{ width: "64px", height: "64px", objectFit: "contain", background: "var(--bg-subtle)", borderRadius: "8px" }} />
                  )}
                  <input 
                     type="file" 
                     ref={pwaSplashInputRef}
                     style={{ display: "none" }} 
                     accept="image/png,image/webp"
                     onChange={() => setSaveStatus("idle")}
                  />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => pwaSplashInputRef.current?.click()}>
                     <Upload size={14} /> {settings.pwaSplashUrl ? "Change Splash Logo" : "Upload Splash Logo"}
                  </button>
               </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "var(--space-4) 0" }} />

            <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
               <Share2 size={18} /> Social Media Links
            </h4>
            <div className="grid-2 gap-4">
               <div className="form-group">
                 <label className="form-label flex items-center gap-2"><Twitter size={14} /> Twitter / X URL</label>
                 <input type="text" name="twitterUrl" className="form-input" value={settings.twitterUrl} onChange={handleChange} />
               </div>
               <div className="form-group">
                 <label className="form-label flex items-center gap-2"><Facebook size={14} /> Facebook URL</label>
                 <input type="text" name="facebookUrl" className="form-input" value={settings.facebookUrl} onChange={handleChange} />
               </div>
               <div className="form-group">
                 <label className="form-label flex items-center gap-2"><Linkedin size={14} /> LinkedIn URL</label>
                 <input type="text" name="linkedinUrl" className="form-input" value={settings.linkedinUrl} onChange={handleChange} />
               </div>
               <div className="form-group">
                 <label className="form-label flex items-center gap-2"><Instagram size={14} /> Instagram URL</label>
                 <input type="text" name="instagramUrl" className="form-input" value={settings.instagramUrl} onChange={handleChange} />
               </div>
               <div className="form-group">
                 <label className="form-label flex items-center gap-2"><MessageCircle size={14} /> WhatsApp URL</label>
                 <input type="text" name="whatsappUrl" className="form-input" value={settings.whatsappUrl} onChange={handleChange} />
               </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "var(--space-4) 0" }} />

            <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
               <ShieldAlert size={18} style={{ color: "var(--brand-danger)" }} /> Advanced Security Scanning
            </h4>
            <div className="form-group">
               <label className="form-label">Virus Scanning API Key (Cloudmersive)</label>
               <input type="password" name="virusScannerApiKey" className="form-input" value={settings.virusScannerApiKey} onChange={handleChange} placeholder="API_KEY_..." />
               <p className="text-muted" style={{ fontSize: "0.7rem", marginTop: "var(--space-1)" }}>
                  Used to automatically scan user-uploaded files for malware and threats.
               </p>
            </div>



           <div className="flex items-center gap-4 pt-4">
             <button 
               type="submit" 
               className="btn btn-primary btn-md" 
               disabled={isSaving}
             >
                {isSaving ? "Saving..." : "Save Configuration"}
             </button>
             
             {saveStatus === "success" && (
               <span className="flex items-center gap-1 text-success" style={{ fontSize: "0.875rem" }}>
                 <CheckCircle2 size={16} /> Settings saved successfully!
               </span>
             )}
             {saveStatus === "error" && (
               <span className="text-danger" style={{ fontSize: "0.875rem" }}>
                 Error saving settings.
               </span>
             )}
           </div>
        </form>
      </div>

      <div className="flex-col gap-8">
        {/* Navigation Management */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
           <h3 className="flex items-center gap-2" style={{ fontSize: "1.25rem", margin: 0 }}>
              <Globe size={20} className="text-secondary" /> Navigation & Menus
           </h3>
           <p className="text-secondary text-sm">Customize the top navbar and footer link columns.</p>

           <LinkManager 
              title="Top Navigation Links" 
              icon={LinkIcon} 
              links={JSON.parse(settings.topNavLinks || "[]")} 
              onChange={(links) => setSettings(prev => ({ ...prev, topNavLinks: JSON.stringify(links) }))} 
           />

           <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)" }} />

           <div className="flex-col gap-4">
              <h5 className="flex items-center gap-2" style={{ margin: 0, fontSize: "0.9rem" }}>
                 <ExternalLink size={16} className="text-primary" /> Footer Link Columns
              </h5>
              <div className="flex-col gap-6">
                {Object.entries(JSON.parse(settings.footerMenuLinks || "{}")).map(([section, links]: [string, any]) => (
                  <div key={section} className="bg-subtle p-4 rounded-xl border border-subtle">
                     <div className="flex justify-between items-center mb-4">
                        <input 
                          className="font-bold bg-transparent border-none p-0 focus:ring-0" 
                          value={section} 
                          onChange={(e) => {
                             const newMenu = { ...JSON.parse(settings.footerMenuLinks) };
                             const val = e.target.value;
                             newMenu[val] = newMenu[section];
                             delete newMenu[section];
                             setSettings(prev => ({ ...prev, footerMenuLinks: JSON.stringify(newMenu) }));
                          }}
                        />
                        <button 
                          type="button" 
                          className="text-danger opacity-60 hover:opacity-100"
                          onClick={() => {
                            const newMenu = { ...JSON.parse(settings.footerMenuLinks) };
                            delete newMenu[section];
                            setSettings(prev => ({ ...prev, footerMenuLinks: JSON.stringify(newMenu) }));
                          }}
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                     <LinkManager 
                        title={`Links in ${section}`} 
                        icon={LinkIcon} 
                        links={links} 
                        onChange={(newLinks) => {
                           const newMenu = { ...JSON.parse(settings.footerMenuLinks) };
                           newMenu[section] = newLinks;
                           setSettings(prev => ({ ...prev, footerMenuLinks: JSON.stringify(newMenu) }));
                        }} 
                     />
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm border-dashed" 
                  style={{ width: "100%", padding: "12px" }}
                  onClick={() => {
                     const newMenu = { ...JSON.parse(settings.footerMenuLinks || "{}") };
                     newMenu["New Section"] = [];
                     setSettings(prev => ({ ...prev, footerMenuLinks: JSON.stringify(newMenu) }));
                  }}
                >
                  <Plus size={16} /> Add New Footer Column
                </button>
              </div>
           </div>

           <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)" }} />

           <div className="form-group">
              <label className="form-label">Footer Copyright Text</label>
              <input type="text" name="footerCopyright" className="form-input" value={settings.footerCopyright} onChange={handleChange} />
           </div>

           <div className="form-group">
              <label className="form-label">Footer Brand Description</label>
              <textarea name="footerBrandText" className="form-input" style={{ minHeight: "80px" }} value={settings.footerBrandText} onChange={handleChange} />
           </div>
        </div>

        <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Database size={18} style={{ color: "var(--brand-primary)" }} /> Database Status
           </h4>
           <div className="flex justify-between items-center">
              <span className="text-secondary">Prisma DB connection:</span>
              <span className="badge badge-success">Connected</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-secondary">Schema Version:</span>
              <span className="badge badge-info">v1.2.4</span>
           </div>
        </div>


        <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Globe size={18} style={{ color: "var(--brand-secondary)" }} /> Vercel Deployment
           </h4>
           <div className="flex justify-between items-center">
              <span className="text-secondary">Deployment Status:</span>
              <span className="badge badge-success">Live</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-secondary">Production URL:</span>
              <span className="badge badge-primary">novaxdigitalcentre.vercel.app</span>
           </div>
        </div>

        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Bell size={20} style={{ color: "var(--brand-warning)" }} /> Notification Templates & Keys
           </h4>
           
           <div className="grid-2 gap-8">
              {/* Email Config */}
              <div className="flex-col gap-4">
                 <h5 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Email (Resend)</h5>
                 <div className="form-group">
                    <label className="form-label">Resend API Key</label>
                    <input type="password" name="resendApiKey" className="form-input" value={settings.resendApiKey} onChange={handleChange} placeholder="re_..." />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Sender Email Address</label>
                    <input type="email" name="emailFromAddress" className="form-input" value={settings.emailFromAddress} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Admin Alert Email</label>
                    <input type="email" name="adminNotificationEmail" className="form-input" value={settings.adminNotificationEmail} onChange={handleChange} placeholder="admin@domain.com" />
                 </div>
              </div>

              {/* WhatsApp Config */}
              <div className="flex-col gap-4">
                 <h5 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>WhatsApp (Twilio)</h5>
                 <div className="form-group">
                    <label className="form-label">Twilio SID</label>
                    <input type="text" name="twilioSid" className="form-input" value={settings.twilioSid} onChange={handleChange} placeholder="AC..." />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Twilio Auth Token</label>
                    <input type="password" name="twilioToken" className="form-input" value={settings.twilioToken} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Twilio From Phone (E.164)</label>
                    <input type="text" name="twilioFromNumber" className="form-input" value={settings.twilioFromNumber} onChange={handleChange} placeholder="+123456789" />
                 </div>
              </div>
           </div>

           <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "var(--space-4) 0" }} />

           <div className="flex-col gap-6">
              <h5 style={{ margin: 0, fontSize: "1rem" }}>Message Templates</h5>
              <div className="bg-info-subtle p-4 rounded-xl text-xs text-info leading-loose">
                 Available tags: <code>{"{{job_id}}"}</code>, <code>{"{{customer_name}}"}</code>, <code>{"{{job_title}}"}</code>, <code>{"{{service_name}}"}</code>, <code>{"{{status}}"}</code>
              </div>

              <div className="grid-2 gap-8">
                 {/* Job Created */}
                 <div className="flex-col gap-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>1. Job Created Confirmation</label>
                    <textarea 
                       name="JOB_CREATED_EMAIL_TEMPLATE" 
                       className="form-input" 
                       style={{ minHeight: "120px", fontSize: "0.85rem" }} 
                       value={settings.JOB_CREATED_EMAIL_TEMPLATE} 
                       onChange={handleChange}
                       placeholder="Email template..."
                    />
                    <textarea 
                       name="JOB_CREATED_WHAPP_TEMPLATE" 
                       className="form-input" 
                       style={{ minHeight: "80px", fontSize: "0.85rem", background: "#dcf8c6" }} 
                       value={settings.JOB_CREATED_WHAPP_TEMPLATE} 
                       onChange={handleChange}
                       placeholder="WhatsApp template..."
                    />
                 </div>

                 {/* Status Updated */}
                 <div className="flex-col gap-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>2. Status Update Notification</label>
                    <textarea 
                       name="STATUS_UPDATE_EMAIL_TEMPLATE" 
                       className="form-input" 
                       style={{ minHeight: "120px", fontSize: "0.85rem" }} 
                       value={settings.STATUS_UPDATE_EMAIL_TEMPLATE} 
                       onChange={handleChange}
                       placeholder="Email template..."
                    />
                    <textarea 
                       name="STATUS_UPDATE_WHAPP_TEMPLATE" 
                       className="form-input" 
                       style={{ minHeight: "80px", fontSize: "0.85rem", background: "#dcf8c6" }} 
                       value={settings.STATUS_UPDATE_WHAPP_TEMPLATE} 
                       onChange={handleChange}
                       placeholder="WhatsApp template..."
                    />
                 </div>

                 {/* AI Completed */}
                 <div className="flex-col gap-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>3. AI Processing Completed</label>
                    <textarea 
                       name="AI_COMPLETED_EMAIL_TEMPLATE" 
                       className="form-input" 
                       style={{ minHeight: "120px", fontSize: "0.85rem" }} 
                       value={settings.AI_COMPLETED_EMAIL_TEMPLATE} 
                       onChange={handleChange}
                       placeholder="Email template..."
                    />
                    <textarea 
                       name="AI_COMPLETED_WHAPP_TEMPLATE" 
                       className="form-input" 
                       style={{ minHeight: "80px", fontSize: "0.85rem", background: "#dcf8c6" }} 
                       value={settings.AI_COMPLETED_WHAPP_TEMPLATE} 
                       onChange={handleChange}
                       placeholder="WhatsApp template..."
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>

  );
}

