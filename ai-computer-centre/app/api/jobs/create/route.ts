import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeJobIntake } from "@/lib/ai/intakeAgent";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { serviceId, title, formData, description } = body;

    if (!serviceId) {
      return NextResponse.json({ message: "Service ID required" }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    // Call Intake Agent
    const aiAnalysis = await analyzeJobIntake(service.name, service.aiPrompt, formData);

    const job = await prisma.job.create({
      data: {
        userId,
        serviceId,
        title,
        description,
        formData,
        status: "SUBMITTED",
        priority: formData.priority === "EXPRESS" ? "EXPRESS" : "NORMAL",
        complexity: aiAnalysis.complexity,
        adminNotes: aiAnalysis.notesForAdmin
      }
    });

    return NextResponse.json({ message: "Job created successfully", job }, { status: 201 });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
