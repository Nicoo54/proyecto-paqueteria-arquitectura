import type { Authenticator, RolUsuario } from "../application/ports/authenticator";
import type { UsuarioRepository } from "../application/repositories/usuario-repository";
import type { Dni } from "../domain/types";
import { NoAutenticado, RolNoAutorizado, UsuarioSinRegistroLocal } from "./errores";

export type ContextoAuth = {
  clerkId: string;
  dni: Dni;
  rol: RolUsuario | null;
};

export type ResolverContextoAuthDeps = {
  authenticator: Authenticator;
  usuarios: UsuarioRepository;
};

export async function resolverContextoAuth(deps: ResolverContextoAuthDeps): Promise<ContextoAuth> {
  const usuarioAuth = await deps.authenticator.obtenerUsuarioActual();
  if (usuarioAuth === null) {
    throw new NoAutenticado();
  }

  const usuarioLocal = await deps.usuarios.obtenerPorClerkId(usuarioAuth.clerkId);
  if (usuarioLocal === null) {
    throw new UsuarioSinRegistroLocal(usuarioAuth.clerkId);
  }

  return {
    clerkId: usuarioAuth.clerkId,
    dni: usuarioLocal.dni,
    rol: usuarioAuth.rol,
  };
}

export async function resolverContextoTransportista(
  deps: ResolverContextoAuthDeps
): Promise<ContextoAuth> {
  const ctx = await resolverContextoAuth(deps);
  if (ctx.rol !== "transportista") {
    throw new RolNoAutorizado("transportista", ctx.rol);
  }
  return ctx;
}

export async function resolverContextoAdmin(
  deps: ResolverContextoAuthDeps
): Promise<ContextoAuth> {
  const ctx = await resolverContextoAuth(deps);
  if (ctx.rol !== "admin") {
    throw new RolNoAutorizado("admin", ctx.rol);
  }
  return ctx;
}
