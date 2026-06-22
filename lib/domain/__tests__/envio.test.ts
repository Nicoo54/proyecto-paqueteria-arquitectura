import { TransicionInvalida } from "../errors";
import {
  esTransicionDeTransportista,
  puedeTransicionarEnvio,
  transicionarEnvio,
} from "../envio/state-machine";
import { describe, it, expect } from "./_runner";
import { envioAceptado, envioBuscando } from "./_fixtures";

describe("Envio - máquina de estados", () => {
  it("BUSCANDO puede ir a ACEPTADO o CANCELADO", () => {
    expect(puedeTransicionarEnvio("BUSCANDO", "ACEPTADO")).toBeTrue();
    expect(puedeTransicionarEnvio("BUSCANDO", "CANCELADO")).toBeTrue();
    expect(puedeTransicionarEnvio("BUSCANDO", "EN_CAMINO")).toBeFalse();
  });

  it("ACEPTADO puede ir a RETIRADO o CANCELADO", () => {
    expect(puedeTransicionarEnvio("ACEPTADO", "RETIRADO")).toBeTrue();
    expect(puedeTransicionarEnvio("ACEPTADO", "CANCELADO")).toBeTrue();
    expect(puedeTransicionarEnvio("ACEPTADO", "ENTREGADO")).toBeFalse();
  });

  it("RETIRADO puede ir a EN_CAMINO o CANCELADO", () => {
    expect(puedeTransicionarEnvio("RETIRADO", "EN_CAMINO")).toBeTrue();
    expect(puedeTransicionarEnvio("RETIRADO", "CANCELADO")).toBeTrue();
  });

  it("EN_CAMINO puede ir a ENTREGADO o CANCELADO", () => {
    expect(puedeTransicionarEnvio("EN_CAMINO", "ENTREGADO")).toBeTrue();
    expect(puedeTransicionarEnvio("EN_CAMINO", "CANCELADO")).toBeTrue();
  });

  it("ENTREGADO y CANCELADO son terminales", () => {
    expect(puedeTransicionarEnvio("ENTREGADO", "EN_CAMINO")).toBeFalse();
    expect(puedeTransicionarEnvio("CANCELADO", "BUSCANDO")).toBeFalse();
  });

  it("transicionarEnvio lanza si la transición es inválida", () => {
    expect(() => transicionarEnvio(envioBuscando, "EN_CAMINO")).toThrow(TransicionInvalida);
  });

  it("transicionarEnvio es idempotente si ya está en el estado", () => {
    const r = transicionarEnvio(envioBuscando, "BUSCANDO");
    expect(r.estado).toBe("BUSCANDO");
  });

  it("BUSCANDO → ACEPTADO produce un envío con estado ACEPTADO", () => {
    const r = transicionarEnvio(envioBuscando, "ACEPTADO");
    expect(r.estado).toBe("ACEPTADO");
  });

  it("esTransicionDeTransportista reconoce las del transportista", () => {
    expect(esTransicionDeTransportista("ACEPTADO")).toBeTrue();
    expect(esTransicionDeTransportista("RETIRADO")).toBeTrue();
    expect(esTransicionDeTransportista("EN_CAMINO")).toBeTrue();
    expect(esTransicionDeTransportista("ENTREGADO")).toBeTrue();
    expect(esTransicionDeTransportista("CANCELADO")).toBeFalse();
    expect(esTransicionDeTransportista("BUSCANDO")).toBeFalse();
  });

  it("envioAceptado tiene transportistaDni asignado", () => {
    expect(envioAceptado.transportistaDni).toBe("28987654");
  });
});
