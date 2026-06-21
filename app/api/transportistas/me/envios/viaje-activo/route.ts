import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { contextoTransportista } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";

export async function GET(req: NextRequest) {
  try {
    const { ctx } = await contextoTransportista();
    const viajeActivo = await prisma.envio.findFirst({
      where: {
        transportistaDni: ctx.dni,
        estado: {
          in: ["ACEPTADO", "RETIRADO", "EN_CAMINO"],
        },
      },
    });

    if (!viajeActivo) {
      return jsonOk(null);
    }

    return jsonOk(viajeActivo.id);
  } catch (e) {
    return jsonError(e);
  }
}
