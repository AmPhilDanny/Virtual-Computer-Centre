import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const orders = await prisma.job.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: { service: true }
  });

  return (
    <div className="glass-card" style={{ padding: "var(--space-6)" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-6)" }}>Your Order History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center" style={{ padding: "var(--space-12) 0" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>📂</div>
          <p className="text-muted">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.service.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>#{order.id.slice(-6)}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${
                      order.status === "COMPLETED" ? "success" : 
                      order.status === "CANCELLED" ? "danger" : "warning"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>₦{order.service.price || "0.00"}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
