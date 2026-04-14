import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { LogOut, Home, FileText, PlusCircle, CreditCard, User, Settings } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Redirect admin users to the admin panel
  if ((session.user as any).role !== "CLIENT") {
    redirect("/admin");
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">
          <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "1rem" }}>
            🤖
          </div>
          <span className="navbar-logo-text">AI<span>Centre</span></span>
        </Link>

        <div className="sidebar-section-label">Main Menu</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/dashboard" className="active">
              <Home className="nav-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/services">
              <PlusCircle className="nav-icon" /> New Order
            </Link>
          </li>
          <li>
            <Link href="/dashboard/orders">
              <FileText className="nav-icon" /> Order History
            </Link>
          </li>
          <li>
            <Link href="/dashboard/wallet">
              <CreditCard className="nav-icon" /> Wallet
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-6)" }}>Settings</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/dashboard/profile">
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
               Wallet: ₦0.00
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
