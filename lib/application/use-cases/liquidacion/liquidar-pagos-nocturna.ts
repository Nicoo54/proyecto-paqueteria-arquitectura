import {
  calcularDesgloseLiquidacion,
  PORCENTAJE_COMISION_DEFAULT,
} from "../../../domain/liquidacion/calculo";
import {
  marcarLiberado,
  marcarLiquidado,
  marcarRevisionManual,
} from "../../../domain/liquidacion/state-machine";
import type { Transaccion } from "../../../domain/liquidacion/types";
import type {
  DistributedLock,
  PasarelaDePagos,
  Reloj,
  ResultadoConLock,
  ResultadoTransferencia,
  SolicitudTransferencia,
} from "../../ports";
import type {
  TransaccionLiquidable,
  TransaccionRepository,
  UnitOfWork,
} from "../../repositories";

export const CLAVE_LOCK_LIQUIDACION = "liquidacion-nocturna";

export const MAX_REINTENTOS_TRANSFERENCIA = 3;
export const BACKOFF_MS = [1000, 2000, 4000] as const;

export type ResultadoCorridaLiquidacion = {
  procesados: number;
  liquidados: number;
  revisionManual: number;
  fallidosTransitorios: number;
  detalles: ResultadoPorTransaccion[];
};

export type ResultadoPorTransaccion = {
  idReferenciaExterna: string;
  envioId: number;
  estadoFinal: Transaccion["estadoPago"];
  motivo?: string;
};

export type DependenciasLiquidacion = {
  transacciones: TransaccionRepository;
  pasarela: PasarelaDePagos;
  lock: DistributedLock;
  uow: UnitOfWork;
  reloj: Reloj;
  porcentajeComision?: number;
  maxReintentos?: number;
  backoffMs?: readonly number[];
  esperar?: (ms: number) => Promise<void>;
};

export class LiquidarPagosNocturnaUseCase {
  private readonly porcentajeComision: number;
  private readonly maxReintentos: number;
  private readonly backoffMs: readonly number[];
  private readonly esperar: (ms: number) => Promise<void>;

  constructor(private readonly deps: DependenciasLiquidacion) {
    this.porcentajeComision = deps.porcentajeComision ?? PORCENTAJE_COMISION_DEFAULT;
    this.maxReintentos = deps.maxReintentos ?? MAX_REINTENTOS_TRANSFERENCIA;
    this.backoffMs = deps.backoffMs ?? BACKOFF_MS;
    this.esperar = deps.esperar ?? defaultEsperar;
  }

  async ejecutar(): Promise<ResultadoConLock<ResultadoCorridaLiquidacion>> {
    return this.deps.lock.conLock(CLAVE_LOCK_LIQUIDACION, () => this.correr());
  }

  private async correr(): Promise<ResultadoCorridaLiquidacion> {
    const liquidables = await this.deps.transacciones.listarLiquidablesConDetalles();

    const detalles: ResultadoPorTransaccion[] = [];
    let liquidados = 0;
    let revisionManual = 0;
    let fallidosTransitorios = 0;

    for (const item of liquidables) {
      const resultado = await this.procesarUna(item);
      detalles.push(resultado);
      if (resultado.estadoFinal === "LIQUIDADO") liquidados++;
      else if (resultado.estadoFinal === "REVISION_MANUAL") revisionManual++;
      else if (resultado.estadoFinal === "LIBERADO") fallidosTransitorios++;
    }

    return {
      procesados: liquidables.length,
      liquidados,
      revisionManual,
      fallidosTransitorios,
      detalles,
    };
  }

  private async procesarUna(item: TransaccionLiquidable): Promise<ResultadoPorTransaccion> {
    const desglose = calcularDesgloseLiquidacion({
      envioId: item.envio.id,
      transportistaDni: item.transportista.dni,
      aliasBancario: item.transportista.aliasBancario,
      costoEnvio: item.envio.costo,
      multiplicadorZonaCaliente: item.envio.zonaCalienteMultiplicador ?? 1,
      porcentajeComision: this.porcentajeComision,
      idReferenciaExterna: item.transaccion.idReferenciaExterna,
    });

    const txLiberada = await this.deps.uow.ejecutar(async () => {
      const liberada = marcarLiberado(item.transaccion);
      return this.deps.transacciones.guardar(liberada);
    });

    const solicitud: SolicitudTransferencia = {
      idempotencyKey: txLiberada.idReferenciaExterna,
      aliasDestino: desglose.aliasBancario,
      monto: desglose.montoTransportista,
      descripcion: `Liquidación envío ${desglose.envioId}`,
    };

    const resultado = await this.transferirConReintentos(solicitud);

    if (resultado.tipo === "EXITOSA") {
      await this.deps.uow.ejecutar(async () => {
        const liquidada = marcarLiquidado(txLiberada, {
          fechaLiquidacion: this.deps.reloj.ahora().toISOString(),
          montoComisionPlataforma: desglose.montoComisionPlataforma,
          montoTransportista: desglose.montoTransportista,
          idTransferenciaExterna: resultado.idTransferenciaExterna,
        });
        return this.deps.transacciones.guardar(liquidada);
      });
      return {
        idReferenciaExterna: txLiberada.idReferenciaExterna,
        envioId: desglose.envioId,
        estadoFinal: "LIQUIDADO",
      };
    }

    if (resultado.tipo === "RECHAZADA") {
      await this.deps.uow.ejecutar(async () => {
        const enRevision = marcarRevisionManual(txLiberada);
        return this.deps.transacciones.guardar(enRevision);
      });
      return {
        idReferenciaExterna: txLiberada.idReferenciaExterna,
        envioId: desglose.envioId,
        estadoFinal: "REVISION_MANUAL",
        motivo: resultado.motivo,
      };
    }

    return {
      idReferenciaExterna: txLiberada.idReferenciaExterna,
      envioId: desglose.envioId,
      estadoFinal: "LIBERADO",
      motivo: resultado.mensaje,
    };
  }

  private async transferirConReintentos(
    solicitud: SolicitudTransferencia
  ): Promise<ResultadoTransferencia> {
    let intento = 0;
    let ultimoError: ResultadoTransferencia | null = null;

    while (intento <= this.maxReintentos) {
      const resultado = await this.deps.pasarela.transferir(solicitud);

      if (resultado.tipo !== "ERROR_TEMPORAL") {
        return resultado;
      }

      ultimoError = resultado;

      if (intento < this.maxReintentos) {
        const espera = this.backoffMs[intento] ?? this.backoffMs[this.backoffMs.length - 1] ?? 0;
        await this.esperar(espera);
      }
      intento++;
    }

    return ultimoError ?? { tipo: "ERROR_TEMPORAL", mensaje: "Sin respuesta de la pasarela" };
  }
}

function defaultEsperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
