import { TransicionInvalida } from "../errors";
import { calcularDesgloseLiquidacion, PORCENTAJE_COMISION_DEFAULT } from "../liquidacion/calculo";
import {
  marcarLiberado,
  marcarLiquidado,
  marcarRevisionManual,
  puedeTransicionarPago,
} from "../liquidacion/state-machine";
import type { Transaccion } from "../liquidacion/types";
import { describe, it, expect } from "./_runner";

const txRetenida: Transaccion = {
  idReferenciaExterna: "ref-1",
  codigoSeguimiento: 1040,
  montoTotal: 1000,
  estadoPago: "RETENIDO",
};

describe("Liquidación - cálculo", () => {
  it("comisión default 15% sobre 1000 = 150 al transportista 850", () => {
    const r = calcularDesgloseLiquidacion({
      envioId: 1,
      transportistaDni: "X",
      aliasBancario: "a@b",
      costoEnvio: 1000,
      idReferenciaExterna: "ref-1",
    });
    expect(r.porcentajeComision).toBe(PORCENTAJE_COMISION_DEFAULT);
    expect(r.montoComisionPlataforma).toBe(150);
    expect(r.montoTransportista).toBe(850);
  });

  it("multiplicador zona caliente 2 reduce la comisión efectiva a la mitad", () => {
    const r = calcularDesgloseLiquidacion({
      envioId: 1,
      transportistaDni: "X",
      aliasBancario: "a@b",
      costoEnvio: 1000,
      multiplicadorZonaCaliente: 2,
      idReferenciaExterna: "ref-1",
    });
    expect(r.montoComisionPlataforma).toBe(75);
    expect(r.montoTransportista).toBe(925);
  });

  it("rechaza porcentajeComision fuera de [0,1]", () => {
    expect(() =>
      calcularDesgloseLiquidacion({
        envioId: 1,
        transportistaDni: "X",
        aliasBancario: "a@b",
        costoEnvio: 1000,
        porcentajeComision: 1.5,
        idReferenciaExterna: "ref-1",
      })
    ).toThrow(RangeError);
  });

  it("rechaza multiplicadorZonaCaliente menor a 1", () => {
    expect(() =>
      calcularDesgloseLiquidacion({
        envioId: 1,
        transportistaDni: "X",
        aliasBancario: "a@b",
        costoEnvio: 1000,
        multiplicadorZonaCaliente: 0.5,
        idReferenciaExterna: "ref-1",
      })
    ).toThrow(RangeError);
  });

  it("rechaza costoEnvio negativo", () => {
    expect(() =>
      calcularDesgloseLiquidacion({
        envioId: 1,
        transportistaDni: "X",
        aliasBancario: "a@b",
        costoEnvio: -1,
        idReferenciaExterna: "ref-1",
      })
    ).toThrow(RangeError);
  });
});

describe("Liquidación - máquina de estados", () => {
  it("RETENIDO solo va a LIBERADO", () => {
    expect(puedeTransicionarPago("RETENIDO", "LIBERADO")).toBeTrue();
    expect(puedeTransicionarPago("RETENIDO", "LIQUIDADO")).toBeFalse();
  });

  it("LIBERADO puede ir a LIQUIDADO o REVISION_MANUAL", () => {
    expect(puedeTransicionarPago("LIBERADO", "LIQUIDADO")).toBeTrue();
    expect(puedeTransicionarPago("LIBERADO", "REVISION_MANUAL")).toBeTrue();
  });

  it("LIQUIDADO es terminal", () => {
    expect(puedeTransicionarPago("LIQUIDADO", "LIBERADO")).toBeFalse();
  });

  it("REVISION_MANUAL puede pasar a LIQUIDADO", () => {
    expect(puedeTransicionarPago("REVISION_MANUAL", "LIQUIDADO")).toBeTrue();
  });

  it("marcarLiberado lleva RETENIDO → LIBERADO", () => {
    const r = marcarLiberado(txRetenida);
    expect(r.estadoPago).toBe("LIBERADO");
  });

  it("marcarLiquidado falla si está RETENIDO (debe pasar por LIBERADO primero)", () => {
    expect(() =>
      marcarLiquidado(txRetenida, {
        fechaLiquidacion: "2026-06-10T03:00:00Z",
        montoComisionPlataforma: 150,
        montoTransportista: 850,
        idTransferenciaExterna: "tx-1",
      })
    ).toThrow(TransicionInvalida);
  });

  it("marcarLiquidado funciona desde LIBERADO y registra auditoría", () => {
    const liberada = marcarLiberado(txRetenida);
    const liquidada = marcarLiquidado(liberada, {
      fechaLiquidacion: "2026-06-10T03:00:00Z",
      montoComisionPlataforma: 150,
      montoTransportista: 850,
      idTransferenciaExterna: "tx-1",
    });
    expect(liquidada.estadoPago).toBe("LIQUIDADO");
    expect(liquidada.idTransferenciaExterna).toBe("tx-1");
    expect(liquidada.montoTransportista).toBe(850);
  });

  it("marcarRevisionManual funciona desde LIBERADO", () => {
    const liberada = marcarLiberado(txRetenida);
    const rev = marcarRevisionManual(liberada);
    expect(rev.estadoPago).toBe("REVISION_MANUAL");
  });
});
