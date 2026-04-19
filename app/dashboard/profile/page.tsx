import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      role: true,
      studentProfile: true, // { bio, academicLevel, occupation, learningStyle, interests }
    }
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Your <span className="text-gradient">Profile</span></h1>
          <p className="text-secondary">Complete your details to personalize your AI tutoring experience.</p>
        </div>
        <div className="glass-card flex items-center gap-4" style={{ padding: "var(--space-3) var(--space-6)" }}>
           <div 
             style={{ 
               width: 48, height: 48, borderRadius: "50%", 
               background: "var(--grad-primary)", 
               display: "flex", alignItems: "center", justifyContent: "center",
               fontSize: "1.25rem", fontWeight: 900, color: "#fff"
             }}
           >
             {(user.name || user.email || "U").charAt(0).toUpperCase()}
           </div>
           <div>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>{user.name || "User"}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{user.role} Account</div>
           </div>
        </div>
      </div>

      <ProfileForm initialUser={user} />
    </div>
  );
}
