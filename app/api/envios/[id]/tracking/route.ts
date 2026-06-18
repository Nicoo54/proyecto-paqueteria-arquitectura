import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!Number.isInteger(Number(id))) {
            return NextResponse.json({ error: "Identificador de envio debe ser un numero entero" }, { status: 400 });
        }

        // TODO

    } catch (error) {
        console.log("GET envios/{id}/tracking", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}