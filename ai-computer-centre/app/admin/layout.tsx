import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { LogOut, LayoutDashboard, Briefcase, Users, LayoutTemplate, Settings } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Admin and Super Admin wrapper
  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar" style={{ background: "var(--bg-elevated)", borderRightColor: "var(--border-strong)" }}>
        <Link href="/admin" className="sidebar-logo">
          <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "1rem", background: "var(--brand-danger)" }}>
            🛡️
          </div>
          <span className="navbar-logo-text">Admin<span>Panel</span></span>
        </Link>

        <div className="sidebar-section-label">Management</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/admin" className="active">
              <LayoutDashboard className="nav-icon" /> Overview
            </Link>
          </li>
          <li>
            <Link href="/admin/jobs">
              <Briefcase className="nav-icon" /> Manage Jobs
            </Link>
          </li>
          <li>
            <Link href="/admin/services">
              <LayoutTemplate className="nav-icon" /> Services Catalog
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <Users className="nav-icon" /> Users & Clients
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-6)" }}>System</div>
        <ul className="sidebar-nav">
          <li>
            <Link href="/admin/settings">
              <Settings className="nav-icon" /> Analytics & Settings
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
          <h1 style={{ fontSize: "1.5rem" }}>Admin Workspace</h1>
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
        {children}
      </main>
    </div>
  );
}
