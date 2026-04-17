import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeJobIntake } from "@/lib/ai/intakeAgent";
import { calculateOrderTotal } from "@/lib/pricing";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { serviceId, title, formData, description, attachments, couponId } = body;

    if (!serviceId) {
      return NextResponse.json({ message: "Service ID required" }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    // 1. Calculate Pricing
    let coupon = null;
    if (couponId) {
      coupon = await prisma.coupon.findUnique({ where: { id: couponId, isActive: true } });
    }

    const priority = formData.priority === "EXPRESS" ? "EXPRESS" : "NORMAL";
    
    const pricing = calculateOrderTotal({
      basePrice: service.basePrice,
      priority,
      expressMultiplier: service.expressMultiplier,
      coupon: coupon ? {
        discountType: coupon.discountType as any,
        discountValue: coupon.discountValue,
        minAmount: coupon.minAmount
      } : null
    });

    // 2. Call Intake Agent for AI Pre-analysis
    const aiAnalysis = await analyzeJobIntake(service.name, service.aiPrompt, formData);

    // 3. Create Job and Order in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          userId,
          serviceId,
          title,
          description: description || "Submitted via Client Portal",
          formData,
          status: "SUBMITTED",
          priority,
          attachments: attachments || [],
          complexity: aiAnalysis.complexity,
          adminNotes: aiAnalysis.notesForAdmin
        },
        include: {
          user: { select: { email: true, name: true, phone: true } },
          service: { select: { name: true } }
        }
      });

      const order = await tx.order.create({
        data: {
          userId,
          jobId: job.id,
          amount: pricing.subtotal + pricing.priorityFee,
          discount: pricing.discount,
          total: pricing.total,
          couponId: coupon?.id || null,
          status: "PENDING", // Wait for manual or gateway payment
        }
      });

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }

      return { job, order };
    });

    // 4. Send Notifications (Fire and forget)
    sendNotification({
      toEmail: result.job.user.email || undefined,
      toPhone: result.job.user.phone || undefined,
      subject: `Order Received: ${result.job.title}`,
      event: 'JOB_CREATED',
      data: {
        job_id: result.job.id,
        job_title: result.job.title,
        customer_name: result.job.user.name || "Customer",
        service_name: result.job.service.name,
        status: "SUBMITTED",
        total_price: `₦${result.order.total.toLocaleString()}`
      }
    }).catch(e => console.error("Notification trigger error:", e));

    return NextResponse.json({ 
      message: "Order created successfully", 
      job: result.job,
      order: result.order 
    }, { status: 201 });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
