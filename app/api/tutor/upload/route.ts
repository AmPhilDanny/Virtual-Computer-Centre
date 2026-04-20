import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    let bodyData;
    try {
      bodyData = await req.json();
    } catch (e) {
      return new NextResponse("Invalid JSON format", { status: 400 });
    }

    const { url, title, type = "READING" } = bodyData;

    if (!url) {
      return new NextResponse("No file URL provided", { status: 400 });
    }

    // 1. Fetch the file buffer from Vercel Blob into memory
    const blobRes = await fetch(url);
    if (!blobRes.ok) {
       return new NextResponse("Failed to download file from blob storage.", { status: 400 });
    }

    const arrayBuffer = await blobRes.arrayBuffer();
    
    // Safety check for memory limit (5MB)
    if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
       return new NextResponse("File too large. Maximum supported size for text extraction is 5MB.", { status: 400 });
    }

    const buffer = Buffer.from(arrayBuffer);
    
    // 2. Extract Text for AI Knowledge
    const fileType = url.split('.').pop() || "pdf"; // Naive type extraction based on extension
    let mimeType = "text/plain";
    if (fileType.toLowerCase() === "pdf") mimeType = "application/pdf";
    else if (fileType.toLowerCase() === "docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    let textContent = "";
    try {
       textContent = await extractText(buffer, mimeType);
    } catch (extractionError) {
       console.error("[TEXT_EXTRACTION_ERROR]", extractionError);
       // We still continue without text if extraction fails
    }

    // 3. Save to database
    const material = await prisma.studyMaterial.create({
      data: {
        userId,
        title,
        fileUrl: url,
        fileType: type,
        extractedText: textContent || ""
      }
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error("[TUTOR_UPLOAD_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
