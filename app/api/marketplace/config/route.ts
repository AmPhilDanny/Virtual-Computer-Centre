import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: "multiVendorEnabled" }
    });
    
    return NextResponse.json({ 
      enabled: setting?.value === "true" 
    });
  } catch (error) {
    console.error("Failed to fetch marketplace config:", error);
    return NextResponse.json({ enabled: false }, { status: 500 });
  }
}
