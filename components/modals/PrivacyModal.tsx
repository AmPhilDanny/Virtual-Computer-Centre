"use client";

import { useState, useEffect } from "react";
import { Shield, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PrivacyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("vcc_privacy_consent");
    if (!consent) {
      setIsOpen(true);
      setHasConsented(false);
    }
  }, []);

  const handleAccept = async () => {
    localStorage.setItem("vcc_privacy_consent", "true");
    setIsOpen(false);
    setHasConsented(true);
    
    // Log consent to server
    try {
      await fetch("/api/auth/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentType: "PRIVACY_POLICY" })
      });
    } catch (e) {
      console.error("Failed to log consent");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="glass-card flex-col gap-6 w-full max-w-lg shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ padding: "var(--space-8)" }}>
        <div className="flex items-center gap-4">
          <div className="bg-primary-subtle p-3 rounded-2xl text-primary">
            <Shield size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Privacy & Trust Matters</h3>
            <p className="text-secondary text-sm">We value your data security and academic integrity.</p>
          </div>
        </div>

        <div className="flex-col gap-4 text-sm leading-relaxed text-secondary">
          <p>
            By using the <strong>AI Computer Centre</strong>, you acknowledge that we process data securely and follow GDPR-style privacy controls.
          </p>
          <div className="flex-col gap-2 bg-subtle p-4 rounded-xl border border-subtle">
            <div className="flex items-center gap-2"><Check size={14} className="text-success" /> End-to-end data encryption</div>
            <div className="flex items-center gap-2"><Check size={14} className="text-success" /> Explicit AI usage disclosure</div>
            <div className="flex items-center gap-2"><Check size={14} className="text-success" /> Complete control over your data</div>
          </div>
          <p>
            Please review our <Link href="/privacy" className="text-primary hover:underline inline-flex items-center gap-1">Privacy Policy <ExternalLink size={12} /></Link> and <Link href="/terms" className="text-primary hover:underline inline-flex items-center gap-1">Terms of Service</Link>.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleAccept}
            className="flex-1 btn btn-primary py-4 font-bold flex items-center justify-center gap-2"
          >
            I Accept & Consent
          </button>
        </div>
      </div>
    </div>
  );
}
