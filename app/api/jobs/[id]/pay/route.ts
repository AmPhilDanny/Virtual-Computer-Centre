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
    const { paymentMethod, walletAmount, gateway } = await req.json();

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

    // Fetch site settings
    const siteSettings = await prisma.siteSettings.findMany({
      where: { 
        key: { in: ["paystackSecretKey", "flutterwaveSecretKey"] } 
      }
    });

    const settingsMap = siteSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

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

    if (paymentMethod === "MANUAL") {
      // Check if order is already PAID or handled
      if (order.status === "PAID") {
          return NextResponse.json({ error: "Order is already paid" }, { status: 400 });
      }

      if (order.status === "PENDING" && order.gateway === "MANUAL") {
          return NextResponse.json({ 
            success: true, 
            message: "You have already notified us of this transfer. We are currently verifying it." 
          });
      }

      // Mark as pending manual verification
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          gateway: "MANUAL",
          status: "PENDING",
          metadata: { 
            ...(order.metadata as any || {}), 
            manualNotifyAt: new Date().toISOString() 
          }
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: "Payment notification received. Please wait for admin verification." 
      });
    }

    if (paymentMethod === "MIXED" || paymentMethod === "DIRECT") {
      let amountToPayViaGateway = totalAmount;
      let walletDeducted = 0;

      if (paymentMethod === "MIXED" && walletAmount > 0) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.walletBalance < walletAmount) {
          return NextResponse.json({ error: "Insufficient wallet balance for partial payment" }, { status: 400 });
        }
        
        walletDeducted = Math.min(walletAmount, totalAmount - 1); 
        amountToPayViaGateway = totalAmount - walletDeducted;
      }

      if (gateway === "flutterwave") {
        const flwKey = settingsMap.flutterwaveSecretKey;
        if (!flwKey) {
            return NextResponse.json({ error: "Flutterwave is not configured" }, { status: 500 });
        }

        const response = await fetch("https://api.flutterwave.com/v3/payments", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${flwKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tx_ref: `ORD-${order.id.slice(-6)}-${Date.now()}`,
              amount: amountToPayViaGateway,
              currency: "NGN",
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${job.id}?payment=success`,
              customer: {
                email: job.user.email,
                name: job.user.name || "Client",
              },
              meta: {
                userId,
                orderId: order.id,
                jobId: job.id,
                walletDeducted,
                type: "order_payment",
                gateway: "flutterwave"
              },
              customizations: {
                title: job.title,
                description: `Payment for Order #${order.id.slice(-6).toUpperCase()}`,
              }
            }),
        });

        const data = await response.json();
        if (data.status === "success") {
            return NextResponse.json({ 
                authorization_url: data.data.link,
                reference: data.data.tx_ref
            });
        }
        throw new Error(data.message || "Flutterwave initialization failed");
      }

      // Default to Paystack
      const paystackKey = settingsMap.paystackSecretKey;
      if (!paystackKey) {
        return NextResponse.json({ error: "Paystack is not configured" }, { status: 500 });
      }

      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: job.user.email,
          amount: Math.round(amountToPayViaGateway * 100),
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${job.id}?payment=success`,
          metadata: {
            userId,
            orderId: order.id,
            jobId: job.id,
            walletDeducted,
            type: "order_payment",
            gateway: "paystack"
          }
        }),
      });

      const data = await response.json();
      if (data.status) {
        return NextResponse.json({ 
          authorization_url: data.data.authorization_url,
          reference: data.data.reference
        });
      }
      throw new Error(data.message || "Paystack initialization failed");
    }

    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });

  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to process payment" }, { status: 500 });
  }
}
