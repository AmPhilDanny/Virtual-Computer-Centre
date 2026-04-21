import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { vendorId, action } = await req.json();

    if (action === "APPROVE") {
      const vendor = await prisma.vendorProfile.update({
        where: { id: vendorId },
        data: { status: "APPROVED" },
        include: { user: true },
      });

      // Update the user's role to VENDOR
      await prisma.user.update({
        where: { id: vendor.userId },
        data: { role: "VENDOR" },
      });

      return NextResponse.json({ success: true, message: "Vendor approved" });
    }

    if (action === "REJECT") {
      await prisma.vendorProfile.update({
        where: { id: vendorId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "Vendor rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error approving vendor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
