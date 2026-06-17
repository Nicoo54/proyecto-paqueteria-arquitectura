import { NextRequest, NextResponse } from "next/server";
import { envioAceptado, envioBuscando, envioEnCamino, envioEntregado } from "../../../../lib/mocks";
import { ResponseEnvio } from "../../../../lib/responses";
import { User, auth } from '@clerk/nextjs/server';
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

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
        console.log("GET /api/envios/[id]/resenas", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }

}