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

    // Fetch Paystack Secret Key from Settings
    const settings = await prisma.siteSettings.findMany({
      where: { key: "paystackSecretKey" }
    });
    const paystackKey = settings[0]?.value;

    if (!paystackKey && gateway === "paystack") {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    // Initiate Paystack Transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: amount * 100, // Paystack uses Kobo
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?status=success`,
        metadata: {
          userId: (session.user as any).id,
          type: "WALLET_FUNDING"
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

  } catch (error) {
    console.error("Wallet topup error:", error);
    return NextResponse.json({ error: "Failed to initiate top-up" }, { status: 500 });
  }
}
