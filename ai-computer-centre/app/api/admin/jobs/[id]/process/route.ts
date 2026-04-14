import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { processJobExecution } from "@/lib/ai/executionAgent";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    
    // Call the Execution Agent
    const result = await processJobExecution(resolvedParams.id);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }

  } catch (error: any) {
    console.error("TRIGGER EXECUTION ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
