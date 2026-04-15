"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">⚡</div>
          <span className="navbar-logo-text">
            AI<span>Centre</span>
          </span>
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
          <Link href="/auth/login" className="btn btn-secondary btn-sm">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn btn-primary btn-sm">
            Get Started
          </Link>
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
              gap: "var(--space-3)",
              marginTop: "var(--space-4)",
            }}
          >
            <Link href="/auth/login" className="btn btn-secondary btn-sm">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
