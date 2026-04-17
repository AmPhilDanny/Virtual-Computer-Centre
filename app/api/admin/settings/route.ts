import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        // Convert File to Base64 for database storage (Neon/Vercel persistence)
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = value.type || "image/png";
        const base64 = buffer.toString("base64");
        updates[key] = `data:${mimeType};base64,${base64}`;
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
