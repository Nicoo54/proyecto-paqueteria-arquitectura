import type {
  PasarelaDePagos,
  ResultadoTransferencia,
  SolicitudTransferencia,
} from "../ports/pasarela-pagos";

export type Responder = (solicitud: SolicitudTransferencia, intento: number) => ResultadoTransferencia;

export class InMemoryPasarelaDePagos implements PasarelaDePagos {
  private readonly llamadas: { solicitud: SolicitudTransferencia; intento: number }[] = [];
  private readonly intentosPorClave = new Map<string, number>();
  private responder: Responder;

  constructor(responder: Responder = () => ({ tipo: "EXITOSA", idTransferenciaExterna: "default" })) {
    this.responder = responder;
  }

  setResponder(responder: Responder): void {
    this.responder = responder;
  }

  historial(): readonly { solicitud: SolicitudTransferencia; intento: number }[] {
    return this.llamadas;
  }

  intentosPara(idempotencyKey: string): number {
    return this.intentosPorClave.get(idempotencyKey) ?? 0;
  }

  async transferir(solicitud: SolicitudTransferencia): Promise<ResultadoTransferencia> {
    const intento = (this.intentosPorClave.get(solicitud.idempotencyKey) ?? 0) + 1;
    this.intentosPorClave.set(solicitud.idempotencyKey, intento);
    this.llamadas.push({ solicitud, intento });
    return this.responder(solicitud, intento);
  }
}
