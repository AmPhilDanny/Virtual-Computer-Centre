import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const storeName = formData.get("storeName") as string;
    const storeSlug = formData.get("storeSlug") as string;
    const description = formData.get("description") as string;
    const portfolioUrl = formData.get("portfolioUrl") as string;
    const fullName = formData.get("fullName") as string;
    const address = formData.get("address") as string;
    
    const idProofFile = formData.get("idProof") as File;
    const resumeFile = formData.get("resume") as File;

    if (!storeName || !storeSlug || !description || !fullName || !address) {
      return NextResponse.json({ error: "Missing required profile fields" }, { status: 400 });
    }

    if (!idProofFile || !resumeFile) {
      return NextResponse.json({ error: "ID Proof and Resume are required for verification" }, { status: 400 });
    }

    // Check if slug is unique
    const existing = await prisma.vendorProfile.findUnique({
      where: { storeSlug },
    });

    if (existing) {
      return NextResponse.json({ error: "Store slug already taken" }, { status: 400 });
    }

    // Process ID Proof
    const idBytes = await idProofFile.arrayBuffer();
    const idBuffer = Buffer.from(idBytes);
    const idBase64 = `data:${idProofFile.type};base64,${idBuffer.toString("base64")}`;

    // Process Resume
    const resumeBytes = await resumeFile.arrayBuffer();
    const resumeBuffer = Buffer.from(resumeBytes);
    const resumeBase64 = `data:${resumeFile.type};base64,${resumeBuffer.toString("base64")}`;

    // Create the vendor profile
    const profile = await prisma.vendorProfile.create({
      data: {
        userId: (session.user as any).id,
        storeName,
        storeSlug,
        description,
        portfolioUrl,
        fullName,
        address,
        idProofUrl: idBase64,
        resumeUrl: resumeBase64,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error submitting vendor application:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
