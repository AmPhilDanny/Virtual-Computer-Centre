import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/jobs/[id] — Fetch full job detail
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      service: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
      order: true,
      revisions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });
  return NextResponse.json(job);
}

// PATCH /api/admin/jobs/[id] — Update status, admin notes, deliverable
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { 
    status, 
    adminNotes, 
    aiOutput, 
    attachments, 
    aiScore,
    grammarScore,
    plagiarismScore,
    isPlagiarismFree
  } = body;

  const updated = await prisma.job.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      ...(aiOutput !== undefined ? { aiOutput } : {}),
      ...(attachments !== undefined ? { attachments } : {}),
      ...(aiScore !== undefined ? { aiScore: parseFloat(aiScore) } : {}),
      ...(grammarScore !== undefined ? { grammarScore: parseFloat(grammarScore) } : {}),
      ...(plagiarismScore !== undefined ? { plagiarismScore: parseFloat(plagiarismScore) } : {}),
      ...(isPlagiarismFree !== undefined ? { isPlagiarismFree } : {}),
      ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
    },
  });

  // Send notification if job was just completed
  if (status === "COMPLETED") {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, name: true, phone: true } },
        service: { select: { name: true } },
        order: { select: { total: true } },
      },
    });
    if (job) {
      // 1. Send Notification
      import("@/lib/notifications").then((n) =>
        n.sendNotification({
          toEmail: job.user.email || undefined,
          toPhone: job.user.phone || undefined,
          subject: `Your Order is Ready: ${job.title}`,
          event: "AI_COMPLETED",
          data: {
            job_id: job.id,
            job_title: job.title,
            customer_name: job.user.name || "Customer",
            service_name: job.service.name,
            status: "COMPLETED",
          },
        })
      ).catch(console.error);

      // 2. Marketplace Payout Logic
      if (job.vendorId && job.fundsInEscrow) {
        await prisma.$transaction(async (tx) => {
          // Fetch commission rate
          const settings = await tx.siteSettings.findUnique({ where: { key: "vendorCommission" } });
          const commissionPercentage = settings ? parseFloat(settings.value) : 20;
          const vendorShare = 1 - (commissionPercentage / 100);
          const payoutAmount = (job.order?.total || 0) * vendorShare;

          // Credit vendor wallet
          const vendorProfile = await tx.vendorProfile.findUnique({ 
            where: { id: job.vendorId! },
            include: { user: true }
          });

          if (vendorProfile) {
            await tx.user.update({
              where: { id: vendorProfile.userId },
              data: { walletBalance: { increment: payoutAmount } },
            });

            await tx.vendorProfile.update({
              where: { id: vendorProfile.id },
              data: { totalEarnings: { increment: payoutAmount } },
            });

            await tx.walletTransaction.create({
              data: {
                userId: vendorProfile.userId,
                type: "CREDIT",
                amount: payoutAmount,
                balanceAfter: (vendorProfile.user.walletBalance || 0) + payoutAmount,
                reference: `ADMIN_PAYOUT_${job.id}`,
                description: `Admin-triggered payout for job #${job.id.substring(0, 8)}`,
                status: "SUCCESS",
              }
            });

            // Release escrow
            await tx.job.update({
              where: { id: job.id },
              data: { fundsInEscrow: false }
            });
          }
        });
      }
    }
  }

  return NextResponse.json(updated);
}
