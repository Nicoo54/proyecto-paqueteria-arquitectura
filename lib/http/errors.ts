import { DomainError, type DomainErrorCode } from "../domain/errors";

export type ErrorBody = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type HttpErrorResponse = {
  status: number;
  body: ErrorBody;
};

const HTTP_POR_CODIGO: Record<DomainErrorCode, number> = {
  ESTADO_INVALIDO: 409,
  TRANSICION_INVALIDA: 409,
  CAPACIDAD_INSUFICIENTE: 422,
  VEHICULO_NO_REGISTRADO: 422,
  VEHICULO_YA_REGISTRADO: 409,
  PATENTE_INVALIDA: 422,
  COORDENADAS_FALTANTES: 412,
  COORDENADAS_INVALIDAS: 400,
  ENVIO_NO_DISPONIBLE: 409,
  TRANSPORTISTA_OCUPADO: 422,
  TRANSPORTISTA_NO_DISPONIBLE: 403,
  RESEÑA_DUPLICADA: 409,
  ENVIO_NO_ENTREGADO: 400,
};

export function mapDomainErrorAHttp(error: DomainError): HttpErrorResponse {
  return {
    status: HTTP_POR_CODIGO[error.code],
    body: {
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    },
  };
}

export function errorDesconocidoAHttp(error: unknown): HttpErrorResponse {
  if (error instanceof DomainError) {
    return mapDomainErrorAHttp(error);
  }

  const mensaje = error instanceof Error ? error.message : "Error interno del servidor";

  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: mensaje,
      },
    },
  };
}

export function errorHttp(code: string, message: string, status: number, details?: Record<string, unknown>): HttpErrorResponse {
  return {
    status,
    body: {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
  };
}
