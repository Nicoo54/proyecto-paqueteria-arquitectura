// Requiere @clerk/nextjs instalado (lo agrega Sistemas Externos en
// el package.json del repo principal — feature/ui ya lo trae).
import { auth, currentUser } from "@clerk/nextjs/server";
import type { Authenticator, RolUsuario, UsuarioAutenticado } from "../../application/ports/authenticator";

const ROLES_VALIDOS: readonly RolUsuario[] = ["transportista", "admin", "remitente"];

function normalizarRol(valor: unknown): RolUsuario | null {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim().toLowerCase();
  return (ROLES_VALIDOS as readonly string[]).includes(limpio) ? (limpio as RolUsuario) : null;
}

export class ClerkAuthenticator implements Authenticator {
  async obtenerUsuarioActual(): Promise<UsuarioAutenticado | null> {
    const { userId, sessionClaims } = await auth();
    if (!userId) return null;

    const rolDesdeClaims = normalizarRol(
      (sessionClaims as { publicMetadata?: { role?: unknown } } | null)?.publicMetadata?.role
    );

    if (rolDesdeClaims !== null) {
      return { clerkId: userId, rol: rolDesdeClaims };
    }

    const user = await currentUser();
    const rolDesdeUser = normalizarRol((user?.publicMetadata as { role?: unknown } | undefined)?.role);

    return { clerkId: userId, rol: rolDesdeUser };
  }
}
