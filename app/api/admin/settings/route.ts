import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const updates: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Handle file upload
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename
        const filename = `${Date.now()}-${value.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
        const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
        
        await writeFile(uploadPath, buffer);
        updates[key] = `/uploads/${filename}`;
      } else if (typeof value === "string") {
        updates[key] = value;
      }
    }

    // Update settings in database
    const updatePromises = Object.entries(updates).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
