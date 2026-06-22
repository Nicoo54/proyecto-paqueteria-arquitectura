import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularCotizacion } from "@/lib/cotizar-envio";
import { CategoriaValida } from "../../../../lib/tipos";
import { TiempoEstimado } from "../../../../lib/tiempo-estimado";
import { auth } from "@clerk/nextjs/server";

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
      origenLat,
      origenLng,
      destinoLat,
      destinoLng,
    } = body;

    if (!categoriaPaquete || !CategoriaValida(categoriaPaquete)) {
      return NextResponse.json(
        { error: "Categoria de paquete invalida" },
        { status: 400 },
      );
    }

    if (
      !origenDireccion ||
      typeof origenDireccion !== "string" ||
      origenDireccion.length > 255
    ) {
      return NextResponse.json(
        { error: "Direccion de origen invalida" },
        { status: 400 },
      );
    }

    if (
      !destinoDireccion ||
      typeof destinoDireccion !== "string" ||
      destinoDireccion.length > 255
    ) {
      return NextResponse.json(
        { error: "Direccion de destino invalida" },
        { status: 400 },
      );
    }

    if (typeof origenLat !== "number" || typeof origenLng !== "number") {
      return NextResponse.json(
        { error: "Coordenadas de origen inválidas" },
        { status: 400 },
      );
    }

    if (typeof destinoLat !== "number" || typeof destinoLng !== "number") {
      return NextResponse.json(
        { error: "Coordenadas de destino inválidas" },
        { status: 400 },
      );
    }

    const categoria = await prisma.categoriaPaquete.findUnique({
      where: { categoria: categoriaPaquete },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "Categoria inexistente" },
        { status: 404 },
      );
    }

    try {
      const origen = {
        latitud: origenLat,
        longitud: origenLng,
        direccion: origenDireccion,
      };
      const destino = {
        latitud: destinoLat,
        longitud: destinoLng,
        direccion: destinoDireccion,
      };

      const precioBruto = await calcularCotizacion(
        Number(categoria.multiplicadorCosto),
        origen,
        destino,
      );

      const precioEstimado = Number((precioBruto * 1000).toFixed(2));

      const tiempoEstimado = await TiempoEstimado(origen, destino);

      return NextResponse.json(
        {
          precio: precioEstimado,
          tiempoEstimadoMinutos: tiempoEstimado,
          origenLat: origen.latitud,
          origenLng: origen.longitud,
          destinoLat: destino.latitud,
          destinoLng: destino.longitud,
        },
        { status: 200 },
      );
    } catch (e) {
      if (e instanceof Error && e.message === "503") {
        return NextResponse.json(
          { error: "Error en el servicio de ruta" },
          { status: 503 },
        );
      }
      throw e;
    }
  } catch (error) {
    console.error("POST /envios/cotizaciones", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
