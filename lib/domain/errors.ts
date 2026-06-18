export type DomainErrorCode =
  | "ESTADO_INVALIDO"
  | "TRANSICION_INVALIDA"
  | "CAPACIDAD_INSUFICIENTE"
  | "VEHICULO_NO_REGISTRADO"
  | "VEHICULO_YA_REGISTRADO"
  | "PATENTE_INVALIDA"
  | "COORDENADAS_FALTANTES"
  | "COORDENADAS_INVALIDAS"
  | "ENVIO_NO_DISPONIBLE"
  | "TRANSPORTISTA_OCUPADO"
  | "TRANSPORTISTA_NO_DISPONIBLE"
  | "RESEÑA_DUPLICADA"
  | "ENVIO_NO_ENTREGADO";

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(code: DomainErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.details = details;
  }
}

export class EstadoInvalido extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("ESTADO_INVALIDO", message, details);
    this.name = "EstadoInvalido";
  }
}

export class TransicionInvalida extends DomainError {
  constructor(desde: string, hasta: string) {
    super("TRANSICION_INVALIDA", `No se puede transicionar de ${desde} a ${hasta}`, { desde, hasta });
    this.name = "TransicionInvalida";
  }
}

export class CapacidadInsuficiente extends DomainError {
  constructor(categoriaVehiculo: string, categoriaPaquete: string) {
    super(
      "CAPACIDAD_INSUFICIENTE",
      `El vehículo ${categoriaVehiculo} no puede transportar paquetes de categoría ${categoriaPaquete}`,
      { categoriaVehiculo, categoriaPaquete }
    );
    this.name = "CapacidadInsuficiente";
  }
}

export class VehiculoNoRegistrado extends DomainError {
  constructor() {
    super("VEHICULO_NO_REGISTRADO", "El transportista no tiene un vehículo registrado");
    this.name = "VehiculoNoRegistrado";
  }
}

export class VehiculoYaRegistrado extends DomainError {
  constructor() {
    super("VEHICULO_YA_REGISTRADO", "El transportista ya tiene un vehículo registrado");
    this.name = "VehiculoYaRegistrado";
  }
}

export class PatenteInvalida extends DomainError {
  constructor(patente: string | null | undefined, motivo: string) {
    super("PATENTE_INVALIDA", `Patente inválida: ${motivo}`, { patente, motivo });
    this.name = "PatenteInvalida";
  }
}

export class CoordenadasFaltantes extends DomainError {
  constructor() {
    super("COORDENADAS_FALTANTES", "No se cuenta con coordenadas del transportista");
    this.name = "CoordenadasFaltantes";
  }
}

export class CoordenadasInvalidas extends DomainError {
  constructor(lat: number, lng: number) {
    super("COORDENADAS_INVALIDAS", `Coordenadas fuera de rango: lat=${lat}, lng=${lng}`, { lat, lng });
    this.name = "CoordenadasInvalidas";
  }
}

export class EnvioNoDisponible extends DomainError {
  constructor(estadoActual: string) {
    super("ENVIO_NO_DISPONIBLE", `El envío no está disponible para aceptar (estado actual: ${estadoActual})`, {
      estadoActual,
    });
    this.name = "EnvioNoDisponible";
  }
}

export class TransportistaOcupado extends DomainError {
  constructor() {
    super("TRANSPORTISTA_OCUPADO", "El transportista ya tiene un envío en tránsito");
    this.name = "TransportistaOcupado";
  }
}

export class TransportistaNoDisponible extends DomainError {
  constructor() {
    super("TRANSPORTISTA_NO_DISPONIBLE", "El transportista no está disponible");
    this.name = "TransportistaNoDisponible";
  }
}
