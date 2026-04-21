"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, 
  DollarSign, 
  LayoutTemplate, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function VendorDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/vendor/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentJobs(data.recentJobs);
        }
      } catch (e) {
        console.error("Failed to fetch vendor stats:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-col gap-8">
      {/* Welcome Section */}
      <div className="glass-card flex justify-between items-center bg-grad-primary text-white" style={{ border: "none" }}>
        <div className="flex-col gap-2">
           <h2 style={{ color: "#fff", margin: 0 }}>Welcome back, {stats?.storeName}!</h2>
           <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>Your professional marketplace dashboard is ready.</p>
        </div>
        <div className="flex flex-col items-end">
           <span style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: 600 }}>AVAILABLE BALANCE</span>
           <span style={{ fontSize: "2rem", fontWeight: 800 }}>₦{stats?.walletBalance?.toLocaleString() || "0"}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4 gap-6">
        <div className="glass-card flex-col gap-2" style={{ padding: "var(--space-6)" }}>
           <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Total Managed Jobs</span>
           <div className="flex justify-between items-center">
             <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>{stats?.totalJobs || 0}</span>
             <Briefcase className="text-primary" size={24} opacity={0.4} />
           </div>
        </div>
        <div className="glass-card flex-col gap-2" style={{ padding: "var(--space-6)" }}>
           <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Pending Escrow</span>
           <div className="flex justify-between items-center">
             <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>₦{stats?.escrowBalance?.toLocaleString() || "0"}</span>
             <Clock className="text-warning" size={24} opacity={0.4} />
           </div>
        </div>
        <div className="glass-card flex-col gap-2" style={{ padding: "var(--space-6)" }}>
           <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Active Services</span>
           <div className="flex justify-between items-center">
             <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>{stats?.activeServices || 0}</span>
             <LayoutTemplate className="text-info" size={24} opacity={0.4} />
           </div>
        </div>
        <div className="glass-card flex-col gap-2" style={{ padding: "var(--space-6)" }}>
           <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Average Rating</span>
           <div className="flex justify-between items-center">
             <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>4.8</span>
             <Star className="text-success" size={24} opacity={0.4} />
           </div>
        </div>
      </div>

      <div className="grid-2 gap-8">
         {/* Recent Jobs */}
         <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
            <div className="flex justify-between items-center">
               <h3 style={{ margin: 0 }}>Active Managed Jobs</h3>
               <Link href="/vendor/jobs" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            {recentJobs.length === 0 ? (
              <p className="text-muted">No active jobs assigned yet.</p>
            ) : (
              <div className="flex-col gap-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex justify-between items-center p-4 rounded-xl border border-subtle hover:border-medium transition-all">
                    <div className="flex-col">
                       <span style={{ fontWeight: 600 }}>{job.title}</span>
                       <span className="text-muted" style={{ fontSize: "0.8rem" }}>{job.service.name} • ₦{job.order.total.toLocaleString()}</span>
                    </div>
                    <span className={`badge badge-${job.status === 'COMPLETED' ? 'success' : 'warning'}`} style={{ fontSize: "0.65rem" }}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
         </div>

         {/* Marketplace Insights */}
         <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
            <h3 style={{ margin: 0 }}>Marketplace Insights</h3>
            <div className="flex-col gap-4">
               <div className="flex items-center gap-4 p-4 bg-elevated rounded-xl">
                  <TrendingUp className="text-success" size={20} />
                  <div className="flex-col">
                     <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>High Demand</span>
                     <span className="text-muted" style={{ fontSize: "0.75rem" }}>Digital VA and Typing services are seeing 20% growth this week.</span>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-elevated rounded-xl">
                  <DollarSign className="text-primary" size={20} />
                  <div className="flex-col">
                     <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Upcoming Payouts</span>
                     <span className="text-muted" style={{ fontSize: "0.75rem" }}>You have ₦{stats?.escrowBalance?.toLocaleString()} clearing in 48 hours.</span>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-elevated rounded-xl">
                  <AlertCircle className="text-warning" size={20} />
                  <div className="flex-col">
                     <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Service Updates</span>
                     <span className="text-muted" style={{ fontSize: "0.75rem" }}>Update your service catalog to stay competitive.</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
