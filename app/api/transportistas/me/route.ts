import { NextRequest } from "next/server";
import { contextoTransportista } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";
import { transportistaADto } from "@/lib/http/dto/transportista";

export async function GET(_req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const transportista = await deps.repositorios.transportistas.obtenerPorDni(ctx.dni);
    if (transportista === null) {
      return jsonError(new Error("Transportista no encontrado"));
    }
    return jsonOk(transportistaADto(transportista));
  } catch (e) {
    return jsonError(e);
  }
}
