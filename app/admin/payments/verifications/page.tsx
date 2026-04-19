"use client";

import { useState, useEffect } from "react";
import { 
  Landmark, Check, X, User, Calendar, ExternalLink, ShieldCheck, 
  Wallet, Loader2, AlertCircle, RefreshCw, Clock, FileImage 
} from "lucide-react";

export default function VerificationsPage() {
  const [data, setData] = useState<any>({ walletPending: [], manualOrders: [] });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments/verifications");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (type: 'WALLET' | 'ORDER', id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this payment?`)) return;

    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/payments/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, action })
      });

      if (res.ok) {
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to process action");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const totalPending = (data.walletPending?.length || 0) + (data.manualOrders?.length || 0);

  return (
    <div className="flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex-col gap-2">
          <h2 style={{ fontSize: "1.75rem", margin: 0, fontWeight: 800 }} className="flex items-center gap-3">
            <span className="p-2 bg-primary-subtle rounded-xl">
              <ShieldCheck className="text-primary" size={24} />
            </span>
            Manual Payment Verifications
          </h2>
          <p className="text-secondary text-sm">
            Review and approve bank transfer notifications from clients.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalPending > 0 && (
            <span className="badge badge-warning" style={{ fontSize: "0.9rem", padding: "6px 14px" }}>
              {totalPending} Pending
            </span>
          )}
          <button 
            className="btn btn-ghost gap-2"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      {/* Empty State */}
      {!loading && totalPending === 0 && (
        <div className="glass-card flex-col items-center justify-center gap-6 text-center" 
          style={{ padding: "80px 40px", minHeight: "300px" }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: "50%",
            background: "var(--brand-success-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Check size={40} className="text-success" />
          </div>
          <div className="flex-col gap-2">
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>All Clear!</h3>
            <p className="text-secondary text-sm">No pending payment verifications at this time.</p>
          </div>
        </div>
      )}

      {/* Wallet Funding Requests */}
      {!loading && data.walletPending?.length > 0 && (
        <div className="flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-2 bg-primary-subtle rounded-lg">
              <Wallet size={18} className="text-primary" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Wallet Funding Requests</h3>
              <p className="text-muted text-xs">{data.walletPending.length} request{data.walletPending.length > 1 ? "s" : ""} pending review</p>
            </div>
          </div>
          <div className="flex-col gap-4">
            {data.walletPending.map((tx: any) => (
              <VerificationCard 
                key={tx.id} 
                item={tx} 
                type="WALLET" 
                onAction={handleAction} 
                processing={processingId === tx.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Manual Order Payments */}
      {!loading && data.manualOrders?.length > 0 && (
        <div className="flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(99,102,241,0.12)" }}>
              <Landmark size={18} style={{ color: "rgb(99,102,241)" }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Direct Order Payments</h3>
              <p className="text-muted text-xs">{data.manualOrders.length} order{data.manualOrders.length > 1 ? "s" : ""} awaiting verification</p>
            </div>
          </div>
          <div className="flex-col gap-4">
            {data.manualOrders.map((order: any) => (
              <VerificationCard 
                key={order.id} 
                item={order} 
                type="ORDER" 
                onAction={handleAction}
                processing={processingId === order.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VerificationCard({ item, type, onAction, processing }: any) {
  const isOrder = type === "ORDER";
  const amount = item.total || item.amount;
  const title = isOrder 
    ? `Order #${item.id.slice(-8).toUpperCase()}` 
    : "Wallet Funding Request";
  const user = item.user;
  const dateStr = new Date(item.createdAt).toLocaleString("en-NG", {
    dateStyle: "medium", timeStyle: "short"
  });

  return (
    <div className="glass-card hover-lift" style={{ 
      padding: "0", overflow: "hidden",
      border: "1px solid var(--border-subtle)"
    }}>
      {/* Card Top Band */}
      <div style={{ 
        padding: "16px 24px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--surface-elevated)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px"
      }}>
        <div className="flex items-center gap-3">
          <div style={{ 
            width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
            background: isOrder ? "rgba(99,102,241,0.12)" : "var(--brand-primary-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {isOrder 
              ? <Landmark size={20} style={{ color: "rgb(99,102,241)" }} /> 
              : <Wallet size={20} className="text-primary" />
            }
          </div>
          <div className="flex-col gap-0.5">
            <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>{title}</span>
            {isOrder && item.job?.title && (
              <span className="text-muted text-xs">{item.job.title}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-warning" style={{ fontSize: "0.7rem" }}>
            <Clock size={10} style={{ marginRight: 4 }} />
            PENDING
          </span>
          {!item.proofUrl && (
            <span style={{ 
              display: "flex", alignItems: "center", gap: 4,
              fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
              color: "var(--brand-danger)", background: "var(--brand-danger-subtle)",
              padding: "3px 8px", borderRadius: 20, border: "1px solid var(--brand-danger)"
            }}>
              <AlertCircle size={10} /> No Receipt
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "20px 24px", display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Client Info */}
        <div className="flex-col gap-3" style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ 
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <User size={16} className="text-muted" />
            </div>
            <div className="flex-col gap-0.5">
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user?.name || "Unknown User"}</span>
              <span className="text-muted text-xs">{user?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted text-xs">
            <Calendar size={12} />
            <span>{dateStr}</span>
          </div>
          {item.proofUrl ? (
            <a 
              href={item.proofUrl} 
              target="_blank" 
              style={{ 
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: "0.8rem", fontWeight: 600,
                color: "var(--brand-primary)", textDecoration: "none"
              }}
              className="hover:underline"
            >
              <FileImage size={14} />
              View Payment Receipt
              <ExternalLink size={12} />
            </a>
          ) : (
            <span style={{ 
              display: "flex", alignItems: "center", gap: 6,
              fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic"
            }}>
              <FileImage size={13} />
              Awaiting receipt upload from client
            </span>
          )}
        </div>

        {/* Amount */}
        <div style={{ 
          padding: "16px 24px", borderRadius: 12,
          background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          minWidth: 140, flexShrink: 0
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
            Amount
          </span>
          <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--brand-primary)", lineHeight: 1.1 }}>
            ₦{(amount || 0).toLocaleString()}
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>NGN</span>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div style={{ 
        padding: "14px 24px",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--surface-elevated)",
        display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px"
      }}>
        <button 
          className="btn btn-ghost gap-2"
          style={{ 
            color: "var(--brand-danger)", 
            border: "1px solid var(--brand-danger)",
            padding: "8px 20px"
          }}
          onClick={() => onAction(type, item.id, 'REJECT')}
          disabled={processing}
        >
          <X size={16} />
          Reject
        </button>
        <button 
          className="btn btn-primary gap-2"
          style={{ padding: "8px 24px" }}
          onClick={() => onAction(type, item.id, 'APPROVE')}
          disabled={processing}
        >
          {processing 
            ? <Loader2 className="animate-spin" size={16} /> 
            : <Check size={16} />
          }
          Approve Payment
        </button>
      </div>
    </div>
  );
}
