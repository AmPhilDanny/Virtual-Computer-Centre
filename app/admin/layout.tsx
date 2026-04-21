"use client";

import { redirect, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard, Briefcase, Users, LayoutTemplate, Settings, Menu, X, Cpu, CreditCard, Smartphone, Store, Home, Search, FileText } from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const settings = useSettings();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") return null;

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Admin and Super Admin wrapper
  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const isActive = (path: string) => pathname === path || (path !== "/admin" && pathname?.startsWith(path));

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="mobile-dashboard-header">
        <Link href="/admin" className="navbar-logo">
          <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "0.9rem", background: "var(--brand-danger)", overflow: "hidden" }}>
             <img src={settings.faviconUrl || settings.logoUrl || "/favicon.png"} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span className="navbar-logo-text" style={{ fontSize: "1.1rem" }}>Admin<span>Panel</span></span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn btn-ghost btn-sm"
          style={{ padding: "8px", borderRadius: "8px" }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <Link href="/admin" className="sidebar-logo">
          <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "1rem", background: "var(--brand-danger)", overflow: "hidden" }}>
             <img src={settings.faviconUrl || settings.logoUrl || "/favicon.png"} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span className="navbar-logo-text">Admin<span>Panel</span></span>
        </Link>

        <div className="sidebar-section-label">Global</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/" onClick={() => setIsSidebarOpen(false)}>
              <Home className="nav-icon" /> Back to Website
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-4)" }}>Management</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/admin" className={pathname === "/admin" ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <LayoutDashboard className="nav-icon" /> Overview
            </Link>
          </li>
          <li>
            <Link href="/admin/jobs" className={isActive("/admin/jobs") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Briefcase className="nav-icon" /> Manage Jobs
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className={isActive("/admin/users") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Users className="nav-icon" /> Users & Clients
            </Link>
          </li>
          <li>
            <Link href="/admin/vendors" className={isActive("/admin/vendors") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Store className="nav-icon" /> Vendors & Marketplace
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-6)" }}>Content Management</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/admin/services" className={isActive("/admin/services") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <LayoutTemplate className="nav-icon" /> Services Catalog
            </Link>
          </li>
          <li>
            <Link href="/admin/blog" className={isActive("/admin/blog") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <FileText className="nav-icon" /> Blog Articles
            </Link>
          </li>
          <li>
            <Link href="/admin/pages" className={isActive("/admin/pages") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Menu className="nav-icon" /> Pages Manager
            </Link>
          </li>
          <li>
            <Link href="/admin/seo" className={isActive("/admin/seo") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Search className="nav-icon" /> SEO Manager
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-6)" }}>System Configuration</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/admin/settings" className={isActive("/admin/settings") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Settings className="nav-icon" /> Analytics & General
            </Link>
          </li>
          <li>
            <Link href="/admin/ai" className={isActive("/admin/ai") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Cpu className="nav-icon" /> AI Configuration
            </Link>
          </li>
          <li>
            <Link href="/admin/payments" className={isActive("/admin/payments") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <CreditCard className="nav-icon" /> Monetization & Pay
            </Link>
          </li>
          <li>
            <Link href="/admin/pwa" className={isActive("/admin/pwa") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Smartphone className="nav-icon" /> PWA / Mobile App
            </Link>
          </li>
          <li>
            <Link href="/api/auth/signout">
              <LogOut className="nav-icon" /> Log Out
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header 
          className="flex justify-between items-center" 
          style={{ 
            marginBottom: "var(--space-8)",
            paddingBottom: "var(--space-4)",
            borderBottom: "1px solid var(--border-subtle)",
            position: "sticky",
            top: 0,
            background: "var(--bg-base)",
            zIndex: 10,
            marginTop: "-var(--space-2)"
          }}
        >
          <div className="flex-col">
            <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Admin Workspace</h1>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>Manage your digital computer centre platform</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="badge badge-danger">
               Admin Active
             </div>
             <div 
               style={{ 
                 width: 40, height: 40, borderRadius: "50%", 
                 background: "var(--bg-elevated)", border: "1px solid var(--brand-danger)",
                 display: "flex", alignItems: "center", justifyContent: "center",
                 fontWeight: 800, color: "var(--brand-danger)"
               }}
             >
               {(session.user.name || session.user.email || "A").charAt(0).toUpperCase()}
             </div>
          </div>
        </header>
        <div className="admin-content-inner">
          {children}
        </div>
      </main>
    </div>
  );
}
