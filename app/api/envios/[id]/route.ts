// Nota de coordinación: el GET de este endpoint (detalle del envío)
// lo aporta el dueño de Remitente. Acá implemento el PATCH del
// transportista para aceptar un envío.
import { NextRequest, NextResponse } from "next/server";
import { AceptarEnvioSchema } from "@/lib/validation/envio";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, leerBody } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";
import { ResponseEnvio } from "../../../../lib/responses";
import { auth } from '@clerk/nextjs/server';
import { prisma } from "../../../../lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        if (!Number.isInteger(Number(id))) {
            return NextResponse.json({ error: "Identificador invalido" }, { status: 400 });
        }

        const envio = await prisma.envio.findUnique({ where: { codigo_envio: Number(id) } });

        if (!envio) {
            return NextResponse.json({ error: "No se encontro el envio" }, { status: 404 });
        }

        return NextResponse.json(ResponseEnvio(envio));

    } catch (error) {
        console.log("GET /api/envios/[id]", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, ctx: { params: Params }) {
  try {
    const { deps, ctx: authTransportista } = await contextoTransportista();
    const { id } = await ctx.params;
    const envioId = Number(id);
    if (!Number.isInteger(envioId) || envioId <= 0) {
      return jsonOk({ error: { code: "ID_INVALIDO", message: "El id del envío debe ser un entero positivo" } }, 400);
    }

    const body = await leerBody(req);
    const parse = parseConSchema(AceptarEnvioSchema, body);
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }

    const ultima = await deps.repositorios.transportistas.obtenerUltimaUbicacion(authTransportista.dni);
    const r = await deps.casosDeUso.aceptarEnvio.ejecutar({
      transportistaDni: authTransportista.dni,
      envioId,
      posicionTransportista: ultima ? { lat: ultima.lat, lng: ultima.lng } : null,
    });

    const envio = await deps.repositorios.envios.obtenerPorId(r.envioId);
    if (envio === null) {
      return jsonError(new Error("Envío no encontrado tras aceptar"));
    }
    return jsonOk({ id: envio.id, estado: envio.estado, transportistaDni: envio.transportistaDni });
  } catch (e) {
    return jsonError(e);
  }
}
