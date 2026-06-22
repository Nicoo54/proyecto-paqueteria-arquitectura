import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contextoTransportista } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { ctx: authTransportista } = await contextoTransportista();

    const { id } = await ctx.params;
    const envioId = Number(id);

    if (!Number.isInteger(envioId) || envioId <= 0) {
      return jsonOk(
        {
          error: {
            code: "ID_INVALIDO",
            message: "El id del envío debe ser un entero positivo",
          },
        },
        400,
      );
    }

    const viajeActivo = await prisma.envio.findFirst({
      where: {
        id: envioId,
        transportistaDni: authTransportista.dni,
        estado: {
          in: ["ACEPTADO", "RETIRADO", "EN_CAMINO"],
        },
      },
    });

    if (!viajeActivo) {
      return jsonOk(null);
    }

    return jsonOk(viajeActivo);
  } catch (e) {
    return jsonError(e);
  }
}
