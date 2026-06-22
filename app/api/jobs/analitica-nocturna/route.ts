// Endpoint interno disparado por Vercel Cron (vercel.json) a las
// 02:00 AM diarias. Vercel agrega el header authorization con el
// CRON_SECRET para autenticar la invocación.
//
// Para ejecución manual durante la demo:
//   curl -X POST http://localhost:3000/api/jobs/analitica-nocturna \
//        -H "authorization: Bearer <CRON_SECRET>"

import { NextRequest } from "next/server";
import { crearDependenciasTransportista } from "@/lib/composition";
import { jsonError, jsonOk } from "@/lib/http/response";

export async function POST(req: NextRequest) {
  try {
    const expected = process.env.CRON_SECRET;
    if (expected) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${expected}`) {
        return jsonOk(
          { error: { code: "NO_AUTORIZADO", message: "Cron secret inválido" } },
          401
        );
      }
    }

    const deps = crearDependenciasTransportista();
    const resultado = await deps.casosDeUso.calcularAnaliticaNocturna.ejecutar();

    if (!resultado.adquirido) {
      return jsonOk({
        ok: true,
        ejecutado: false,
        motivo: "Otra corrida ya está procesando la analítica (lock distribuido en uso)",
      });
    }

    return jsonOk({
      ok: true,
      ejecutado: true,
      ...resultado.resultado,
    });
  } catch (e) {
    return jsonError(e);
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
