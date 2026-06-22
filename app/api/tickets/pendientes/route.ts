import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const usuario = await prisma.usuario.findUnique({
      where: { clerkId: userId },
      include: { helper: true },
    });

    if (!usuario || !usuario.helper) {
      return NextResponse.json(
        { error: "Acceso denegado: No eres Soporte Técnico" },
        { status: 403 },
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: { estado: "ABIERTO" },
      orderBy: { createdAt: "asc" },
    });

    const data = tickets.map((t) => ({
      codigo_reclamo: t.id.toString(),
      codigo_seguimiento: t.envioId.toString(),
      motivo: t.motivo,
      estado: t.estado,
      created_at: t.createdAt.toISOString(),
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/tickets/pendientes", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
