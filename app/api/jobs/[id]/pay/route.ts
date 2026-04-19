import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const { paymentMethod, walletAmount } = await req.json();

    const job = await prisma.job.findUnique({
      where: { id },
      include: { order: true, user: true }
    });

    if (!job || job.userId !== userId) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!job.order || job.order.status === "PAID") {
      return NextResponse.json({ error: "No pending order found for this job" }, { status: 400 });
    }

    const order = job.order;
    const totalAmount = order.total;

    // Fetch Paystack Secret Key from Settings
    const settings = await prisma.siteSettings.findMany({
      where: { key: "paystackSecretKey" }
    });
    const paystackKey = settings[0]?.value;

    if (paymentMethod === "WALLET") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.walletBalance < totalAmount) {
        return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
      }

      // Deduct from wallet and mark as paid
      await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { walletBalance: { decrement: totalAmount } }
        });

        await tx.order.update({
          where: { id: order.id },
          data: { status: "PAID", gateway: "WALLET" }
        });

        await tx.walletTransaction.create({
          data: {
            userId,
            amount: totalAmount,
            balanceAfter: updatedUser.walletBalance,
            type: "DEBIT",
            reference: `ORDER-${order.id}`,
            description: `Payment for Order #${order.id.slice(-6).toUpperCase()}`
          }
        });
      });

      return NextResponse.json({ success: true, message: "Payment successful" });
    }

    if (paymentMethod === "MIXED" || paymentMethod === "DIRECT") {
      let amountToPayViaGateway = totalAmount;
      let walletDeducted = 0;

      if (paymentMethod === "MIXED" && walletAmount > 0) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.walletBalance < walletAmount) {
          return NextResponse.json({ error: "Insufficient wallet balance for partial payment" }, { status: 400 });
        }
        
        walletDeducted = Math.min(walletAmount, totalAmount - 1); // Ensure at least ₦1 for gateway
        amountToPayViaGateway = totalAmount - walletDeducted;
      }

      // Initialize Paystack for the (remaining) amount
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: job.user.email,
          amount: Math.round(amountToPayViaGateway * 100), // Kobo
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${job.id}?payment=success`,
          metadata: {
            userId,
            orderId: order.id,
            jobId: job.id,
            walletDeducted,
            type: "order_payment"
          }
        }),
      });

      const data = await response.json();

      if (data.status) {
        // If wallet deduction is involved, we don't deduct it yet.
        // We'll deduct it in the webhook only when the gateway payment succeeds.
        return NextResponse.json({ 
          authorization_url: data.data.authorization_url,
          reference: data.data.reference
        });
      } else {
        return NextResponse.json({ error: data.message || "Gateway initialization failed" }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });

  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
