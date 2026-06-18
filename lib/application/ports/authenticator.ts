export type RolUsuario = "transportista" | "admin" | "remitente";

export type UsuarioAutenticado = {
  clerkId: string;
  rol: RolUsuario | null;
};

export interface Authenticator {
  obtenerUsuarioActual(): Promise<UsuarioAutenticado | null>;
}
