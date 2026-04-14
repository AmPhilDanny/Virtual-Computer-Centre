import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Check if any admin exists
    const adminExists = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" }
    });

    if (adminExists) {
      return NextResponse.json({ message: "Admin account already initialized. Use existing credentials." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    
    const admin = await prisma.user.create({
      data: {
        email: "admin@fhinovax.com",
        name: "Super Admin",
        password: hashedPassword,
        role: "SUPER_ADMIN"
      }
    });

    return NextResponse.json({
      message: "Setup complete. You can now login.",
      credentials: {
        email: admin.email,
        password: "Admin@123"
      }
    });
  } catch (error: any) {
    console.error("Setup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
