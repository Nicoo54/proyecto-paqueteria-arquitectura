import { NextRequest, NextResponse } from "next/server";
import { envioEntregado, resenaSinComentario } from '@/lib/mocks'
import { prisma } from "../../../../../lib/prisma";
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        if (!Number.isInteger(Number(id))) {
            return NextResponse.json({ error: "Identificador de envio debe ser un numero entero" }, { status: 400 });
        }

        const body = await req.json();
        const { puntaje, comentario } = body;

        if (puntaje === undefined) {
            return NextResponse.json({ error: "No se especifica puntaje" }, { status: 400 });
        }

        if (!Number.isInteger(puntaje)) {
            return NextResponse.json({ error: "Puntaje debe ser un numero entero" }, { status: 400 });
        }

        if (puntaje < 1 || puntaje > 5) {
            NextResponse.json({ error: "Puntaje debe ser entre 1 y 5" }, { status: 400 });
        }

        if (comentario !== undefined && typeof comentario !== "string") {
            return NextResponse.json({ error: "Comentario debe ser texto" }, { status: 400 });
        }

        if (comentario.length > 255) {
            return NextResponse.json({ error: "Comentario demasiado largo" }, { status: 400 });
        }

        const envio = await prisma.envio.findUnique({ where: { id: Number(id) } });

        if (!envio) {
            return NextResponse.json({ error: "No se encontro el envio" }, { status: 404 });
        }

        if (envio.estado !== "ENTREGADO") {
            return NextResponse.json({ error: "El envio no esta en estado ENTREGADO" }, { status: 400 });
        }

        const resenaExistente = await prisma.resena.findFirst({ where: { envioId: Number(id), }, });

        if (resenaExistente) {
            return NextResponse.json({ error: "El envio ya posee una resena registrada" }, { status: 409 });
        }

        const resena = await prisma.resena.create({ data: { envioId: Number(id), puntaje: puntaje, comentario: comentario }, });

        return NextResponse.json({ status: 201 });

    } catch (error) {
        console.error("POST /envios/[id]/resenas", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}