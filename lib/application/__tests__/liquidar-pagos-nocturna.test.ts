import { describe, it, expect } from "../../domain/__tests__/_runner";
import {
  InMemoryDistributedLock,
  InMemoryPasarelaDePagos,
  InMemoryTransaccionRepository,
  InMemoryUnitOfWork,
  RelojFake,
} from "../in-memory";
import {
  CLAVE_LOCK_LIQUIDACION,
  LiquidarPagosNocturnaUseCase,
} from "../use-cases/liquidacion/liquidar-pagos-nocturna";
import { liquidable } from "./_fixtures";

function armar(
  responder: (
    solicitud: { idempotencyKey: string; monto: number },
    intento: number
  ) =>
    | { tipo: "EXITOSA"; idTransferenciaExterna: string }
    | { tipo: "RECHAZADA"; motivo: string }
    | { tipo: "ERROR_TEMPORAL"; mensaje: string }
) {
  const transacciones = new InMemoryTransaccionRepository();
  const pasarela = new InMemoryPasarelaDePagos(responder);
  const lock = new InMemoryDistributedLock();
  const uow = new InMemoryUnitOfWork();
  const reloj = new RelojFake(new Date("2026-06-10T03:00:00Z"));
  const useCase = new LiquidarPagosNocturnaUseCase({
    transacciones,
    pasarela,
    lock,
    uow,
    reloj,
    maxReintentos: 3,
    backoffMs: [0, 0, 0],
    esperar: async () => {},
  });
  return { transacciones, pasarela, lock, uow, reloj, useCase };
}

describe("LiquidarPagosNocturnaUseCase - happy path", () => {
  it("dos transacciones exitosas terminan en LIQUIDADO", async () => {
    const { transacciones, useCase } = armar(() => ({
      tipo: "EXITOSA",
      idTransferenciaExterna: "tx-ext-1",
    }));
    transacciones.cargarLiquidablesConDetalles([
      liquidable("ref-1", 1001, 1000),
      liquidable("ref-2", 1002, 2000),
    ]);

    const r = await useCase.ejecutar();

    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;
    expect(r.resultado.procesados).toBe(2);
    expect(r.resultado.liquidados).toBe(2);
    expect(r.resultado.revisionManual).toBe(0);

    expect(transacciones.obtenerSync("ref-1")?.estadoPago).toBe("LIQUIDADO");
    expect(transacciones.obtenerSync("ref-2")?.estadoPago).toBe("LIQUIDADO");
  });

  it("aplica multiplicador de Zona Caliente al cálculo", async () => {
    const { transacciones, useCase } = armar(() => ({
      tipo: "EXITOSA",
      idTransferenciaExterna: "tx-ext-zc",
    }));
    transacciones.cargarLiquidablesConDetalles([liquidable("ref-zc", 2001, 1000, 2)]);

    const r = await useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;

    const liquidada = transacciones.obtenerSync("ref-zc")!;
    expect(liquidada.estadoPago).toBe("LIQUIDADO");
    expect(liquidada.montoComisionPlataforma).toBe(75);
    expect(liquidada.montoTransportista).toBe(925);
    expect(liquidada.idTransferenciaExterna).toBe("tx-ext-zc");
  });
});

describe("LiquidarPagosNocturnaUseCase - reintentos por error temporal", () => {
  it("reintenta hasta tener éxito (2 fallos transitorios + éxito)", async () => {
    const { transacciones, pasarela, useCase } = armar((_, intento) => {
      if (intento <= 2) return { tipo: "ERROR_TEMPORAL", mensaje: "timeout" };
      return { tipo: "EXITOSA", idTransferenciaExterna: "tx-tras-reintento" };
    });
    transacciones.cargarLiquidablesConDetalles([liquidable("ref-retry", 3001)]);

    const r = await useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;

    expect(r.resultado.liquidados).toBe(1);
    expect(transacciones.obtenerSync("ref-retry")?.estadoPago).toBe("LIQUIDADO");
    expect(pasarela.intentosPara("ref-retry")).toBe(3);
  });

  it("agota reintentos y queda LIBERADO para próxima corrida", async () => {
    const { transacciones, pasarela, useCase } = armar(() => ({
      tipo: "ERROR_TEMPORAL",
      mensaje: "down",
    }));
    transacciones.cargarLiquidablesConDetalles([liquidable("ref-falla", 3002)]);

    const r = await useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;

    expect(r.resultado.liquidados).toBe(0);
    expect(r.resultado.fallidosTransitorios).toBe(1);
    expect(r.resultado.revisionManual).toBe(0);
    expect(transacciones.obtenerSync("ref-falla")?.estadoPago).toBe("LIBERADO");
    expect(pasarela.intentosPara("ref-falla")).toBe(4);
  });
});

describe("LiquidarPagosNocturnaUseCase - rechazo de la pasarela", () => {
  it("rechazo permanente termina en REVISION_MANUAL", async () => {
    const { transacciones, useCase } = armar(() => ({
      tipo: "RECHAZADA",
      motivo: "Cuenta inexistente",
    }));
    transacciones.cargarLiquidablesConDetalles([liquidable("ref-rechazo", 4001)]);

    const r = await useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;

    expect(r.resultado.revisionManual).toBe(1);
    expect(transacciones.obtenerSync("ref-rechazo")?.estadoPago).toBe("REVISION_MANUAL");
  });
});

describe("LiquidarPagosNocturnaUseCase - lock distribuido", () => {
  it("si el lock está tomado, no procesa nada", async () => {
    const { lock, transacciones, pasarela, useCase } = armar(() => ({
      tipo: "EXITOSA",
      idTransferenciaExterna: "no-deberia-llamarse",
    }));
    transacciones.cargarLiquidablesConDetalles([liquidable("ref-blocked", 5001)]);
    lock.forzarTomado(CLAVE_LOCK_LIQUIDACION);

    const r = await useCase.ejecutar();

    expect(r.adquirido).toBeFalse();
    expect(transacciones.obtenerSync("ref-blocked")?.estadoPago).toBe("RETENIDO");
    expect(pasarela.intentosPara("ref-blocked")).toBe(0);
  });
});

describe("LiquidarPagosNocturnaUseCase - sin transacciones liquidables", () => {
  it("corrida vacía retorna estadísticas en cero", async () => {
    const { useCase } = armar(() => ({ tipo: "EXITOSA", idTransferenciaExterna: "x" }));
    const r = await useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;
    expect(r.resultado.procesados).toBe(0);
    expect(r.resultado.liquidados).toBe(0);
  });
});

describe("LiquidarPagosNocturnaUseCase - idempotencia ante reintentos", () => {
  it("usa el id_referencia_externa como idempotency key consistente", async () => {
    const { transacciones, pasarela, useCase } = armar((sol) => ({
      tipo: "EXITOSA",
      idTransferenciaExterna: `t-${sol.idempotencyKey}`,
    }));
    transacciones.cargarLiquidablesConDetalles([liquidable("ref-idem", 6001)]);

    await useCase.ejecutar();

    const historial = pasarela.historial();
    expect(historial.length).toBe(1);
    expect(historial[0].solicitud.idempotencyKey).toBe("ref-idem");
  });
});
