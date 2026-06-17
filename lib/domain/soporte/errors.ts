export class TicketYaResueltoError extends Error {
  constructor(codigo: string) {
    super(`El ticket ${codigo} ya está resuelto y no puede modificarse.`);
    this.name = 'TicketYaResueltoError';
  }
}

export class DatosTicketInvalidosError extends Error {
  constructor(mensaje: string) {
    super(`Datos inválidos para el reclamo: ${mensaje}`);
    this.name = 'DatosTicketInvalidosError';
  }
}