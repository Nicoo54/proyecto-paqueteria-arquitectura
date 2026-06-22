import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const ticketId = Number(id);

    if (!Number.isInteger(ticketId)) {
      return NextResponse.json(
        { error: "Identificador inválido" },
        { status: 400 },
      );
    }

    const usuarioLogueado = await prisma.usuario.findUnique({
      where: { clerkId: userId },
      include: { helper: true },
    });

    const esHelper = !!usuarioLogueado?.helper;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        envio: esHelper
          ? {
              include: {
                remitente: {
                  include: { usuario: true },
                },
              },
            }
          : false,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "No se encontró el ticket" },
        { status: 404 },
      );
    }

    const responseData: any = {
      codigoReclamo: ticket.id,
      codigoSeguimiento: ticket.envioId,
      motivo: ticket.motivo,
      resolucion: ticket.resolucion,
      estado: ticket.estado,
      creadoEn: ticket.createdAt,
      actualizadoEn: ticket.updatedAt,
    };

    if (esHelper && ticket.envio) {
      responseData.envioDetalle = {
        origen: ticket.envio.origenDireccion,
        destino: ticket.envio.destinoDireccion,
        estadoEnvio: ticket.envio.estado,
        costo: Number(ticket.envio.costo) || 0,
      };

      responseData.remitenteDetalle = {
        nombre: "Usuario Packeteer",
        dni: ticket.envio.remitenteDni,
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("GET /api/tickets/[id]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const ticketId = Number(id);

    if (!Number.isInteger(ticketId)) {
      return NextResponse.json(
        { error: "ID de ticket inválido" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { estado, resolucion } = body;

    const usuario = await prisma.usuario.findUnique({
      where: { clerkId: userId },
      include: { helper: true },
    });

    if (!usuario || !usuario.helper) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket)
      return NextResponse.json(
        { error: "Ticket no encontrado" },
        { status: 404 },
      );

    // CASO A: EL HELPER QUIERE "TOMAR" EL TICKET
    if (estado === "EN_ATENCION") {
      if (ticket.estado !== "ABIERTO") {
        return NextResponse.json(
          { error: "Este ticket ya fue tomado por otro operador" },
          { status: 409 },
        );
      }

      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          estado: "EN_ATENCION",
          helperDni: usuario.dni,
        },
      });

      return NextResponse.json(
        { message: "Ticket asignado correctamente" },
        { status: 200 },
      );
    }

    // CASO B: EL HELPER QUIERE "RESOLVER" EL TICKET
    if (estado === "RESUELTO" || resolucion) {
      if (!resolucion || resolucion.trim().length === 0) {
        return NextResponse.json(
          { error: "La conclusión técnica es obligatoria" },
          { status: 400 },
        );
      }

      if (ticket.helperDni !== usuario.dni) {
        return NextResponse.json(
          { error: "No puedes resolver un ticket que no tienes asignado" },
          { status: 403 },
        );
      }

      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          estado: "RESUELTO",
          resolucion: resolucion,
        },
      });

      return NextResponse.json(
        { message: "Ticket resuelto con éxito" },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Operación no válida" }, { status: 400 });
  } catch (error) {
    console.error(`PATCH /api/tickets/[id]`, error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
