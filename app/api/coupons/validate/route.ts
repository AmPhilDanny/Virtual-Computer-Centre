import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();

    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Usage limit reached for this coupon" }, { status: 400 });
    }

    if (amount && coupon.minAmount && amount < coupon.minAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount of ₦${coupon.minAmount.toLocaleString()} required` 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
