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
      include: { helper: true },
    });

    if (!usuario || !usuario.helper) {
      return NextResponse.json(
        { error: "Acceso denegado: Rol Helper requerido" },
        { status: 403 },
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        helperDni: usuario.dni,
        estado: { in: ["RESUELTO", "CERRADO"] },
      },
      orderBy: { updatedAt: "desc" },
    });

    const data = tickets.map((t) => ({
      codigo_reclamo: t.id.toString(),
      codigo_seguimiento: t.envioId.toString(),
      fecha_resolucion: t.updatedAt.toISOString(),
      resolucion: t.resolucion || "Sin resolución registrada.",
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/tickets/historial:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
