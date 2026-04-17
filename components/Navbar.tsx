"use client";
import Link from "next/link";
import { useState } from "react";
import { useSettings } from "./SettingsProvider";
import { useTheme } from "./ThemeProvider";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const settings = useSettings();
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.siteName} style={{ height: "40px", objectFit: "contain" }} />
          ) : (
            <>
              <div className="navbar-logo-icon">⚡</div>
              <span className="navbar-logo-text">
                {settings.siteName.split(" ")[0]}<span>{settings.siteName.split(" ").slice(1).join("")}</span>
              </span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar-nav">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <button 
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            style={{ padding: "8px", borderRadius: "10px", width: "40px", height: "40px" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm flex items-center gap-2">
                <UserIcon size={18} /> Dashboard
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-secondary btn-sm flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-2)",
            color: "var(--text-primary)",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border-subtle)",
            padding: "var(--space-4)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "var(--space-3) var(--space-4)",
                color: "var(--text-secondary)",
                borderRadius: "var(--radius-md)",
                fontWeight: 500,
              }}
            >
              {link.label}
            </Link>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              marginTop: "var(--space-4)",
            }}
          >
            <button 
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              style={{ padding: "8px", borderRadius: "10px", width: "40px", height: "40px" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                   Dashboard
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn btn-secondary btn-sm" 
                  style={{ flex: 1 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
