"use client";

import { useState } from "react";
import { Share2, Copy, CheckCircle2, ExternalLink } from "lucide-react";

const BASE_URL = "https://novaxdigitalcentre.vercel.app";

const pitchLinks = [
  {
    title: "Investor Pitch Deck",
    description: "Full platform overview — features, revenue model, market opportunity, and traction.",
    url: `${BASE_URL}/pitch`,
    badge: "Standard",
    badgeColor: "#6C47FF",
  },
  {
    title: "Financial Projections Edition",
    description: "Includes 5-year growth projections, pricing tiers, vendor commission tiers, and fund allocation.",
    url: `${BASE_URL}/pitch/premium`,
    badge: "Premium",
    badgeColor: "#00d4ff",
  },
];

export default function AdminPitchLinks() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="glass-card flex-col gap-6" style={{ 
      padding: "var(--space-8)",
      background: "linear-gradient(135deg, rgba(108,71,255,0.06) 0%, rgba(0,212,255,0.03) 100%)",
      border: "1px solid rgba(108,71,255,0.2)"
    }}>
      <div className="flex items-center justify-between">
        <div className="flex-col gap-1">
          <h3 className="flex items-center gap-2" style={{ margin: 0, fontSize: "1.1rem" }}>
            <Share2 size={18} style={{ color: "var(--brand-primary)" }} />
            Investor Pitch Links
          </h3>
          <p className="text-muted" style={{ fontSize: "0.8rem" }}>
            These pages are hidden from public navigation. Only share with trusted investors and partners.
          </p>
        </div>
        <div className="badge badge-warning" style={{ fontSize: "0.7rem" }}>Admin Only</div>
      </div>

      <div className="flex-col gap-4">
        {pitchLinks.map((link) => (
          <div
            key={link.url}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "20px 24px",
            }}
          >
            <div className="flex justify-between items-start" style={{ gap: "16px", flexWrap: "wrap" }}>
              <div className="flex-col gap-2" style={{ flex: 1 }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>{link.title}</span>
                  <span style={{
                    padding: "2px 10px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 700,
                    background: `${link.badgeColor}18`, color: link.badgeColor,
                    border: `1px solid ${link.badgeColor}40`
                  }}>
                    {link.badge}
                  </span>
                </div>
                <p className="text-muted" style={{ fontSize: "0.82rem", margin: 0, lineHeight: 1.5 }}>
                  {link.description}
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: "rgba(0,0,0,0.3)", borderRadius: "6px",
                  padding: "6px 12px", fontSize: "0.78rem", color: "#94a3b8",
                  fontFamily: "monospace", marginTop: "4px"
                }}>
                  {link.url}
                </div>
              </div>
              <div className="flex gap-2" style={{ flexShrink: 0 }}>
                <button
                  onClick={() => handleCopy(link.url)}
                  className="btn btn-ghost btn-sm flex items-center gap-2"
                  title="Copy link"
                >
                  {copied === link.url ? (
                    <><CheckCircle2 size={14} style={{ color: "var(--brand-success)" }} /> Copied!</>
                  ) : (
                    <><Copy size={14} /> Copy Link</>
                  )}
                </button>
                <a
                  href={link.url}
                  target="_blank"
                  className="btn btn-primary btn-sm flex items-center gap-2"
                >
                  <ExternalLink size={14} /> Preview
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: "12px 16px",
        background: "rgba(255,179,71,0.06)",
        border: "1px solid rgba(255,179,71,0.2)",
        borderRadius: "10px",
        fontSize: "0.78rem",
        color: "var(--text-muted)",
        lineHeight: 1.6
      }}>
        <strong style={{ color: "var(--brand-warning)" }}>🔒 Confidential:</strong> These pages are not indexed by search engines and won't appear in any platform navigation. They are only accessible via direct link.
      </div>
    </div>
  );
}
