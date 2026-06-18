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
        const { asunto, descripcion } = body;

        if (!asunto) {
            return NextResponse.json({ error: "No se especifica asunto" }, { status: 400 });
        }

        if (!descripcion) {
            return NextResponse.json({ error: "No se especifica descripcion" }, { status: 400 });
        }

        if (typeof asunto !== "string") {
            return NextResponse.json({ error: "Asunto invalido" }, { status: 400 });
        }

        if (typeof descripcion !== "string") {
            return NextResponse.json({ error: "Descripcion invalida" }, { status: 400 });
        }

        if (asunto.length > 255) {
            return NextResponse.json({ error: "Asunto demasiado largo" });
        }

        if (descripcion.length > 255) {
            return NextResponse.json({ error: "Descripcion demasiada larga" }, { status: 400 });
        }

        if (asunto.trim().length === 0) {
            return NextResponse.json({ error: "Asunto invalido" }, { status: 400 });
        }

        if (descripcion.trim().length === 0) {
            return NextResponse.json({ error: "Descripcion invalida" }, { status: 400 });
        }

        const ticket = await prisma.ticket.create({
            data: {
                motivo: asunto,
                estado: "PENDIENTE",
                codigo_seguimiento: 999,
            },
        });

        return NextResponse.json(ResponseTicket(ticket), { status: 201 });

    } catch (error) {
        console.log("POST api/tickets", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}