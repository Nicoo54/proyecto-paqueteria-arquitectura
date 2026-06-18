import { NextRequest } from "next/server";
import { ActualizarUbicacionSchema } from "@/lib/validation/transportista";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, leerBody } from "@/lib/http/handler-utils";
import { jsonError, noContent, jsonOk } from "@/lib/http/response";

export async function PATCH(req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const body = await leerBody(req);
    const parse = parseConSchema(ActualizarUbicacionSchema, body);
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }
    await deps.casosDeUso.actualizarUbicacion.ejecutar({
      dni: ctx.dni,
      posicion: { lat: parse.valor.lat, lng: parse.valor.lng },
    });
    return noContent();
  } catch (e) {
    return jsonError(e);
  }
}
