import { prisma } from "@/lib/prisma";
import { Users, Mail, UserPlus, Trash2, ShieldCheck, ChevronRight } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="glass-card" style={{ padding: "var(--space-8)" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-8)" }}>
        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>System Users & Clients</h2>
        <button className="btn btn-primary btn-sm">
          <UserPlus size={16} /> Add User
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{user.name || "Unknown"}</div>
                  <div className="flex items-center gap-2 text-muted" style={{ fontSize: "0.75rem" }}>
                    <Mail size={12} /> {user.email}
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'danger' : 'primary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="flex gap-2">
                   <button className="btn btn-ghost btn-sm" style={{ padding: "var(--space-2)" }}>
                      <ShieldCheck size={16} />
                   </button>
                   <button className="btn btn-ghost btn-sm" style={{ padding: "var(--space-2)", color: "var(--brand-danger)" }}>
                      <Trash2 size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
