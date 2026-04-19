import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.walletTransaction.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
    });

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { walletBalance: true },
    });

    return NextResponse.json({
      balance: user?.walletBalance || 0,
      transactions,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wallet status" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, gateway } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Fetch site settings for payment configurations
    const siteSettings = await prisma.siteSettings.findMany({
      where: { 
        key: { in: ["paystackSecretKey", "flutterwaveSecretKey", "bankName", "accountName", "accountNumber"] } 
      }
    });

    const settingsMap = siteSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    if (gateway === "MANUAL") {
      // Check for existing pending transaction for this user and amount to prevent duplicates
      const existingPending = await prisma.walletTransaction.findFirst({
          where: {
              userId: (session.user as any).id,
              amount: amount,
              status: "PENDING",
              gateway: "MANUAL"
          }
      });

      if (existingPending) {
          return NextResponse.json({ 
              success: true, 
              message: "You already have a pending funding request for this amount. Please wait for verification.",
              transaction: existingPending
          });
      }

      // Create a PENDING transaction for manual verification
      const transaction = await prisma.walletTransaction.create({
        data: {
          userId: (session.user as any).id,
          amount: amount,
          balanceAfter: (session.user as any).walletBalance || 0, // Doesn't change yet
          type: "CREDIT",
          status: "PENDING",
          gateway: "MANUAL",
          reference: `MAN-${Date.now()}`,
          description: `Manual Wallet Funding (Pending Verification)`
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: "Funding request submitted. Please complete the transfer and wait for admin verification.",
        transaction
      });
    }

    if (gateway === "paystack") {
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
          email: session.user.email,
          amount: Math.round(amount * 100), // Kobo
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?status=success`,
          metadata: {
            userId: (session.user as any).id,
            type: "WALLET_FUNDING",
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
      } else {
        return NextResponse.json({ error: data.message || "Paystack initialization failed" }, { status: 400 });
      }
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
          tx_ref: `WLT-FLW-${Date.now()}`,
          amount: amount,
          currency: "NGN",
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?status=success`,
          customer: {
            email: session.user.email,
            name: session.user.name || "Client",
          },
          meta: {
            userId: (session.user as any).id,
            type: "WALLET_FUNDING",
            gateway: "flutterwave"
          },
          customizations: {
            title: "Wallet Funding",
            description: `Funding wallet with ₦${amount}`,
          }
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        return NextResponse.json({ 
          authorization_url: data.data.link,
          reference: data.data.tx_ref
        });
      } else {
        return NextResponse.json({ error: data.message || "Flutterwave initialization failed" }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Invalid payment gateway" }, { status: 400 });

  } catch (error) {
    console.error("Wallet topup error:", error);
    return NextResponse.json({ error: "Failed to initiate top-up" }, { status: 500 });
  }
}
