"use client";

import { redirect, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Home, FileText, PlusCircle, CreditCard, User, Menu, X } from "lucide-react";
import BecomeVendorModal from "@/components/modals/BecomeVendorModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // Fetch wallet balance
      fetch("/api/wallet")
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.balance === "number") {
            setWalletBalance(data.balance);
          }
        })
        .catch(err => console.error("Failed to fetch wallet", err));

      // Marketplace CTA Logic
      const hasSeenCTA = sessionStorage.getItem("hasSeenVendorCTA");
      const userRole = (session.user as any).role;

      if (!hasSeenCTA && userRole === "CLIENT") {
        fetch("/api/marketplace/config")
          .then(res => res.json())
          .then(data => {
            if (data.enabled) {
              setIsVendorModalOpen(true);
              sessionStorage.setItem("hasSeenVendorCTA", "true");
            }
          })
          .catch(console.error);
      }
    }
  }, [session]);

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
      <div className="mobile-dashboard-header">
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon" style={{ width: 28, height: 28, fontSize: "0.8rem", background: "var(--brand-primary)", overflow: "hidden" }}>
             <img src="/favicon.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span className="navbar-logo-text" style={{ fontSize: "1rem" }}>AI<span>Centre</span></span>
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
        <Link href="/" className="sidebar-logo">
          <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "1rem", background: "var(--brand-primary)", overflow: "hidden" }}>
             <img src="/favicon.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span className="navbar-logo-text">AI<span>Centre</span></span>
        </Link>

        <div className="sidebar-section-label">Global Navigation</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/" onClick={() => setIsSidebarOpen(false)}>
              <Home className="nav-icon" /> Back to Website
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-4)" }}>Main Menu</div>
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
            <Link href="/dashboard/tutor" className={isActive("/dashboard/tutor") ? "active" : ""} onClick={() => setIsSidebarOpen(false)}>
              <span className="nav-icon" style={{ fontSize: "1.1rem" }}>🤖</span> AI Tutor
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
            <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Client Portal</h1>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>Welcome back, {session.user.name || "User"}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="badge badge-primary">
               Wallet: ₦{walletBalance !== null ? walletBalance.toLocaleString() : ((session.user as any)?.walletBalance?.toLocaleString() || "0.00")}
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
        <div className="admin-content-inner">
          {children}
        </div>
      </main>

      <BecomeVendorModal 
        isOpen={isVendorModalOpen} 
        onClose={() => setIsVendorModalOpen(false)} 
      />
    </div>
  );
}
