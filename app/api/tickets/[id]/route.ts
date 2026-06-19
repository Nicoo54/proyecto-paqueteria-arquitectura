import { NextRequest, NextResponse } from "next/server";
import { ticketEnProceso, ticketPendiente, ticketResuelto } from "../../../../lib/mocks";
import { ResponseTicket } from "../../../../lib/responses";
import { prisma } from "../../../../lib/prisma";
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        if (!Number.isInteger(Number(id))) {
            return NextResponse.json({ error: "Identificador de envio debe ser un numero entero" }, { status: 400 });
        }

        const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });

        if (!ticket) {
            return NextResponse.json({ error: "No se encontro el ticket" }, { status: 404 });
        }

        return NextResponse.json(ResponseTicket(ticket));

    } catch (error) {
        console.log("GET api/tickets/[id]", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}