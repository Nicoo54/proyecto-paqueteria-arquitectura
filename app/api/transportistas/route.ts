import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, createClerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { dni, categoria, patente, aliasBancario } = body;

    if (!dni || !categoria || !aliasBancario) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.usuario.create({
        data: { dni, clerkId: userId },
      });

      await tx.transportista.create({
        data: {
          dni,
          aliasBancario,
          estado: "DISPONIBLE",
        },
      });

      await tx.vehiculo.create({
        data: {
          categoriaId: categoria,
          patente: patente || null,
          transportistaDni: dni,
        },
      });
    });

    try {
      const clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { role: "transportista", onboardingCompleto: true },
      });
    } catch (e) {
      console.error("Error Clerk:", e);
    }

    return NextResponse.json({ status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "El DNI, patente o usuario ya están registrados" },
        { status: 409 },
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
