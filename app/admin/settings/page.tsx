import { Settings, BarChart3, Database, Globe, Bell, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="grid-2" style={{ gap: "var(--space-8)" }}>
      <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
        <h3 className="flex items-center gap-2" style={{ fontSize: "1.25rem", margin: 0 }}>
           <Settings size={20} /> System Configuration
        </h3>
        <p className="text-secondary">Configure global settings for the computer centre platform.</p>

        <form className="flex-col gap-6">
           <div className="form-group">
             <label className="form-label">Platform Name</label>
             <input type="text" className="form-input" defaultValue="AI Computer Centre" />
           </div>
           <div className="form-group">
             <label className="form-label">Support Email</label>
             <input type="email" className="form-input" defaultValue="support@aicomputercentre.com" />
           </div>
           <div className="form-group">
             <label className="form-label">Contact Number</label>
             <input type="text" className="form-input" defaultValue="+234 812 345 6789" />
           </div>
           <button type="submit" className="btn btn-primary btn-md" style={{ alignSelf: "flex-start" }}>
              Save Configuration
           </button>
        </form>
      </div>

      <div className="flex-col gap-8">
        <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Database size={18} style={{ color: "var(--brand-primary)" }} /> Database Status
           </h4>
           <div className="flex justify-between items-center">
              <span className="text-secondary">Prisma DB connection:</span>
              <span className="badge badge-success">Connected</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-secondary">Schema Version:</span>
              <span className="badge badge-info">v1.2.4</span>
           </div>
        </div>

        <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Globe size={18} style={{ color: "var(--brand-secondary)" }} /> Vercel Deployment
           </h4>
           <div className="flex justify-between items-center">
              <span className="text-secondary">Deployment Status:</span>
              <span className="badge badge-success">Live</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-secondary">Production URL:</span>
              <span className="badge badge-primary">novaxdigitalcentre.vercel.app</span>
           </div>
        </div>

        <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
           <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
             <Bell size={18} style={{ color: "var(--brand-warning)" }} /> System Notifications
           </h4>
           <p className="text-muted" style={{ fontSize: "0.875rem", margin: 0 }}>
             Configure how the system sends automated emails and push notifications.
           </p>
           <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }}>
              Manage Alerts
           </button>
        </div>
      </div>
    </div>
  );
}
