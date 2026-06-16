import { DomainError } from "../domain/errors";

export class NoAutenticado extends DomainError {
  constructor() {
    super("ESTADO_INVALIDO", "Usuario no autenticado");
    this.name = "NoAutenticado";
  }
}

export class RolNoAutorizado extends DomainError {
  constructor(requerido: string, actual: string | null) {
    super("ESTADO_INVALIDO", `Rol no autorizado (requerido: ${requerido}, actual: ${actual ?? "sin rol"})`, {
      requerido,
      actual,
    });
    this.name = "RolNoAutorizado";
  }
}

export class UsuarioSinRegistroLocal extends DomainError {
  constructor(clerkId: string) {
    super(
      "ESTADO_INVALIDO",
      "El usuario está autenticado en Clerk pero no tiene registro local de Usuario",
      { clerkId }
    );
    this.name = "UsuarioSinRegistroLocal";
  }
}
