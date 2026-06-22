import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, createClerkClient } from "@clerk/nextjs/server";

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

    const envioActivo = await prisma.envio.findFirst({
      where: {
        remitenteDni: usuario.dni,
        estado: {
          in: ["BUSCANDO", "ACEPTADO", "RETIRADO", "EN_CAMINO"],
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        transportista: {
          include: {
            usuario: true,
            vehiculo: true,
          },
        },
      },
    });

    if (!envioActivo) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    let datosChofer = null;

    if (envioActivo.transportista) {
      let nombreChofer = "Conductor asignado";
      const ratingChofer =
        Number(envioActivo.transportista.promedioCalificacion) || 5.0;
      const vehiculo = envioActivo.transportista.vehiculo;
      const vehiculoChofer = vehiculo
        ? `${vehiculo.categoriaId} (${vehiculo.patente || "Sin patente"})`
        : "Vehículo registrado";

      try {
        const clerk = createClerkClient({
          secretKey: process.env.CLERK_SECRET_KEY,
        });
        const clerkUser = await clerk.users.getUser(
          envioActivo.transportista.usuario.clerkId,
        );

        if (clerkUser) {
          const nombre = clerkUser.firstName || "";
          const apellido = clerkUser.lastName || "";
          const nombreArmado = `${nombre} ${apellido}`.trim();

          nombreChofer =
            clerkUser.fullName ||
            nombreArmado ||
            clerkUser.username ||
            "Conductor";
        }
      } catch (e) {
        console.error("Error obteniendo nombre del chofer en Clerk:", e);
      }

      datosChofer = {
        nombre: nombreChofer,
        vehiculo: vehiculoChofer,
        rating: ratingChofer,
      };
    }

    const data = {
      id: `${envioActivo.id}`,
      estado: envioActivo.estado,
      origen: envioActivo.origenDireccion,
      destino: envioActivo.destinoDireccion,
      chofer: datosChofer,
      eta: "15 min", // TODO: Calcular en prox etapa.
    };

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
