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

    const { url, title, type = "READING" } = await req.json();

    if (!url) {
      return new NextResponse("No file URL provided", { status: 400 });
    }

    // 1. Fetch the file buffer from Vercel Blob into memory
    const blobRes = await fetch(url);
    const buffer = Buffer.from(await blobRes.arrayBuffer());
    
    // 2. Extract Text for AI Knowledge
    const fileType = url.split('.').pop() || "pdf"; // Naive type extraction based on extension
    const mimeType = fileType.toLowerCase() === "pdf" ? "application/pdf" : 
                     fileType.toLowerCase() === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : 
                     "text/plain";

    const textContent = await extractText(buffer, mimeType);

    // 3. Save to database
    const material = await prisma.studyMaterial.create({
      data: {
        userId,
        title,
        fileUrl: url,
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
