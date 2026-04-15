"use client";

import { redirect, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { LogOut, Home, FileText, PlusCircle, CreditCard, User, Menu, X } from "lucide-react";

export default function DashboardLayout({
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

  // Redirect admin users to the admin panel
  if ((session.user as any).role !== "CLIENT") {
    redirect("/admin");
  }

  const isActive = (path: string) => pathname === path || (path !== "/dashboard" && pathname?.startsWith(path));

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div 
        className="mobile-dashboard-header"
        style={{
          display: "none",
          padding: "var(--space-4)",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          alignItems: "center",
          justifyContent: "between",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon" style={{ width: 28, height: 28, fontSize: "0.8rem" }}>
            🤖
          </div>
          <span className="navbar-logo-text" style={{ fontSize: "1rem" }}>AI<span>Centre</span></span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ background: "none", border: "none", color: "var(--text-primary)" }}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <Link href="/" className="sidebar-logo">
          <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "1rem" }}>
            🤖
          </div>
          <span className="navbar-logo-text">AI<span>Centre</span></span>
        </Link>

        <div className="sidebar-section-label">Main Menu</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/dashboard" className={pathname === "/dashboard" ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <Home className="nav-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/services" className={isActive("/dashboard/services") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <PlusCircle className="nav-icon" /> New Order
            </Link>
          </li>
          <li>
            <Link href="/dashboard/orders" className={isActive("/dashboard/orders") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <FileText className="nav-icon" /> Order History
            </Link>
          </li>
          <li>
            <Link href="/dashboard/wallet" className={isActive("/dashboard/wallet") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <CreditCard className="nav-icon" /> Wallet
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-6)" }}>Settings</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/dashboard/profile" className={isActive("/dashboard/profile") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <User className="nav-icon" /> Profile
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
        <header className="flex justify-between items-center" style={{ marginBottom: "var(--space-8)" }}>
          <h1 style={{ fontSize: "1.5rem" }}>Client Portal</h1>
          <div className="flex items-center gap-4">
             <div className="badge badge-primary">
               Wallet: ₦{(session.user as any).walletBalance?.toLocaleString() || "0.00"}
             </div>
             <div 
               style={{ 
                 width: 40, height: 40, borderRadius: "50%", 
                 background: "var(--grad-card)", border: "1px solid var(--border-medium)",
                 display: "flex", alignItems: "center", justifyContent: "center",
                 fontWeight: 800, color: "var(--brand-primary)"
               }}
             >
               {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
             </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
