export type SolicitudTransferencia = {
  idempotencyKey: string;
  aliasDestino: string;
  monto: number;
  descripcion: string;
};

export type ResultadoTransferencia =
  | { tipo: "EXITOSA"; idTransferenciaExterna: string }
  | { tipo: "RECHAZADA"; motivo: string; codigoProveedor?: string }
  | { tipo: "ERROR_TEMPORAL"; mensaje: string };

export interface PasarelaDePagos {
  transferir(solicitud: SolicitudTransferencia): Promise<ResultadoTransferencia>;
}
