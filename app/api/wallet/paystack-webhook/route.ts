import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-paystack-signature");

    // Fetch Paystack Secret Key from Settings
    const settings = await prisma.siteSettings.findMany({
      where: { key: "paystackSecretKey" }
    });
    const paystackKey = settings[0]?.value;

    if (!paystackKey) {
      console.error("Webhook Error: Paystack Secret Key missing in settings");
      return NextResponse.json({ error: "Configuration missing" }, { status: 500 });
    }

    // Verify Paystack Signature
    const hash = crypto
      .createHmac("sha512", paystackKey)
      .update(JSON.stringify(body))
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { event, data } = body;

    if (event === "charge.success") {
      const { amount, reference, metadata } = data;
      const userId = metadata.userId;
      const paidAmount = amount / 100;

      if (metadata.type === "WALLET_FUNDING") {
        // Atomic Balance Update & Transaction Log
        await prisma.$transaction(async (tx) => {
          const user = await tx.user.update({
            where: { id: userId },
            data: { walletBalance: { increment: paidAmount } }
          });

          await tx.walletTransaction.create({
            data: {
              userId,
              amount: paidAmount,
              balanceAfter: user.walletBalance,
              type: "CREDIT",
              reference: reference,
              description: "Wallet Funding via Paystack"
            }
          });
        });
      } else if (metadata.type === "order_payment") {
        const { orderId, walletDeducted } = metadata;

        await prisma.$transaction(async (tx) => {
          // 1. Deduct from wallet if mixed
          let currentBalanceAdjustment = 0;
          if (walletDeducted > 0) {
            const user = await tx.user.update({
              where: { id: userId },
              data: { walletBalance: { decrement: walletDeducted } }
            });
            currentBalanceAdjustment = user.walletBalance;

            await tx.walletTransaction.create({
              data: {
                userId,
                amount: walletDeducted,
                balanceAfter: currentBalanceAdjustment,
                type: "DEBIT",
                reference: `ORDER-PARTIAL-${orderId}`,
                description: `Partial payment (wallet) for Order #${orderId.slice(-6).toUpperCase()}`
              }
            });
          }

          // 2. Mark order as PAID
          await tx.order.update({
            where: { id: orderId },
            data: { 
              status: "PAID", 
              gateway: walletDeducted > 0 ? "MIXED" : "PAYSTACK",
              reference: reference
            }
          });

          // 3. Audit Log
          await tx.auditLog.create({
            data: {
              actor: "system",
              action: "ORDER_PAID",
              entity: "Order",
              entityId: orderId,
              metadata: { paidAmount, walletDeducted, reference }
            }
          });
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Handler Failed" }, { status: 500 });
  }
}
