import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Convert basePrice to float
    const basePrice = parseFloat(body.basePrice);

    const service = await prisma.service.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        category: body.category || "TYPING",
        basePrice,
        turnaroundHours: parseInt(body.turnaroundHours) || 24,
        aiPrompt: body.aiPrompt,
        autonomyLevel: body.autonomyLevel || "AI_PLUS_HUMAN",
        formSchema: body.formSchema,
        isActive: true
      }
    });

    return NextResponse.json({ message: "Service created successfully", service }, { status: 201 });
  } catch (error) {
    console.error("CREATE SERVICE ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
