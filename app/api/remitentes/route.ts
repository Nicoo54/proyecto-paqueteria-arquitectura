import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, createClerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { dni } = await req.json();

    if (!dni || typeof dni !== "string" || dni.length > 10) {
      return NextResponse.json({ error: "DNI inválido" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.usuario.create({
        data: { dni, clerkId: userId },
      });
      await tx.remitente.create({
        data: { dni },
      });
    });

    try {
      const clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { role: "remitente", onboardingCompleto: true },
      });
    } catch (e) {
      console.error("Error Clerk:", e);
    }

    return NextResponse.json({ status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "El DNI o usuario ya está registrado" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
