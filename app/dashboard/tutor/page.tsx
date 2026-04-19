import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TutorClient from "./TutorClient";

export default async function TutorPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = (session.user as any).id;

  // 1. Fetch User Data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      studentProfile: true,
    }
  });

  // 2. Fetch Subscription
  const subscription = await prisma.subscription.findFirst({
    where: { 
      userId,
      status: "ACTIVE",
      expiresAt: { gt: new Date() }
    }
  });

  // 3. Fetch Materials
  const materials = await prisma.studyMaterial.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <TutorClient 
      materials={materials} 
      subscription={subscription} 
      user={user} 
    />
  );
}
