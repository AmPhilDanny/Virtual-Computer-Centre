"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, CreditCard, Landmark, ShieldCheck } from "lucide-react";

export default function AdminPaymentsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    paystackSecretKey: "",
    flutterwaveSecretKey: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    enablePaystack: "true",
    enableFlutterwave: "true",
    enableManual: "true",
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
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
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
           <CreditCard size={20} /> Monetization & Payments
        </h3>
        <p className="text-secondary">Configure automated gateways and manual bank transfer methods.</p>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
            <div className="flex justify-between items-center">
                <h4 className="flex items-center gap-2" style={{ margin: 0, color: "var(--brand-warning)" }}>
                    <ShieldCheck size={18} /> API Gateways
                </h4>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" name="enablePaystack" checked={settings.enablePaystack === "true"} 
                          onChange={(e) => setSettings({...settings, enablePaystack: e.target.checked ? "true" : "false"})} />
                        Paystack
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" name="enableFlutterwave" checked={settings.enableFlutterwave === "true"} 
                        onChange={(e) => setSettings({...settings, enableFlutterwave: e.target.checked ? "true" : "false"})} />
                        Flutterwave
                    </label>
                </div>
            </div>

            <div className="grid-2 gap-8">
               <div className="flex-col gap-4">
                  <h5 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Paystack Configuration</h5>
                  <div className="form-group">
                     <label className="form-label">Paystack Secret Key</label>
                     <input type="password" name="paystackSecretKey" className="form-input" value={settings.paystackSecretKey || ""} onChange={handleChange} placeholder="sk_live_..." />
                  </div>
               </div>
               <div className="flex-col gap-4">
                  <h5 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Flutterwave Configuration</h5>
                  <div className="form-group">
                     <label className="form-label">Flutterwave Secret Key</label>
                     <input type="password" name="flutterwaveSecretKey" className="form-input" value={settings.flutterwaveSecretKey || ""} onChange={handleChange} placeholder="FLWSECK-..." />
                  </div>
               </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "var(--space-4) 0" }} />

            <div className="flex justify-between items-center">
                <h4 className="flex items-center gap-2" style={{ margin: 0, color: "var(--brand-success)" }}>
                    <Landmark size={18} /> Manual Bank Transfer
                </h4>
                <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" name="enableManual" checked={settings.enableManual === "true"} 
                    onChange={(e) => setSettings({...settings, enableManual: e.target.checked ? "true" : "false"})} />
                    Enable
                </label>
            </div>
            
            <div className="flex-col gap-4">
                <div className="form-group">
                    <label className="form-label">Receiving Bank Name</label>
                    <input type="text" name="bankName" className="form-input" value={settings.bankName || ""} onChange={handleChange} placeholder="e.g. Guarantee Trust Bank" />
                </div>
                <div className="grid-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Account Name</label>
                        <input type="text" name="accountName" className="form-input" value={settings.accountName || ""} onChange={handleChange} placeholder="e.g. AI Computer Centre Ltd" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Account Number</label>
                        <input type="text" name="accountNumber" className="form-input" value={settings.accountNumber || ""} onChange={handleChange} placeholder="0123456789" />
                    </div>
                </div>
            </div>


           <div className="flex items-center gap-4 pt-4">
             <button type="submit" className="btn btn-primary btn-md" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Payment Methods"}
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
        <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-8)" }}>
           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Landmark size={18} style={{ color: "var(--brand-primary)" }} /> Transfer Verification
           </h4>
           <p className="text-secondary text-sm leading-relaxed">
             Clients opting for Bank Transfer will be prompted to upload a receipt/proof. Orders will remain in PENDING status until an administrator manually verifies the transfer.
           </p>
           <a href="/admin/payments/verifications" className="btn btn-secondary w-full py-4 mt-2">
               Open Verification Portal
           </a>
        </div>
      </div>
    </div>
  );
}
