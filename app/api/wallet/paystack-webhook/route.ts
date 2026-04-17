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
      const fundedAmount = amount / 100; // Convert Kobo to Naira

      // Atomic Balance Update & Transaction Log
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id: userId },
          data: { walletBalance: { increment: fundedAmount } }
        });

        await tx.walletTransaction.create({
          data: {
            userId,
            amount: fundedAmount,
            balanceAfter: user.walletBalance,
            type: "CREDIT",
            reference: reference,
            description: "Wallet Funding via Paystack"
          }
        });

        // Audit Log
        await tx.auditLog.create({
          data: {
            actor: "system",
            action: "WALLET_FUNDED",
            entity: "User",
            entityId: userId,
            metadata: { amount: fundedAmount, reference }
          }
        });
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Handler Failed" }, { status: 500 });
  }
}
