import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as any).id;

  try {
    const job = await prisma.job.findUnique({
      where: { id, userId },
      include: { 
        order: { select: { total: true } },
        vendor: { include: { user: true } } 
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status === "COMPLETED") {
      return NextResponse.json({ error: "Job already completed" }, { status: 400 });
    }

    // Update job status to COMPLETED and release escrow
    const updatedJob = await prisma.$transaction(async (tx) => {
      // 1. Mark job as completed
      const updated = await tx.job.update({
        where: { id },
        data: { 
          status: "COMPLETED", 
          completedAt: new Date(),
          fundsInEscrow: false 
        },
      });

      // 2. If it's a vendor job, transfer funds to vendor wallet
      if (job.vendorId && job.vendor) {
        // Fetch commission rate from settings
        const settings = await tx.siteSettings.findUnique({ where: { key: "vendorCommission" } });
        const commissionPercentage = settings ? parseFloat(settings.value) : 20; // Default 20%
        const vendorShare = 1 - (commissionPercentage / 100);
        const payoutAmount = (job.order?.total || 0) * vendorShare;

        // Credit vendor wallet
        await tx.user.update({
          where: { id: job.vendor.userId },
          data: { 
            walletBalance: { increment: payoutAmount }
          },
        });

        // Track earning in vendor profile
        await tx.vendorProfile.update({
          where: { id: job.vendorId },
          data: { totalEarnings: { increment: payoutAmount } },
        });

        // Record transaction
        await tx.walletTransaction.create({
          data: {
            userId: job.vendor.userId,
            type: "CREDIT",
            amount: payoutAmount,
            balanceAfter: (job.vendor.user.walletBalance || 0) + payoutAmount,
            reference: `JOB_PAYOUT_${job.id}`,
            description: `Marketplace payout for job #${job.id.substring(0, 8)}`,
            status: "SUCCESS",
          }
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error("Error accepting job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
