import { NextRequest, NextResponse } from "next/server";
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

    const payouts = await prisma.payoutRequest.findMany({
      where: { vendorId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    // For simplicity, we use the user's walletBalance as the withdrawable amount.
    // In a production app, we would verify this against completed job earnings.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });

    return NextResponse.json({
      earnings: user?.walletBalance || 0,
      lifetimeEarnings: profile.totalEarnings,
      payouts,
    });
  } catch (error) {
    console.error("Error fetching vendor payouts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const { amount, bankName, accountNumber, accountName } = await req.json();

    if (!amount || !bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });

    if (!user || user.walletBalance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Process payout request in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct from user's wallet immediately (Escrow release -> Wallet -> Withdrawal request)
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: amount } },
      });

      // 2. Create payout record
      return await tx.payoutRequest.create({
        data: {
          vendorId: profile.id,
          amount,
          bankName,
          accountNumber,
          accountName,
          status: "PENDING",
        },
      });
    });

    return NextResponse.json({ success: true, payout: result });
  } catch (error) {
    console.error("Error processing vendor payout request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
