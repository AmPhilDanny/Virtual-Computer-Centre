import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { consentType } = body;

    const consent = await prisma.userConsent.create({
      data: {
        userId: (session?.user as any)?.id || null,
        consentType: consentType || "PRIVACY_POLICY",
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        browserAgent: req.headers.get("user-agent") || "unknown",
      }
    });

    return NextResponse.json(consent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to log consent" }, { status: 500 });
  }
}
