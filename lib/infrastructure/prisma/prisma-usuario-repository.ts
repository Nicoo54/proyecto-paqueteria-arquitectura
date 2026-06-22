import type { PrismaClient } from "@prisma/client";
import type {
  UsuarioRegistro,
  UsuarioRepository,
} from "../../application/repositories/usuario-repository";

type Tx = Pick<PrismaClient, "usuario">;

export class PrismaUsuarioRepository implements UsuarioRepository {
  constructor(private readonly db: Tx) {}

  async obtenerPorClerkId(clerkId: string): Promise<UsuarioRegistro | null> {
    const u = await this.db.usuario.findUnique({
      where: { clerkId },
      select: { dni: true, clerkId: true },
    });
    return u ? { dni: u.dni, clerkId: u.clerkId } : null;
  }

  async registrar(usuario: UsuarioRegistro): Promise<UsuarioRegistro> {
    const creado = await this.db.usuario.upsert({
      where: { dni: usuario.dni },
      update: { clerkId: usuario.clerkId },
      create: { dni: usuario.dni, clerkId: usuario.clerkId },
      select: { dni: true, clerkId: true },
    });
    return { dni: creado.dni, clerkId: creado.clerkId };
  }
}
