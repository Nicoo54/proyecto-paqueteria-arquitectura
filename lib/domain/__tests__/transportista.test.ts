import { TransicionInvalida, VehiculoNoRegistrado } from "../errors";
import {
  marcarOcupado,
  ponerseDisponible,
  ponerseNoDisponible,
  puedeTransicionar,
} from "../transportista/state-machine";
import { describe, it, expect } from "./_runner";
import {
  transportistaDisponible,
  transportistaNoDisponible,
  transportistaOcupado,
  transportistaSinVehiculo,
} from "./_fixtures";

describe("Transportista - máquina de estados", () => {
  it("NO_DISPONIBLE solo puede ir a DISPONIBLE", () => {
    expect(puedeTransicionar("NO_DISPONIBLE", "DISPONIBLE")).toBeTrue();
    expect(puedeTransicionar("NO_DISPONIBLE", "OCUPADO")).toBeFalse();
  });

  it("DISPONIBLE puede ir a NO_DISPONIBLE u OCUPADO", () => {
    expect(puedeTransicionar("DISPONIBLE", "NO_DISPONIBLE")).toBeTrue();
    expect(puedeTransicionar("DISPONIBLE", "OCUPADO")).toBeTrue();
  });

  it("OCUPADO puede volver a DISPONIBLE o NO_DISPONIBLE", () => {
    expect(puedeTransicionar("OCUPADO", "DISPONIBLE")).toBeTrue();
    expect(puedeTransicionar("OCUPADO", "NO_DISPONIBLE")).toBeTrue();
  });

  it("ponerseDisponible falla si no tiene vehículo registrado", () => {
    expect(() => ponerseDisponible(transportistaSinVehiculo)).toThrow(VehiculoNoRegistrado);
  });

  it("ponerseDisponible desde NO_DISPONIBLE funciona si hay vehículo", () => {
    const resultado = ponerseDisponible(transportistaNoDisponible);
    expect(resultado.estado).toBe("DISPONIBLE");
  });

  it("ponerseDisponible es idempotente si ya está DISPONIBLE", () => {
    const resultado = ponerseDisponible(transportistaDisponible);
    expect(resultado.estado).toBe("DISPONIBLE");
  });

  it("marcarOcupado es idempotente si ya está OCUPADO", () => {
    const resultado = marcarOcupado(transportistaOcupado);
    expect(resultado.estado).toBe("OCUPADO");
  });

  it("marcarOcupado desde NO_DISPONIBLE falla", () => {
    expect(() => marcarOcupado(transportistaNoDisponible)).toThrow(TransicionInvalida);
  });

  it("ponerseNoDisponible desde DISPONIBLE funciona", () => {
    const resultado = ponerseNoDisponible(transportistaDisponible);
    expect(resultado.estado).toBe("NO_DISPONIBLE");
  });
});
