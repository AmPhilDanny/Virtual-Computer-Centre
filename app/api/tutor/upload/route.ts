import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { extractText } from "@/lib/tutor/extraction";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    // Check document limit (12)
    const docCount = await prisma.studyMaterial.count({
      where: { userId }
    });

    if (docCount >= 12) {
      return new NextResponse("Document limit reached (Maximum 12 files).", { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string || file.name;
    const type = formData.get("type") as string || "READING"; // TEXTBOOK | CURRICULUM | READING

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // 1. Upload to Vercel Blob
    const blob = await put(`tutor/${userId}/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    // 2. Extract Text for AI Knowledge
    const buffer = Buffer.from(await file.arrayBuffer());
    const textContent = await extractText(buffer, file.type);

    // 3. Save to database
    const material = await prisma.studyMaterial.create({
      data: {
        userId,
        title,
        fileUrl: blob.url,
        fileType: type,
        extractedText: textContent
      }
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error("[TUTOR_UPLOAD]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
