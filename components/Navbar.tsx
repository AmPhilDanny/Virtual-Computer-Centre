"use client";
import Link from "next/link";
import { useState } from "react";
import { useSettings } from "./SettingsProvider";
import { useTheme } from "./ThemeProvider";
import { useSession, signOut } from "next-auth/react";
import { Sun, Moon, LogOut, User as UserIcon, LogIn, Store } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
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
        <div className="navbar-actions" style={{ gap: "var(--space-2)" }}>
          <button 
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            style={{ padding: "8px", borderRadius: "10px", width: "36px", height: "36px" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          
          {status === "authenticated" ? (
            <>
              {(session.user as any).role === "VENDOR" && (
                <Link href="/vendor" className="btn btn-ghost btn-sm flex items-center gap-2 text-success" style={{ padding: "0 var(--space-3)" }}>
                  <Store size={16} /> <span className="hide-on-xs">Vendor Hub</span>
                </Link>
              )}
              <Link href="/dashboard" className="btn btn-ghost btn-sm flex items-center gap-2" style={{ padding: "0 var(--space-3)" }}>
                <UserIcon size={16} /> <span className="hide-on-xs">Dashboard</span>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-secondary btn-sm flex items-center gap-1"
                style={{ padding: "0 var(--space-3)" }}
              >
                <LogOut size={16} /> <span className="hide-on-xs">Exit</span>
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" className="btn btn-secondary btn-sm flex items-center gap-2" style={{ padding: "0 var(--space-3)", fontSize: "0.8rem" }}>
                <LogIn size={16} /> <span className="hide-on-xs">Login</span>
              </Link>
            </div>
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
            width: "36px",
            height: "36px",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            cursor: "pointer",
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
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
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
