import { NextRequest, NextResponse } from "next/server";
import {
  ticketEnProceso,
  ticketPendiente,
  ticketResuelto,
} from "../../../../lib/mocks";
import { ResponseTicket } from "../../../../lib/responses";
import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (!Number.isInteger(Number(id))) {
      return NextResponse.json(
        { error: "Identificador de envio debe ser un numero entero" },
        { status: 400 },
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "No se encontro el ticket" },
        { status: 404 },
      );
    }

    return NextResponse.json(ResponseTicket(ticket));
  } catch (error) {
    console.log("GET api/tickets/[id]", error);

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

    const usuario = await prisma.usuario.findUnique({
      where: { clerkId: userId },
      include: { helper: true },
    });

    if (!usuario || !usuario.helper) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket no encontrado" },
        { status: 404 },
      );
    }

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
      { status: 200, message: "Ticket asignado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
