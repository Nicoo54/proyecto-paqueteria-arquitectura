import { NextRequest, NextResponse } from "next/server";
import { envioAceptado, envioBuscando, envioEnCamino, remitenteMock, ticketEnProceso, ticketPendiente, ticketResuelto } from "../../../../../lib/mocks";
import { ResponseTickets } from "../../../../../lib/responses";
import { prisma } from "../../../../../lib/prisma";
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "No se especifica id" }, { status: 400 });
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

        const remitente = await prisma.remitente.findUnique({ where: { dni: id } });

        if (!remitente) {
            return NextResponse.json({ error: "No se encontro remitente" }, { status: 404 });
        }

        // mas eficiente si se hace joins.

        const envios = await prisma.envio.findMany({ where: { dni_remitente: id }, select: { codigo_envio: true } });

        const codigosEnvio = envios.map(envio => envio.codigo_envio);
        const skip = (page - 1) * limit;

        const tickets = await prisma.ticket.findMany({
            where: { codigo_seguimiento: { in: codigosEnvio } },
            skip,
            take: limit
        });

        const total = await prisma.ticket.count({ where: { codigo_seguimiento: { in: codigosEnvio } } });

        return NextResponse.json({
            data: ResponseTickets(tickets),
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(tickets.length / limit)
            }
        });

    } catch (error) {
        console.log("GET api/remitentes/[id]/tickets", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}