import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "VENDOR" && (session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as any).id;

  try {
    const profile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    const { adminNotes } = await req.json();

    const job = await prisma.job.update({
      where: { id, vendorId: profile.id },
      data: {
        status: "REVIEW",
        adminNotes: adminNotes, // Use this for the deliverable summary/links
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Error submitting vendor work:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
