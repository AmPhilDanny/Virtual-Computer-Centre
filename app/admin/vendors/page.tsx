"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Store, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  ExternalLink, 
  Search,
  Filter,
  ArrowRight,
  AlertCircle
} from "lucide-react";

type TabType = "overview" | "applications" | "payouts" | "services";

export default function AdminVendorsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    stats: {
      totalVendors: number;
      pendingApps: number;
      activeEscrows: number;
      pendingPayouts: number;
    };
    applications: any[];
    payouts: any[];
    services: any[];
  }>({
    stats: { totalVendors: 0, pendingApps: 0, activeEscrows: 0, pendingPayouts: 0 },
    applications: [],
    payouts: [],
    services: [],
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/vendors");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch vendor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to approve this vendor?")) return;
    try {
      const res = await fetch(`/api/admin/vendors/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, action: "APPROVE" }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleMarkPayoutPaid = async (payoutId: string) => {
    if (!confirm("Confirm that you have manually sent this payment to the vendor?")) return;
    try {
      const res = await fetch(`/api/admin/vendors/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId, action: "PAID" }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Payout update failed:", error);
    }
  };

  return (
    <div className="flex-col gap-8">
      {/* Header & Tabs */}
      <div className="flex justify-between items-end">
        <div className="flex-col gap-2">
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Vendor Marketplace</h1>
          <p className="text-secondary">Manage independent service providers and financial escrows.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-subtle" style={{ marginTop: "var(--space-4)" }}>
        {(["overview", "applications", "payouts", "services"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn btn-sm ${activeTab === tab ? "active" : ""}`}
            style={{ 
              background: "transparent", 
              border: "none", 
              borderRadius: 0,
              borderBottom: activeTab === tab ? "2px solid var(--brand-primary)" : "none",
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
              padding: "var(--space-4) var(--space-6)",
              fontWeight: 600,
              textTransform: "capitalize"
            }}
          >
            {tab}
            {tab === "applications" && data.stats.pendingApps > 0 && (
              <span className="badge badge-danger" style={{ marginLeft: "8px", fontSize: "0.6rem" }}>{data.stats.pendingApps}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="admin-vendor-content" style={{ marginTop: "var(--space-4)" }}>
          {activeTab === "overview" && (
            <div className="flex-col gap-8">
              <div className="grid-4 gap-6">
                <div className="glass-card flex-col gap-2" style={{ padding: "var(--space-6)" }}>
                   <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Total Vendors</span>
                   <div className="flex justify-between items-center">
                     <span style={{ fontSize: "2rem", fontWeight: 800 }}>{data.stats.totalVendors}</span>
                     <Store className="text-primary" size={32} opacity={0.3} />
                   </div>
                </div>
                <div className="glass-card flex-col gap-2" style={{ padding: "var(--space-6)" }}>
                   <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Pending Apps</span>
                   <div className="flex justify-between items-center">
                     <span style={{ fontSize: "2rem", fontWeight: 800 }}>{data.stats.pendingApps}</span>
                     <Clock className="text-warning" size={32} opacity={0.3} />
                   </div>
                </div>
                <div className="glass-card flex-col gap-2" style={{ padding: "var(--space-6)" }}>
                   <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Active Escrows</span>
                   <div className="flex justify-between items-center">
                     <span style={{ fontSize: "2rem", fontWeight: 800 }}>{data.stats.activeEscrows}</span>
                     <AlertCircle className="text-info" size={32} opacity={0.3} />
                   </div>
                </div>
                <div className="glass-card flex-col gap-2" style={{ padding: "var(--space-6)" }}>
                   <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Pending Payouts</span>
                   <div className="flex justify-between items-center">
                     <span style={{ fontSize: "2rem", fontWeight: 800 }}>{data.stats.pendingPayouts}</span>
                     <DollarSign className="text-success" size={32} opacity={0.3} />
                   </div>
                </div>
              </div>

              <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
                <div className="flex justify-between items-center">
                  <h3 style={{ margin: 0 }}>Recent Activity</h3>
                </div>
                <p className="text-muted">No recent marketplace transactions.</p>
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead style={{ background: "var(--bg-elevated)" }}>
                  <tr>
                    <th style={{ padding: "var(--space-4)" }}>Vendor Name</th>
                    <th style={{ padding: "var(--space-4)" }}>User Email</th>
                    <th style={{ padding: "var(--space-4)" }}>Applied On</th>
                    <th style={{ padding: "var(--space-4)" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.applications.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>No pending applications.</td></tr>
                  ) : (
                    data.applications.map((app: any) => (
                      <tr key={app.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "var(--space-4)" }}>{app.storeName}</td>
                        <td style={{ padding: "var(--space-4)" }}>{app.user.email}</td>
                        <td style={{ padding: "var(--space-4)" }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "var(--space-4)" }} className="flex gap-2">
                           <button onClick={() => handleApproveVendor(app.id)} className="btn btn-primary btn-sm">Approve</button>
                           <button className="btn btn-ghost btn-sm text-danger">Reject</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="flex-col gap-6">
              <div className="bg-info-subtle p-4 rounded-xl text-xs text-info flex items-center gap-3">
                 <Clock size={16} /> Reminder: Payouts should be processed within 5 working hours of request.
              </div>
              <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                <table className="table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                  <thead style={{ background: "var(--bg-elevated)" }}>
                    <tr>
                      <th style={{ padding: "var(--space-4)" }}>Vendor</th>
                      <th style={{ padding: "var(--space-4)" }}>Amount</th>
                      <th style={{ padding: "var(--space-4)" }}>Account Details</th>
                      <th style={{ padding: "var(--space-4)" }}>Status</th>
                      <th style={{ padding: "var(--space-4)" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payouts.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>No payout requests found.</td></tr>
                    ) : (
                      data.payouts.map((payout: any) => (
                        <tr key={payout.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                          <td style={{ padding: "var(--space-4)" }}>{payout.vendor.storeName}</td>
                          <td style={{ padding: "var(--space-4)", fontWeight: 700 }}>₦{payout.amount.toLocaleString()}</td>
                          <td style={{ padding: "var(--space-4)", fontSize: "0.8rem" }}>
                             {payout.accountName}<br/>
                             {payout.bankName} - {payout.accountNumber}
                          </td>
                          <td style={{ padding: "var(--space-4)" }}>
                            <span className={`badge badge-${payout.status === 'PENDING' ? 'warning' : 'success'}`}>{payout.status}</span>
                          </td>
                          <td style={{ padding: "var(--space-4)" }}>
                             {payout.status === 'PENDING' && (
                               <button onClick={() => handleMarkPayoutPaid(payout.id)} className="btn btn-primary btn-sm">Mark Paid</button>
                             )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead style={{ background: "var(--bg-elevated)" }}>
                  <tr>
                    <th style={{ padding: "var(--space-4)" }}>Service Name</th>
                    <th style={{ padding: "var(--space-4)" }}>Vendor</th>
                    <th style={{ padding: "var(--space-4)" }}>Price</th>
                    <th style={{ padding: "var(--space-4)" }}>Status</th>
                    <th style={{ padding: "var(--space-4)" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.services.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>No vendor services found.</td></tr>
                  ) : (
                    data.services.map((service: any) => (
                      <tr key={service.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "var(--space-4)" }}>{service.name}</td>
                        <td style={{ padding: "var(--space-4)" }}>{service.vendor?.storeName || "Platform"}</td>
                        <td style={{ padding: "var(--space-4)" }}>₦{service.basePrice.toLocaleString()}</td>
                        <td style={{ padding: "var(--space-4)" }}>
                          <span className={`badge badge-${service.approvalStatus === 'APPROVED' ? 'success' : 'warning'}`}>{service.approvalStatus}</span>
                        </td>
                        <td style={{ padding: "var(--space-4)" }} className="flex gap-2">
                           <button className="btn btn-ghost btn-sm">Review</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
