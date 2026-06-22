import { NextRequest } from "next/server";
import { VehiculoRequestSchema } from "@/lib/validation/transportista";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, leerBody } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";
import { vehiculoADto } from "@/lib/http/dto/vehiculo";

export async function GET(_req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const v = await deps.repositorios.vehiculos.obtenerPorTransportista(ctx.dni);
    if (v === null) {
      return jsonOk({ error: { code: "VEHICULO_NO_REGISTRADO", message: "El transportista no tiene un vehículo registrado" } }, 404);
    }
    return jsonOk(vehiculoADto(v));
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const body = await leerBody(req);
    const parse = parseConSchema(VehiculoRequestSchema, body);
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }
    const v = await deps.casosDeUso.registrarVehiculo.ejecutar({
      dni: ctx.dni,
      vehiculo: parse.valor,
    });
    return jsonOk(vehiculoADto(v), 201);
  } catch (e) {
    return jsonError(e);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const body = await leerBody(req);
    const parse = parseConSchema(VehiculoRequestSchema, body);
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }
    const v = await deps.casosDeUso.actualizarVehiculo.ejecutar({
      dni: ctx.dni,
      vehiculo: parse.valor,
    });
    return jsonOk(vehiculoADto(v));
  } catch (e) {
    return jsonError(e);
  }
}
