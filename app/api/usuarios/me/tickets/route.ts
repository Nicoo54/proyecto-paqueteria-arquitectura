import { NextRequest, NextResponse } from "next/server";
import { ResponseTickets } from "../../../../../lib/responses";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    if (!Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        { error: "Numero de pagina invalido" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limite de cantidad invalido" },
        { status: 400 },
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { clerkId: userId },
    });

    if (!usuario || !usuario.dni) {
      return NextResponse.json(
        { error: "No se encontro el usuario" },
        { status: 404 },
      );
    }

    const skip = (page - 1) * limit;

    const tickets = await prisma.ticket.findMany({
      where: {
        envio: { remitenteDni: usuario.dni },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        helper: {
          include: { usuario: true },
        },
      },
    });

    const total = await prisma.ticket.count({
      where: { envio: { remitenteDni: usuario.dni } },
    });

    const helperClerkIds = [
      ...new Set(
        tickets
          .filter((t) => t.helper?.usuario?.clerkId)
          .map((t) => t.helper!.usuario!.clerkId),
      ),
    ];

    const helpersNombres: Record<string, string> = {};

    if (helperClerkIds.length > 0) {
      try {
        const clerk = createClerkClient({
          secretKey: process.env.CLERK_SECRET_KEY,
        });
        const clerkUsers = await clerk.users.getUserList({
          userId: helperClerkIds,
        });

        clerkUsers.data.forEach((u) => {
          const nombre = u.firstName || "";
          const apellido = u.lastName || "";
          const nombreArmado = `${nombre} ${apellido}`.trim();

          helpersNombres[u.id] =
            u.fullName ||
            nombreArmado ||
            u.username ||
            u.emailAddresses[0]?.emailAddress.split("@")[0] ||
            "Soporte Técnico";
        });
      } catch (error) {
        console.error("Error trayendo helpers de Clerk:", error);
      }
    }

    const ticketsConNombres = tickets.map((ticket) => ({
      ...ticket,
      nombreHelper: ticket.helper?.usuario?.clerkId
        ? helpersNombres[ticket.helper.usuario.clerkId] || "Soporte Técnico"
        : null,
    }));

    return NextResponse.json({
      data: ResponseTickets(ticketsConNombres),
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET api/usuarios/me/tickets", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
