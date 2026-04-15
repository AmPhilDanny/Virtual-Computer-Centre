import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Shield, UserCircle } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="grid-2" style={{ gap: "var(--space-8)" }}>
      <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
        <div className="flex items-center gap-6">
           <div 
             style={{ 
               width: 80, height: 80, borderRadius: "50%", 
               background: "var(--grad-primary)", border: "2px solid var(--border-medium)",
               display: "flex", alignItems: "center", justifyContent: "center",
               fontSize: "2rem", fontWeight: 900, color: "#fff"
             }}
           >
             {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
           </div>
           <div>
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{session.user.name || "User"}</h2>
              <p className="text-muted" style={{ margin: 0 }}>Client Account</p>
           </div>
        </div>

        <div className="flex-col gap-4">
          <div className="form-group">
            <label className="form-label"><User size={14} style={{ display: "inline", marginRight: "var(--space-2)" }} /> Full Name</label>
            <input type="text" className="form-input" value={session.user.name || ""} readOnly />
          </div>
          <div className="form-group">
            <label className="form-label"><Mail size={14} style={{ display: "inline", marginRight: "var(--space-2)" }} /> Email Address</label>
            <input type="email" className="form-input" value={session.user.email || ""} readOnly />
          </div>
          <div className="form-group">
            <label className="form-label"><Shield size={14} style={{ display: "inline", marginRight: "var(--space-2)" }} /> Role</label>
            <input type="text" className="form-input" value={(session.user as any).role || "CLIENT"} readOnly />
          </div>
        </div>
      </div>

      <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
        <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Account Security</h3>
        <p className="text-secondary">Update your password or manage your security settings.</p>
        
        <form className="flex-col gap-4">
           <div className="form-group">
             <label className="form-label">Current Password</label>
             <input type="password" placeholder="••••••••" className="form-input" />
           </div>
           <div className="form-group">
             <label className="form-label">New Password</label>
             <input type="password" placeholder="••••••••" className="form-input" />
           </div>
           <button type="submit" className="btn btn-secondary btn-md" style={{ alignSelf: "flex-start" }}>
              Update Password
           </button>
        </form>
      </div>
    </div>
  );
}
