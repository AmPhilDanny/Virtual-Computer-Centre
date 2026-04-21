"use client";

import { redirect, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { 
  LogOut, 
  LayoutDashboard, 
  Briefcase, 
  LayoutTemplate, 
  Settings, 
  Menu, 
  X, 
  CreditCard, 
  Store,
  DollarSign
} from "lucide-react";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") return null;

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Vendor role check
  const role = (session.user as any).role;
  if (role !== "VENDOR" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    redirect("/dashboard/become-vendor");
  }

  const isActive = (path: string) => pathname === path || (path !== "/vendor" && pathname?.startsWith(path));

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="mobile-dashboard-header">
        <Link href="/vendor" className="navbar-logo">
          <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "0.9rem", background: "var(--brand-success)" }}>
            🏪
          </div>
          <span className="navbar-logo-text" style={{ fontSize: "1.1rem" }}>Vendor<span>Hub</span></span>
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
        <Link href="/vendor" className="sidebar-logo">
          <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "1rem", background: "var(--brand-success)" }}>
            🏪
          </div>
          <span className="navbar-logo-text">Vendor<span>Hub</span></span>
        </Link>

        <div className="sidebar-section-label">Marketplace</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/vendor" className={pathname === "/vendor" ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <LayoutDashboard className="nav-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/vendor/jobs" className={isActive("/vendor/jobs") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Briefcase className="nav-icon" /> Managed Jobs
            </Link>
          </li>
          <li>
            <Link href="/vendor/services" className={isActive("/vendor/services") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <LayoutTemplate className="nav-icon" /> My Services
            </Link>
          </li>
          <li>
            <Link href="/vendor/payouts" className={isActive("/vendor/payouts") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <DollarSign className="nav-icon" /> Earnings & Payouts
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-6)" }}>Account</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/vendor/profile" className={isActive("/vendor/profile") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Store className="nav-icon" /> Store Profile
            </Link>
          </li>
          <li>
            <Link href="/dashboard" onClick={() => setIsSidebarOpen(false)}>
              <Settings className="nav-icon" /> Client View
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
            <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Vendor Dashboard</h1>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>Professional Service Provider Hub</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="badge badge-success">
               Vendor Account
             </div>
             <div 
               style={{ 
                 width: 40, height: 40, borderRadius: "50%", 
                 background: "var(--bg-elevated)", border: "1px solid var(--brand-success)",
                 display: "flex", alignItems: "center", justifyContent: "center",
                 fontWeight: 800, color: "var(--brand-success)"
               }}
             >
               {(session.user.name || session.user.email || "V").charAt(0).toUpperCase()}
             </div>
          </div>
        </header>
        <div className="vendor-content-inner">
          {children}
        </div>
      </main>
    </div>
  );
}
