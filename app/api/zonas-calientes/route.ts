import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const hoy = new Date();

    const zonasActivas = await prisma.zonaCaliente.findMany({
      where: {
        fechaVigenciaInicio: { lte: hoy },
        fechaVigenciaFin: { gte: hoy },
      },
    });

    const data = zonasActivas.map((z) => ({
      codigo: z.codigo.toString(),
      centroLat: Number(z.centroLat),
      centroLng: Number(z.centroLng),
      radioM: Number(z.radioM),
      multiplicadorPrecio: Number(z.multiplicadorPrecio),
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/zonas-calientes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
