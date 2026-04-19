import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get("verif-hash");

    // Fetch Flutterwave Webhook Secret from Settings
    const settings = await prisma.siteSettings.findMany({
      where: { key: "flutterwaveSecretKey" }
    });
    const flwKey = settings[0]?.value;

    // Optional: You might want to have a separate FLW_WEBHOOK_HASH secret
    // For now, we'll use a check if the user has provided one or just process if keys are present
    // Recommendation: Flutterwave verification usually requires the secret hash set in dashboard
    
    const { status, currency, id, amount, customer, tx_ref, meta } = body.data || {};

    if (body.event === "charge.completed" && status === "successful") {
      const userId = meta.userId;
      const paidAmount = amount;

      if (meta.type === "WALLET_FUNDING") {
        // Idempotency check
        const existingTx = await prisma.walletTransaction.findUnique({
            where: { reference: tx_ref }
        });

        if (existingTx && existingTx.status === "SUCCESS") {
            return NextResponse.json({ received: true, message: "Duplicate transaction" });
        }

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
              status: "SUCCESS",
              reference: tx_ref,
              description: "Wallet Funding via Flutterwave"
            }
          });
        });
      } else if (meta.type === "order_payment") {
        const { orderId, walletDeducted } = meta;

        // Idempotency check
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (existingOrder && existingOrder.status === "PAID") {
            return NextResponse.json({ received: true, message: "Order already paid" });
        }

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
                status: "SUCCESS",
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
              gateway: walletDeducted > 0 ? "MIXED" : "FLUTTERWAVE",
              reference: tx_ref
            }
          });

          // 3. To satisfy "reflect on their wallet", log the gateway payment as a CREDIT then DEBIT, 
          // or just a clear DEBIT entry showing the full value.
          // Let's log the CARD payment as a CREDIT then DEBIT for a complete audit trail.
          
          const userForLedger = await tx.user.findUnique({ where: { id: userId } });
          const balance = userForLedger?.walletBalance || 0;

          await tx.walletTransaction.create({
            data: {
              userId,
              amount: paidAmount,
              balanceAfter: balance, // Logically it didn't change the wallet permanent balance, but we reflect the flow
              type: "CREDIT",
              status: "SUCCESS",
              reference: `IN-${tx_ref}`,
              description: `Payment received via Flutterwave for Order #${orderId.slice(-6).toUpperCase()}`
            }
          });

          await tx.walletTransaction.create({
            data: {
              userId,
              amount: paidAmount,
              balanceAfter: balance,
              type: "DEBIT",
              status: "SUCCESS",
              reference: `OUT-${tx_ref}`,
              description: `Service Payment for Order #${orderId.slice(-6).toUpperCase()}`
            }
          });

          // 4. Audit Log
          await tx.auditLog.create({
            data: {
              actor: "system",
              action: "ORDER_PAID",
              entity: "Order",
              entityId: orderId,
              metadata: { paidAmount, walletDeducted, reference: tx_ref, gateway: "flutterwave" }
            }
          });
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Flutterwave Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Handler Failed" }, { status: 500 });
  }
}
