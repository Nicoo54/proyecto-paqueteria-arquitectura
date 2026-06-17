import { NextRequest, NextResponse } from "next/server";
import { envioAceptado, envioBuscando, envioEnCamino, remitenteMock } from "../../../../../lib/mocks";
import { ResponseEnvios } from "../../../../../lib/responses";
import { prisma } from "../../../../../lib/prisma";
import { remitente } from '@prisma/client'
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "No se especifica remitente" }, { status: 400 });
        }

        if (!Number.isInteger(Number.parseInt(id))) {
            return NextResponse.json({ error: "Identificador de envio debe ser un numero entero" }, { status: 400 });
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
        
        const skip = (page - 1) * limit;
        const envios = await prisma.envio.findMany({
            where: {
                dni_remitente: id
            },

            orderBy: {
                created_at: "desc"
            },

            skip,
            take: limit
        });

        const total = await prisma.envio.count({ where: { dni_remitente: id } });

        return NextResponse.json({
            data: ResponseEnvios(envios),
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(envios.length / limit)
            }
        });

    } catch (error) {
        console.log("GET api/remitentes/[id]/envios", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}