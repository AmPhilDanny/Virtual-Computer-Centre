import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { storeName, storeSlug, description, portfolioUrl } = await req.json();

    if (!storeName || !storeSlug || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if slug is unique
    const existing = await prisma.vendorProfile.findUnique({
      where: { storeSlug },
    });

    if (existing) {
      return NextResponse.json({ error: "Store slug already taken" }, { status: 400 });
    }

    // Create the vendor profile
    const profile = await prisma.vendorProfile.create({
      data: {
        userId: (session.user as any).id,
        storeName,
        storeSlug,
        description,
        portfolioUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error submitting vendor application:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
