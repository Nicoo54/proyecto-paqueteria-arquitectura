import { NextRequest } from "next/server";
import { CambiarEstadoEnvioSchema } from "@/lib/validation/envio";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, leerBody } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, ctx: { params: Params }) {
  try {
    const { deps, ctx: auth } = await contextoTransportista();
    const { id } = await ctx.params;
    const envioId = Number(id);
    if (!Number.isInteger(envioId) || envioId <= 0) {
      return jsonOk({ error: { code: "ID_INVALIDO", message: "El id del envío debe ser un entero positivo" } }, 400);
    }

    const body = await leerBody(req);
    const parse = parseConSchema(CambiarEstadoEnvioSchema, body);
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }

    const ultima = await deps.repositorios.transportistas.obtenerUltimaUbicacion(auth.dni);

    const r = await deps.casosDeUso.actualizarEstadoEnvio.ejecutar({
      transportistaDni: auth.dni,
      envioId,
      nuevoEstado: parse.valor.estado,
      posicionTransportista: ultima ? { lat: ultima.lat, lng: ultima.lng } : null,
    });

    return jsonOk({ id: r.envioId, estado: r.estado });
  } catch (e) {
    return jsonError(e);
  }
}
