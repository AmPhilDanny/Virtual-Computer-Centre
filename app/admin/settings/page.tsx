"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, Database, Globe, Bell, Palette, Upload, Image as ImageIcon, CheckCircle2, ShieldAlert } from "lucide-react";

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
    paystackSecretKey: "",
    flutterwaveSecretKey: "",
    virusScannerApiKey: "",
    walletFundingRate: "1", // 1 NGN = 1 Wallet Unit
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

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
               <label className="form-label">Contact Number</label>
               <input 
                 type="text" 
                 name="contactNumber"
                 className="form-input" 
                 value={settings.contactNumber} 
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
  );
}
