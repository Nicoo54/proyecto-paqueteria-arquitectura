import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { createPaymentPreference } from "../../../../../lib/mercadopago";
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const envioId = Number(id);

        if (!Number.isInteger(envioId)) {
            return NextResponse.json({ error: "Identificador invalido" }, { status: 400 });
        }

        const body = await req.json();
        const { precioCalculado } = body;

        const envio = await prisma.envio.findUnique({ where: { id: envioId } });

        if (!envio) {
            return NextResponse.json({ error: "No se encontro el envio" }, { status: 404 });
        }

        // Crear transaccion en retencion inicial
        await prisma.transaccion.create({
            data: {
                idReferenciaExterna: `REF-${envioId}-${Date.now()}`,
                envioId: envioId,
                montoTotal: precioCalculado,
                estadoPago: "RETENIDO",
            }
        });

        // Generar el link de pago con MercadoPago si es digital
        let paymentLink = null;
        if (envio.tipoPago === "DIGITAL") {
            const preference = await createPaymentPreference(`Envío #${envioId}`, Number(precioCalculado));
            paymentLink = preference.init_point;
        }

        return NextResponse.json({ 
            status: 201, 
            message: "Pago iniciado correctamente",
            paymentLink 
        }, { status: 201 });

    } catch (error) {
        console.error("POST /api/envios/[id]/pagos", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
