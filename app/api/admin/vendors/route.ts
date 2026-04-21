import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalVendors, pendingApps, activeEscrows, pendingPayouts] = await Promise.all([
      prisma.vendorProfile.count({ where: { status: "APPROVED" } }),
      prisma.vendorProfile.count({ where: { status: "PENDING" } }),
      prisma.job.count({ where: { fundsInEscrow: true } }),
      prisma.payoutRequest.count({ where: { status: "PENDING" } }),
    ]);

    const applications = await prisma.vendorProfile.findMany({
      where: { status: "PENDING" },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    });

    const payouts = await prisma.payoutRequest.findMany({
      include: { vendor: { select: { storeName: true } } },
      orderBy: { createdAt: "desc" },
    });

    const services = await prisma.service.findMany({
      where: { vendorId: { not: null } },
      include: { vendor: { select: { storeName: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      stats: {
        totalVendors,
        pendingApps,
        activeEscrows,
        pendingPayouts,
      },
      applications,
      payouts,
      services,
    });
  } catch (error) {
    console.error("Error fetching admin vendor data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
