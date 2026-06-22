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
        { error: "Acceso denegado: Se requieren permisos de Soporte" },
        { status: 403 },
      );
    }

    const ultimaMetrica = await prisma.metrica.findFirst({
      orderBy: { fechaReporte: "desc" },
    });

    if (!ultimaMetrica) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        data: {
          fechaReporte: ultimaMetrica.fechaReporte.toISOString().split("T")[0],
          cantidadEnviosTotales: ultimaMetrica.cantidadEnviosTotales,
          gananciaNetaPlataforma: Number(ultimaMetrica.gananciaNetaPlataforma),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/metricas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
