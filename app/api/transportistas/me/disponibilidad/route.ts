import { NextRequest } from "next/server";
import { ActualizarDisponibilidadSchema } from "@/lib/validation/transportista";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, leerBody } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";

export async function PATCH(req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const body = await leerBody(req);
    const parse = parseConSchema(ActualizarDisponibilidadSchema, body);
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }
    const r = await deps.casosDeUso.actualizarDisponibilidad.ejecutar({
      dni: ctx.dni,
      disponible: parse.valor.disponible,
    });
    return jsonOk({ disponible: r.estado === "DISPONIBLE" });
  } catch (e) {
    return jsonError(e);
  }
}
