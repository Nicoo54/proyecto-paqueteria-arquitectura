import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularCotizacion } from '@/lib/cotizar-envio';
import { categoriaPaqueteMediano } from '@/lib/mocks'
import { CategoriaValida } from "../../../../lib/tipos";
import { TiempoEstimado } from "../../../../lib/tiempo-estimado";
import { ObtenerCoordenadas } from "../../../../lib/direccion";
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {

    try {

        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        const {
            categoriaPaquete,
            origenDireccion,
            destinoDireccion,
        } = body;

        if (!categoriaPaquete) {
            return NextResponse.json({ error: "No se especifica categoria del paquete" }, { status: 400 });
        }

        if (origenDireccion === undefined) {
            return NextResponse.json({ error: "No se especifica direccion de origen" }, { status: 400 });
        }

        if (destinoDireccion === undefined) {
            return NextResponse.json({ error: "No se especifica direccion de destino" }, { status: 400 });
        }

        if (typeof origenDireccion !== "string") {
            return NextResponse.json({ error: "Direccion de origen invalida" }, { status: 400 });
        }

        if (typeof destinoDireccion !== "string") {
            return NextResponse.json({ error: "Direccion de destino invalida" }, { status: 400 });
        }

        if (origenDireccion.length > 255) {
            return NextResponse.json({ error: "Direccion origen demasido largo" });
        }

        if (destinoDireccion.length > 255) {
            return NextResponse.json({ error: "Direccion destino demasido largo" });
        }

        if (!CategoriaValida(categoriaPaquete)) {
            return NextResponse.json({ error: "Categoria de paquete invalida" }, { status: 400 });
        }

        const categoria = await prisma.categoriapaquete.findUnique({ where: { categoria_paquete: categoriaPaquete } });

        if (!categoria) {
            return NextResponse.json({ error: "Categoria inexistente" }, { status: 404 });
        }

        try {
            const origen = await ObtenerCoordenadas(origenDireccion);
            const destino = await ObtenerCoordenadas(destinoDireccion);

            if (origen === null) {
                return NextResponse.json({ error: "Direccion de origen invalida" }, { status: 400 });
            }

            if (destino === null) {
                return NextResponse.json({ error: "Direccion de destino invalida" }, { status: 400 });
            }

            const precioEstimado = await calcularCotizacion(Number(categoria.multiplicador_costo), origen, destino);

            const tiempoEstimado = await TiempoEstimado(origen, destino);

            return NextResponse.json({
                precio: precioEstimado,
                tiempoEstimadoMinutos: tiempoEstimado,
                origenLat: origen.latitud,
                origenLng: origen.longitud,
                destinoLat: destino.latitud,
                destinoLng: destino.longitud
            }, { status: 200 });
        }
        catch (e) {
            if (e instanceof Error && e.message === "503") {
                return NextResponse.json({ error: "Error en el servicio de mapa" }, { status: 503 });
            }
        }

    }
    catch (error)
    {
        console.error("POST /envios/cotizaciones", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}