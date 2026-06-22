import { NextRequest, NextResponse } from "next/server";
import { ticketPendiente } from '@/lib/mocks';
import { ResponseTicket } from "../../../lib/responses";
import { prisma } from "../../../lib/prisma";
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {

    try {

        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { envioId, motivo } = body;

        if (!envioId) {
            return NextResponse.json({ error: "No se especifica envioId" }, { status: 400 });
        }

        if (!motivo) {
            return NextResponse.json({ error: "No se especifica motivo" }, { status: 400 });
        }

        if (typeof motivo !== "string") {
            return NextResponse.json({ error: "Motivo invalido" }, { status: 400 });
        }

        if (motivo.length > 500) {
            return NextResponse.json({ error: "Motivo demasiado largo" }, { status: 400 });
        }

        if (motivo.trim().length === 0) {
            return NextResponse.json({ error: "Motivo invalido" }, { status: 400 });
        }

        const envioIntId = Number(envioId);
        if (!Number.isInteger(envioIntId)) {
            return NextResponse.json({ error: "envioId invalido" }, { status: 400 });
        }

        const ticket = await prisma.ticket.create({
            data: {
                motivo: motivo.trim(),
                estado: "ABIERTO",
                envioId: envioIntId,
            },
        });

        return NextResponse.json(ResponseTicket(ticket), { status: 201 });

    } catch (error) {
        console.log("POST api/tickets", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}