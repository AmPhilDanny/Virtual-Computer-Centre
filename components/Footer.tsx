"use client";
import Link from "next/link";

  MessageCircle, 
  MapPin, 
  ShieldCheck 
} from "lucide-react";

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);
const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

import { useSettings } from "./SettingsProvider";

const defaultFooterLinks = {
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
};

export default function Footer() {
  const settings = useSettings();

  const menuLinks = settings.footerMenuLinks 
    ? JSON.parse(settings.footerMenuLinks) 
    : defaultFooterLinks;

  const socialLinks = [
    { icon: <TwitterIcon size={18} />, url: settings.twitterUrl || "#", label: "Twitter" },
    { icon: <FacebookIcon size={18} />, url: settings.facebookUrl || "#", label: "Facebook" },
    { icon: <LinkedinIcon size={18} />, url: settings.linkedinUrl || "#", label: "LinkedIn" },
    { icon: <InstagramIcon size={18} />, url: settings.instagramUrl || "#", label: "Instagram" },
    { icon: <MessageCircle size={18} />, url: settings.whatsappUrl || "#", label: "WhatsApp" },
    { icon: <MapPin size={18} />, url: settings.googleBusinessUrl || "#", label: "Google Business" },
  ].filter(s => s.url !== "#");

  return (
    <footer
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        padding: "var(--space-16) 0 var(--space-8)",
      }}
    >
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="navbar-logo" style={{ marginBottom: "var(--space-4)" }}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" style={{ height: "36px", width: "auto", borderRadius: "8px" }} />
              ) : (
                <div className="navbar-logo-icon">✨</div>
              )}
              <span className="navbar-logo-text">
                {settings.siteName?.split(" ")[0] || "NovaX"}<span>{settings.siteName?.split(" ").slice(1).join("") || "Digital"}</span>
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                lineHeight: 1.75,
                maxWidth: "280px",
              }}
            >
              {settings.footerBrandText || "Nigeria's #1 AI-powered digital computer centre. Professional services delivered by intelligent agents, reviewed by experts."}
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                marginTop: "var(--space-5)",
              }}
            >
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-secondary)",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--brand-primary)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--bg-elevated)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(menuLinks).map(([section, links]: [string, any]) => (
            <div key={section}>
              <h4
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "var(--space-4)",
                }}
              >
                {section}
              </h4>
              <ul style={{ listStyle: "none" }}>
                {links.map((link: any) => (
                  <li key={link.href} style={{ marginBottom: "var(--space-2)" }}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        transition: "color var(--transition-fast)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            textAlign: "center"
          }}
          className="footer-bottom"
        >
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {settings.footerCopyright || `© ${new Date().getFullYear()} NovaX Digital Centre. All rights reserved.`}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
              }}
            >
              <span style={{ color: "var(--brand-success)" }}>●</span> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

