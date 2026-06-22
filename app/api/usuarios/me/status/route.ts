import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { clerkId: userId },
      include: {
        remitente: true,
        transportista: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          onboardingCompleto: false,
          role: null,
        },
        { status: 200 },
      );
    }

    let role = "remitente";
    if (usuario.transportista) {
      role = "transportista";
    }

    return NextResponse.json(
      {
        onboardingCompleto: true,
        role: role,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/usuarios/me/status:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
