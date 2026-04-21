import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payoutId, action } = await req.json();

    if (action === "PAID") {
      await prisma.payoutRequest.update({
        where: { id: payoutId },
        data: { status: "PAID" },
      });
      return NextResponse.json({ success: true, message: "Payout marked as paid" });
    }

    if (action === "REJECT") {
      // Logic for rejection might involve returning funds to vendor wallet, 
      // but for manual simplicity we just update status.
      await prisma.payoutRequest.update({
        where: { id: payoutId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "Payout rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing payout:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
