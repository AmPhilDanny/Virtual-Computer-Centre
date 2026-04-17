import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
const pdf = require("pdf-parse");
import mammoth from "mammoth";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const datasets = await prisma.dataset.findMany({
      include: { service: { select: { name: true } } },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(datasets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const serviceId = formData.get("serviceId") as string || null;

    if (!file || !name) {
      return NextResponse.json({ error: "File and name are required" }, { status: 400 });
    }

    // 1. ArrayBuffer for extraction
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedContent = "";

    // 2. Extract text based on type
    try {
      if (file.type === "application/pdf") {
        const data = await pdf(buffer);
        extractedContent = data.text;
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth.extractRawText({ buffer });
        extractedContent = result.value;
      } else if (file.type === "text/plain" || file.type === "text/csv") {
        extractedContent = buffer.toString("utf-8");
      } else {
        // Fallback for unknown types if manageable as text
        extractedContent = buffer.toString("utf-8").slice(0, 50000); 
      }
    } catch (parseError) {
      console.error("Extraction error:", parseError);
      extractedContent = "[Error extracting text from file]";
    }

    // 3. Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    });

    // 4. Save to DB
    const dataset = await prisma.dataset.create({
      data: {
        name,
        fileUrl: blob.url,
        fileType: file.type,
        size: file.size,
        content: extractedContent,
        serviceId: serviceId === "global" ? null : serviceId,
      }
    });

    return NextResponse.json(dataset);
  } catch (error) {
    console.error("Dataset upload error:", error);
    return NextResponse.json({ error: "Failed to process dataset" }, { status: 500 });
  }
}
