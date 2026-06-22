// Pipeline 3 — Procesamiento analítico nocturno
//
// Batch nocturno fusionado que produce dos artefactos a partir de los
// envíos del día anterior:
//  · Zonas Calientes vigentes para el día actual (alimentan al
//    Pipeline 2 y se visualizan en la app del transportista).
//  · Métrica diaria global (consumida por helpers / admin).
//
// Comparten fuente, ventana y costo de lectura: por eso se fusionan
// en un único job. Patrón Batch-Secuencial con Pipe-and-Filters
// interno. Lock distribuido por PostgreSQL advisory lock para evitar
// que dos corridas se solapen. Idempotente: la corrida se puede
// reintentar (UPSERT en métrica + reemplazo del set de zonas).

import type { Envio } from "../../../domain/envio/types";
import type { DistributedLock, ResultadoConLock, Reloj } from "../../ports";
import type {
  EnvioRepository,
  MetricaDiaria,
  MetricaRepository,
  ZonaCaliente,
  ZonaCalienteRepository,
} from "../../repositories";

export const CLAVE_LOCK_ANALITICA = "analitica-nocturna";

// Comisión sobre Envio.costo que la plataforma se queda; el resto va
// al transportista. Igual al default usado por el Pipeline 4 de
// Liquidación, para mantener coherencia.
export const PORCENTAJE_COMISION_DEFAULT = 0.15;

// Tamaño de la celda del grid geográfico utilizada para agrupar
// orígenes y detectar zonas. ~0.005° ≈ 555 m. Configurable.
export const TAMAÑO_CELDA_GRADOS = 0.005;

// Umbral mínimo de densidad por celda para considerarla candidata a
// Zona Caliente. Configurable según volumen real del sistema.
export const UMBRAL_DENSIDAD_MIN = 3;

// Radio que cubre cada zona detectada, en metros.
export const RADIO_ZONA_M = 600;

// Multiplicador de precio aplicado a Zonas Calientes. Constante en
// esta versión; podría volverse proporcional a la densidad relativa.
export const MULTIPLICADOR_PRECIO_ZONA = 1.5;

export type ResultadoCorridaAnalitica = {
  fechaReporte: Date;
  envíosProcesados: number;
  zonasInsertadas: number;
  zonasVencidas: number;
  metrica: MetricaDiaria;
};

export type DependenciasAnalitica = {
  envios: EnvioRepository;
  zonas: ZonaCalienteRepository;
  metricas: MetricaRepository;
  lock: DistributedLock;
  reloj: Reloj;
  porcentajeComision?: number;
  tamañoCeldaGrados?: number;
  umbralDensidadMin?: number;
  radioZonaM?: number;
  multiplicadorPrecio?: number;
};

export class CalcularAnaliticaNocturnaUseCase {
  private readonly porcentajeComision: number;
  private readonly tamañoCelda: number;
  private readonly umbralDensidad: number;
  private readonly radioZona: number;
  private readonly multiplicadorPrecio: number;

  constructor(private readonly deps: DependenciasAnalitica) {
    this.porcentajeComision = deps.porcentajeComision ?? PORCENTAJE_COMISION_DEFAULT;
    this.tamañoCelda = deps.tamañoCeldaGrados ?? TAMAÑO_CELDA_GRADOS;
    this.umbralDensidad = deps.umbralDensidadMin ?? UMBRAL_DENSIDAD_MIN;
    this.radioZona = deps.radioZonaM ?? RADIO_ZONA_M;
    this.multiplicadorPrecio = deps.multiplicadorPrecio ?? MULTIPLICADOR_PRECIO_ZONA;
  }

  async ejecutar(): Promise<ResultadoConLock<ResultadoCorridaAnalitica>> {
    return this.deps.lock.conLock(CLAVE_LOCK_ANALITICA, () => this.correr());
  }

  private async correr(): Promise<ResultadoCorridaAnalitica> {
    const ahora = this.deps.reloj.ahora();
    const hoy = inicioDelDia(ahora);
    const ayer = sumarDias(hoy, -1);

    const enviosDelDia = await this.deps.envios.listarEnRango(ayer, hoy);

    const zonasNuevas = this.calcularZonas(enviosDelDia, hoy);
    const zonasVencidas = await this.deps.zonas.vencerHasta(hoy);
    await this.deps.zonas.insertarVarias(zonasNuevas);

    const metrica = this.calcularMetrica(enviosDelDia, ayer);
    const guardada = await this.deps.metricas.upsert(metrica);

    return {
      fechaReporte: ayer,
      envíosProcesados: enviosDelDia.length,
      zonasInsertadas: zonasNuevas.length,
      zonasVencidas,
      metrica: guardada,
    };
  }

  private calcularZonas(envios: Envio[], hoy: Date): ZonaCaliente[] {
    const celdas = new Map<string, Envio[]>();
    for (const e of envios) {
      const key = this.claveCelda(e.origen.lat, e.origen.lng);
      const arr = celdas.get(key);
      if (arr) arr.push(e);
      else celdas.set(key, [e]);
    }

    const manana = sumarDias(hoy, 1);
    const zonas: ZonaCaliente[] = [];

    for (const grupo of celdas.values()) {
      if (grupo.length < this.umbralDensidad) continue;

      const centroide = this.centroide(grupo);
      zonas.push({
        centro: centroide,
        radioM: this.radioZona,
        multiplicadorPrecio: this.multiplicadorPrecio,
        fechaVigenciaInicio: hoy,
        fechaVigenciaFin: manana,
      });
    }

    return zonas;
  }

  private calcularMetrica(envios: Envio[], fecha: Date): MetricaDiaria {
    const entregados = envios.filter((e) => e.estado === "ENTREGADO");
    const ganancia = entregados.reduce(
      (acc, e) => acc + e.costo * this.porcentajeComision,
      0
    );
    return {
      fechaReporte: fecha,
      cantidadEnviosTotales: envios.length,
      gananciaNetaPlataforma: redondearDosDecimales(ganancia),
    };
  }

  private claveCelda(lat: number, lng: number): string {
    const x = Math.floor(lat / this.tamañoCelda);
    const y = Math.floor(lng / this.tamañoCelda);
    return `${x}:${y}`;
  }

  private centroide(envios: Envio[]): { lat: number; lng: number } {
    const sumaLat = envios.reduce((acc, e) => acc + e.origen.lat, 0);
    const sumaLng = envios.reduce((acc, e) => acc + e.origen.lng, 0);
    return {
      lat: sumaLat / envios.length,
      lng: sumaLng / envios.length,
    };
  }
}

function inicioDelDia(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function sumarDias(d: Date, dias: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + dias);
  return x;
}

function redondearDosDecimales(n: number): number {
  return Math.round(n * 100) / 100;
}
