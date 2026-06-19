import { NextRequest, NextResponse } from "next/server";
import { ResponseTickets } from "../../../../../lib/responses";
import { prisma } from "../../../../../lib/prisma";
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

        const usuario = await prisma.usuario.findUnique({ where: { clerkId: userId } });

        if (!usuario || !usuario.dni) {
            return NextResponse.json({ error: "No se encontro el usuario" }, { status: 404 });
        }

        const envios = await prisma.envio.findMany({ where: { remitenteDni: usuario.dni }, select: { id: true } });
        const codigosEnvio = envios.map((envio: { id: number }) => envio.id);
        
        const skip = (page - 1) * limit;

        const tickets = await prisma.ticket.findMany({
            where: { envioId: { in: codigosEnvio } },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit
        });

        const total = await prisma.ticket.count({ where: { envioId: { in: codigosEnvio } } });

        return NextResponse.json({
            data: ResponseTickets(tickets),
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("GET api/usuarios/me/tickets", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
