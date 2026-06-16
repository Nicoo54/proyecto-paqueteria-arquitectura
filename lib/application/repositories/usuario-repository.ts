import type { Dni } from "../../domain/types";

export type UsuarioRegistro = {
  dni: Dni;
  clerkId: string;
};

export interface UsuarioRepository {
  obtenerPorClerkId(clerkId: string): Promise<UsuarioRegistro | null>;
  registrar(usuario: UsuarioRegistro): Promise<UsuarioRegistro>;
}
