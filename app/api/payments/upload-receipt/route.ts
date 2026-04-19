import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const type = formData.get("type"); // 'WALLET' or 'ORDER'
    const id = formData.get("id") as string;
    const file = formData.get("receipt") as File;

    if (!id || !file || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";
    const base64 = buffer.toString("base64");
    const proofUrl = `data:${mimeType};base64,${base64}`;

    if (type === "WALLET") {
        const tx = await prisma.walletTransaction.findUnique({
            where: { id }
        });

        if (!tx || tx.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (tx.proofUrl) {
            return NextResponse.json({ error: "Proof of payment has already been uploaded." }, { status: 400 });
        }

        await prisma.walletTransaction.update({
            where: { id },
            data: { proofUrl }
        });
    } else if (type === "ORDER") {
        const order = await prisma.order.findUnique({
            where: { id }
        });

        if (!order || order.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.proofUrl) {
            return NextResponse.json({ error: "Proof of payment has already been uploaded." }, { status: 400 });
        }

        await prisma.order.update({
            where: { id },
            data: { proofUrl }
        });
    }

    return NextResponse.json({ success: true, message: "Receipt uploaded successfully" });

  } catch (error) {
    console.error("Receipt upload error:", error);
    return NextResponse.json({ error: "Failed to upload receipt" }, { status: 500 });
  }
}
