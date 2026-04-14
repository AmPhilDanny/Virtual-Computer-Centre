import Link from "next/link";

const footerLinks = {
  Services: [
    { label: "Typing Services", href: "/services/typing" },
    { label: "Academic Help", href: "/services/academic" },
    { label: "Government Forms", href: "/services/government" },
    { label: "CV & Resume", href: "/services/cv-resume" },
    { label: "AI-Enhanced", href: "/services/ai-enhanced" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "AI Disclosure", href: "/ai-disclosure" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        padding: "var(--space-16) 0 var(--space-8)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "var(--space-8)",
            marginBottom: "var(--space-12)",
          }}
        >
          {/* Brand */}
          <div>
            <div className="navbar-logo" style={{ marginBottom: "var(--space-4)" }}>
              <div className="navbar-logo-icon">⚡</div>
              <span className="navbar-logo-text">
                AI<span>Centre</span>
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
              Your AI-powered digital computer centre. Professional services delivered by intelligent agents, reviewed by experts.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                marginTop: "var(--space-5)",
              }}
            >
              {["𝕏", "📘", "💼", "📸"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
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
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
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
                {links.map((link) => (
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
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} AI Computer Centre. All rights reserved.
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
