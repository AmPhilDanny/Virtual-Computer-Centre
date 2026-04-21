import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if marketplace is enabled globally
    const settings = await prisma.siteSettings.findUnique({ where: { key: "multiVendorEnabled" } });
    if (settings?.value !== "true") {
      return NextResponse.json([]);
    }

    const vendors = await prisma.vendorProfile.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        storeName: true,
        storeSlug: true,
        description: true,
        portfolioUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching public vendors:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
