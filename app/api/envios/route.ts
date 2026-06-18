// Nota de coordinación: este archivo lo va a aportar también el
// dueño de Remitente con un POST /envios (publicar). Cuando se mergee,
// ambos handlers (GET y POST) conviven en este archivo.
import { NextRequest } from "next/server";
import { ExplorarEnviosQuerySchema } from "@/lib/validation/transportista";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, queryParams } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";
import { envioADto } from "@/lib/http/dto/envio";

export async function GET(req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const parse = parseConSchema(ExplorarEnviosQuerySchema, queryParams(req));
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }
    const envios = await deps.casosDeUso.explorarEnvios.ejecutar({
      dni: ctx.dni,
      posicion: { lat: parse.valor.lat, lng: parse.valor.lng },
      radioKm: parse.valor.radioKm,
    });
    return jsonOk(envios.map(envioADto));
  } catch (e) {
    return jsonError(e);
  }
}
