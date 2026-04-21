import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "VENDOR" && (session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const profile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    const [totalJobs, escrowJobs, activeServices] = await Promise.all([
      prisma.job.count({ where: { vendorId: profile.id } }),
      prisma.job.findMany({ 
        where: { vendorId: profile.id, fundsInEscrow: true },
        include: { order: { select: { total: true } } }
      }),
      prisma.service.count({ where: { vendorId: profile.id, approvalStatus: "APPROVED" } }),
    ]);

    const escrowBalance = escrowJobs.reduce((acc, job) => acc + (job.order?.total || 0), 0);

    const recentJobs = await prisma.job.findMany({
      where: { vendorId: profile.id },
      include: { service: { select: { name: true } }, order: { select: { total: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        storeName: profile.storeName,
        walletBalance: (session.user as any).walletBalance || 0, // Fallback, usually fetched from User
        totalJobs,
        escrowBalance,
        activeServices,
      },
      recentJobs,
    });
  } catch (error) {
    console.error("Error fetching vendor stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
