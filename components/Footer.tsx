"use client";
import Link from "next/link";

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
    { icon: "𝕏", url: settings.twitterUrl || "#" },
    { icon: "📘", url: settings.facebookUrl || "#" },
    { icon: "💼", url: settings.linkedinUrl || "#" },
    { icon: "📸", url: settings.instagramUrl || "#" },
    { icon: "💬", url: settings.whatsappUrl || "#" },
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
              <div className="navbar-logo-icon">✨</div>
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
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.9rem",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
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

