import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { clerkId: userId },
    });
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const direcciones = await prisma.direccion.findMany({
      where: { remitenteDni: usuario.dni },
      orderBy: { createdAt: "desc" },
    });

    const data = direcciones.map((d) => ({
      id_direccion: d.id,
      direccion: d.direccion,
      ciudad: d.ciudad,
      origen_lat: Number(d.origenLat),
      origen_lng: Number(d.origenLng),
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/remitentes/me/direcciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { clerkId: userId },
    });
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { direccion, ciudad, origen_lat, origen_lng } = body;

    if (!direccion || origen_lat === undefined || origen_lng === undefined) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 },
      );
    }

    const nuevaDireccion = await prisma.direccion.create({
      data: {
        remitenteDni: usuario.dni,
        direccion: direccion,
        ciudad: ciudad || null,
        origenLat: origen_lat,
        origenLng: origen_lng,
      },
    });

    return NextResponse.json(
      { data: { id: nuevaDireccion.id } },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/remitentes/me/direcciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
