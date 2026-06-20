import { NextRequest } from "next/server";
import { HistorialEnviosQuerySchema } from "@/lib/validation/transportista";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, queryParams } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";
import { envioADto } from "@/lib/http/dto/envio";

export async function GET(req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const parse = parseConSchema(HistorialEnviosQuerySchema, queryParams(req));
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }
    const r = await deps.repositorios.envios.historialDelTransportista(ctx.dni, parse.valor);
    return jsonOk({
      envios: r.items.map(envioADto),
      pagination: r.pagination,
    });
  } catch (e) {
    return jsonError(e);
  }
}
