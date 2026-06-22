import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClerkClient } from "@clerk/nextjs/server";
import { jsonError, jsonOk } from "@/lib/http/response";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ dni: string }> },
) {
  try {
    const { dni } = await ctx.params;
    const transportista = await prisma.transportista.findUnique({
      where: { dni },
      include: {
        vehiculo: true,
        usuario: true,
      },
    });

    if (!transportista) {
      return jsonOk(
        {
          error: { code: "NOT_FOUND", message: "Transportista no encontrado" },
        },
        404,
      );
    }

    let nombreCompleto = "Conductor Registrado";

    try {
      const clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const clerkUser = await clerk.users.getUser(
        transportista.usuario.clerkId,
      );

      if (clerkUser) {
        const nombre = clerkUser.firstName || "";
        const apellido = clerkUser.lastName || "";
        const nombreArmado = `${nombre} ${apellido}`.trim();

        if (clerkUser.fullName) {
          nombreCompleto = clerkUser.fullName;
        } else if (nombreArmado.length > 0) {
          nombreCompleto = nombreArmado;
        } else if (clerkUser.username) {
          nombreCompleto = clerkUser.username;
        } else if (
          clerkUser.emailAddresses &&
          clerkUser.emailAddresses.length > 0
        ) {
          nombreCompleto =
            clerkUser.emailAddresses[0].emailAddress.split("@")[0];
        }
      }
    } catch (clerkError) {
      console.error("Error consultando el SDK de Clerk:", clerkError);
    }

    const perfilPublicoRemitente = {
      nombre: nombreCompleto,
      promedioCalificacion: Number(transportista.promedioCalificacion),
      cantidadResenas: transportista.cantidadResenas,
      vehiculo: transportista.vehiculo
        ? {
            categoria: transportista.vehiculo.categoriaId,
          }
        : null,
    };

    return jsonOk(perfilPublicoRemitente);
  } catch (e) {
    return jsonError(e);
  }
}
