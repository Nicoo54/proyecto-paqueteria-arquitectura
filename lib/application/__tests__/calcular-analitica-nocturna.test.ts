import { describe, it, expect } from "../../domain/__tests__/_runner";
import type { Envio } from "../../domain/envio/types";
import {
  InMemoryDistributedLock,
  InMemoryEnvioRepository,
  InMemoryMetricaRepository,
  InMemoryZonaCalienteRepository,
  RelojFake,
} from "../in-memory";
import {
  CalcularAnaliticaNocturnaUseCase,
  CLAVE_LOCK_ANALITICA,
} from "../use-cases/analitica/calcular-analitica-nocturna";

function envioCerca(id: number, baseLat: number, baseLng: number, jitter = 0.001, costo = 1000, estado: Envio["estado"] = "ENTREGADO"): Envio {
  const lat = baseLat + (Math.random() - 0.5) * jitter;
  const lng = baseLng + (Math.random() - 0.5) * jitter;
  return {
    id,
    categoriaPaquete: "M",
    remitenteDni: "35123456",
    transportistaDni: estado === "BUSCANDO" ? null : "28987654",
    zonaCalienteId: null,
    origen: { lat, lng, direccion: "test" },
    destino: { lat: lat + 0.01, lng: lng + 0.01, direccion: "test destino" },
    condicionClimatica: "Despejado",
    estado,
    costo,
    createdAt: new Date("2026-06-10T15:00:00Z").toISOString(),
  };
}

function armar(reloj = new RelojFake(new Date("2026-06-11T02:00:00Z"))) {
  const envios = new InMemoryEnvioRepository();
  const zonas = new InMemoryZonaCalienteRepository();
  const metricas = new InMemoryMetricaRepository();
  const lock = new InMemoryDistributedLock();
  const useCase = new CalcularAnaliticaNocturnaUseCase({
    envios,
    zonas,
    metricas,
    lock,
    reloj,
    umbralDensidadMin: 3,
  });
  return { envios, zonas, metricas, lock, useCase, reloj };
}

describe("CalcularAnaliticaNocturnaUseCase", () => {
  it("happy path: detecta zona caliente y calcula métrica", async () => {
    const t = armar();
    // 4 envíos cerca del centro de Bahía Blanca → zona caliente
    for (let i = 1; i <= 4; i++) {
      t.envios.cargar(envioCerca(i, -38.718, -62.266));
    }

    const r = await t.useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;

    expect(r.resultado.envíosProcesados).toBe(4);
    expect(r.resultado.zonasInsertadas).toBe(1);
    expect(r.resultado.metrica.cantidadEnviosTotales).toBe(4);
    // 4 envios entregados x 1000 x 0.15 = 600
    expect(r.resultado.metrica.gananciaNetaPlataforma).toBe(600);

    expect(t.zonas.todas().length).toBe(1);
    expect(t.metricas.todas().length).toBe(1);
  });

  it("no genera zonas si no se alcanza el umbral", async () => {
    const t = armar();
    // 2 envíos < umbral 3
    t.envios.cargar(envioCerca(1, -38.718, -62.266));
    t.envios.cargar(envioCerca(2, -38.718, -62.266));

    const r = await t.useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;

    expect(r.resultado.zonasInsertadas).toBe(0);
    expect(r.resultado.metrica.cantidadEnviosTotales).toBe(2);
  });

  it("solo considera envíos del día anterior", async () => {
    const t = armar();
    // hoy = 2026-06-11 → ventana = [2026-06-10 00:00, 2026-06-11 00:00)
    t.envios.cargar({ ...envioCerca(1, -38.718, -62.266), createdAt: new Date("2026-06-09T15:00:00Z").toISOString() });
    t.envios.cargar({ ...envioCerca(2, -38.718, -62.266), createdAt: new Date("2026-06-10T15:00:00Z").toISOString() });
    t.envios.cargar({ ...envioCerca(3, -38.718, -62.266), createdAt: new Date("2026-06-11T15:00:00Z").toISOString() });

    const r = await t.useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;
    expect(r.resultado.envíosProcesados).toBe(1);
  });

  it("solo cuenta ENTREGADO para la ganancia neta", async () => {
    const t = armar();
    t.envios.cargar(envioCerca(1, -38.718, -62.266, 0.001, 1000, "ENTREGADO"));
    t.envios.cargar(envioCerca(2, -38.718, -62.266, 0.001, 1000, "CANCELADO"));
    t.envios.cargar(envioCerca(3, -38.718, -62.266, 0.001, 1000, "BUSCANDO"));

    const r = await t.useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;
    // Solo 1 entregado x 1000 x 0.15 = 150
    expect(r.resultado.metrica.gananciaNetaPlataforma).toBe(150);
    expect(r.resultado.metrica.cantidadEnviosTotales).toBe(3);
  });

  it("vence zonas anteriores antes de insertar nuevas", async () => {
    const t = armar();
    // Zona vencida ayer (fechaVigenciaFin antes de hoy 2026-06-11 00:00 UTC)
    t.zonas.cargar([
      {
        centro: { lat: -34, lng: -58 },
        radioM: 500,
        multiplicadorPrecio: 1.2,
        fechaVigenciaInicio: new Date("2026-06-09T00:00:00Z"),
        fechaVigenciaFin: new Date("2026-06-10T00:00:00Z"),
      },
    ]);

    const r = await t.useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;
    expect(r.resultado.zonasVencidas).toBe(1);
  });

  it("lock tomado → no procesa nada", async () => {
    const t = armar();
    for (let i = 1; i <= 4; i++) t.envios.cargar(envioCerca(i, -38.718, -62.266));
    t.lock.forzarTomado(CLAVE_LOCK_ANALITICA);

    const r = await t.useCase.ejecutar();
    expect(r.adquirido).toBeFalse();
    expect(t.zonas.todas().length).toBe(0);
    expect(t.metricas.todas().length).toBe(0);
  });

  it("corrida vacía: 0 envíos pero genera métrica con 0", async () => {
    const t = armar();
    const r = await t.useCase.ejecutar();
    expect(r.adquirido).toBeTrue();
    if (!r.adquirido) return;
    expect(r.resultado.envíosProcesados).toBe(0);
    expect(r.resultado.zonasInsertadas).toBe(0);
    expect(r.resultado.metrica.cantidadEnviosTotales).toBe(0);
    expect(r.resultado.metrica.gananciaNetaPlataforma).toBe(0);
  });
});
