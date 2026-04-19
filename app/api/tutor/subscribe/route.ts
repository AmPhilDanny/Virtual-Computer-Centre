import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    // 1. Get Monthly Price from Settings
    const settings = await prisma.siteSettings.findUnique({
      where: { key: "TUTOR_MONTHLY_PRICE" }
    });
    const price = parseFloat(settings?.value || "5000");

    // 2. Fetch User Wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true }
    });

    if (!user || user.walletBalance < price) {
      return new NextResponse("Insufficient wallet balance. Please fund your wallet first.", { status: 400 });
    }

    // 3. Process Transaction & Subscription
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from wallet
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: price } }
      });

      // Create Wallet Transaction log
      await tx.walletTransaction.create({
        data: {
          userId,
          type: "DEBIT",
          amount: price,
          balanceAfter: updatedUser.walletBalance,
          reference: `SUB-${Date.now()}`,
          description: "AI Tutor Monthly Subscription"
        }
      });

      // Create/Update Subscription
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const sub = await tx.subscription.create({
        data: {
          userId,
          planType: "Tutor_Monthly",
          status: "ACTIVE",
          amount: price,
          reference: `TUTOR-SUB-${userId}-${Date.now()}`,
          expiresAt
        }
      });

      return sub;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[TUTOR_SUBSCRIBE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
