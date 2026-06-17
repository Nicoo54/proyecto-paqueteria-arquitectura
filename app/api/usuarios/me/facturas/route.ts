import { NextRequest, NextResponse } from "next/server";
import { transaccion1, transaccion2, transaccion3 } from "../../../../../lib/mocks";
import { prisma } from "../../../../../lib/prisma";
import { ResponseFacturas } from "../../../../../lib/responses";
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {

    try {

        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const searchParams = req.nextUrl.searchParams;
        const page = Number(searchParams.get("page") ?? 1);
        const limit = Number(searchParams.get("limit") ?? 20);

        if (!Number.isInteger(page) || page < 1) {
            return NextResponse.json({ error: "Numero de pagina invalido" }, { status: 400 });
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            return NextResponse.json({ error: "Limite de cantidad invalido" }, { status: 400 });
        }

        const usuario = await prisma.usuario.findUnique({ where: { clerk_id: userId } });

        const envios = await prisma.envio.findMany({ where: { dni_remitente: usuario?.dni } });
        const codigosEnvio = envios.map(envio => envio.codigo_envio);

        const skip = (page - 1) * limit;
        const transacciones = await prisma.transaccion.findMany({
            where: {
                codigo_seguimiento: { in: codigosEnvio }
            },

            orderBy: {
                created_at: "desc"
            },

            skip,
            take: limit
        });

        const total = await prisma.transaccion.count({ where: { codigo_seguimiento: { in: codigosEnvio } } });

        const facturas = ResponseFacturas(transacciones);

        return NextResponse.json({
            data: facturas,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(facturas.length/ limit),
            },
        });

    } catch (error) {
        console.log("GET api/usuarios/me/facturas", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}