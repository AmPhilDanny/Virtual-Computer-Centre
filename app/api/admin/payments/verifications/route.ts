import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // DEBUG LOG: Start fetching
    console.log("[ADMIN_VERIFY] Fetching pending payments...");

    // Fetch pending wallet transactions
    const walletPending = await prisma.walletTransaction.findMany({
      where: { 
        status: "PENDING",
        type: "CREDIT"
      },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });

    // Fetch ALL pending orders and filter manually to be case-insensitive and catch nulls
    const allPendingOrders = await prisma.order.findMany({
      where: { status: "PENDING" },
      include: { user: { select: { name: true, email: true } }, job: true },
      orderBy: { createdAt: "desc" }
    });

    // Filter for Manual orders (Case-insensitive)
    const manualOrders = allPendingOrders.filter(order => {
        const gateway = (order.gateway || "").toUpperCase();
        return gateway === "MANUAL" || gateway === ""; // Allow empty gateway for legacy manual notifications
    });

    console.log(`[ADMIN_VERIFY] Found ${walletPending.length} wallet requests and ${manualOrders.length} manual orders.`);

    return NextResponse.json({
      walletPending,
      manualOrders
    });
  } catch (error) {
    console.error("[ADMIN_VERIFY] GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch verifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmail = session.user.email || "system@admin";
    const { type, id, action } = await req.json(); // type: 'WALLET' or 'ORDER', action: 'APPROVE' or 'REJECT'

    if (action === "APPROVE") {
      if (type === "WALLET") {
        await prisma.$transaction(async (tx) => {
          const transaction = await tx.walletTransaction.findUnique({
            where: { id },
            include: { user: true }
          });

          if (!transaction || transaction.status !== "PENDING") {
             throw new Error("Transaction not found or already processed");
          }

          // Update user balance
          const updatedUser = await tx.user.update({
            where: { id: transaction.userId },
            data: { walletBalance: { increment: transaction.amount } }
          });

          // Mark transaction as success
          await tx.walletTransaction.update({
            where: { id },
            data: { 
                status: "SUCCESS",
                balanceAfter: updatedUser.walletBalance
            }
          });

          // Audit log
          await tx.auditLog.create({
            data: {
              actor: adminEmail,
              action: "APPROVE_WALLET_FUNDING",
              entity: "WalletTransaction",
              entityId: id,
              metadata: { amount: transaction.amount, userId: transaction.userId }
            }
          });
        });
      } else if (type === "ORDER") {
        await prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({
            where: { id },
            include: { user: true }
          });

          if (!order || order.status !== "PENDING") {
            throw new Error("Order not found or already processed");
          }

          // Mark order as paid
          await tx.order.update({
            where: { id },
            data: { status: "PAID" }
          });

          // Log in wallet history (Credit then Debit)
          const balance = order.user.walletBalance;
          
          await tx.walletTransaction.create({
            data: {
              userId: order.userId,
              amount: order.total,
              balanceAfter: balance,
              type: "CREDIT",
              status: "SUCCESS",
              reference: `IN-MAN-${order.id}`,
              description: `Manual Payment Verified for Order #${order.id.slice(-6).toUpperCase()}`
            }
          });

          await tx.walletTransaction.create({
            data: {
              userId: order.userId,
              amount: order.total,
              balanceAfter: balance,
              type: "DEBIT",
              status: "SUCCESS",
              reference: `OUT-MAN-${order.id}`,
              description: `Service Payment for Order #${order.id.slice(-6).toUpperCase()}`
            }
          });

          // Audit log
          await tx.auditLog.create({
            data: {
              actor: adminEmail,
              action: "APPROVE_ORDER_PAYMENT",
              entity: "Order",
              entityId: id,
              metadata: { amount: order.total, userId: order.userId }
            }
          });
        });
      }
    } else {
      // REJECT
      if (type === "WALLET") {
        await prisma.walletTransaction.update({
          where: { id },
          data: { status: "FAILED" }
        });
      } else if (type === "ORDER") {
        await prisma.order.update({
          where: { id },
          data: { status: "FAILED" }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process verification" }, { status: 500 });
  }
}
