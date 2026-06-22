import {
  CapacidadInsuficiente,
  CoordenadasFaltantes,
  EnvioNoDisponible,
  TransportistaNoDisponible,
  TransportistaOcupado,
  VehiculoNoRegistrado,
} from "../errors";
import { aceptarEnvio } from "../transportista/aceptar-envio";
import { describe, it, expect } from "./_runner";
import {
  envioAceptado,
  envioBuscando,
  envioGrande,
  posicionEnOrigen,
  transportistaDisponible,
  transportistaNoDisponible,
  transportistaSinVehiculo,
} from "./_fixtures";

describe("aceptarEnvio - happy path", () => {
  it("transportista DISPONIBLE con MOTO acepta envío M y queda OCUPADO", () => {
    const { transportistaActualizado, envioActualizado } = aceptarEnvio({
      transportista: transportistaDisponible,
      envio: envioBuscando,
      posicionTransportista: posicionEnOrigen,
      envioEnTransitoActual: null,
    });
    expect(envioActualizado.estado).toBe("ACEPTADO");
    expect(envioActualizado.transportistaDni).toBe(transportistaDisponible.dni);
    expect(transportistaActualizado.estado).toBe("OCUPADO");
  });
});

describe("aceptarEnvio - falla", () => {
  it("VehiculoNoRegistrado si no tiene vehículo", () => {
    expect(() =>
      aceptarEnvio({
        transportista: transportistaSinVehiculo,
        envio: envioBuscando,
        posicionTransportista: posicionEnOrigen,
        envioEnTransitoActual: null,
      })
    ).toThrow(VehiculoNoRegistrado);
  });

  it("TransportistaNoDisponible si está NO_DISPONIBLE", () => {
    expect(() =>
      aceptarEnvio({
        transportista: transportistaNoDisponible,
        envio: envioBuscando,
        posicionTransportista: posicionEnOrigen,
        envioEnTransitoActual: null,
      })
    ).toThrow(TransportistaNoDisponible);
  });

  it("TransportistaOcupado si ya tiene otro envío en tránsito", () => {
    expect(() =>
      aceptarEnvio({
        transportista: transportistaDisponible,
        envio: envioBuscando,
        posicionTransportista: posicionEnOrigen,
        envioEnTransitoActual: envioAceptado,
      })
    ).toThrow(TransportistaOcupado);
  });

  it("CoordenadasFaltantes si la posición es null", () => {
    expect(() =>
      aceptarEnvio({
        transportista: transportistaDisponible,
        envio: envioBuscando,
        posicionTransportista: null,
        envioEnTransitoActual: null,
      })
    ).toThrow(CoordenadasFaltantes);
  });

  it("EnvioNoDisponible si el envío no está BUSCANDO", () => {
    expect(() =>
      aceptarEnvio({
        transportista: transportistaDisponible,
        envio: envioAceptado,
        posicionTransportista: posicionEnOrigen,
        envioEnTransitoActual: null,
      })
    ).toThrow(EnvioNoDisponible);
  });

  it("CapacidadInsuficiente si MOTO intenta llevar paquete L", () => {
    expect(() =>
      aceptarEnvio({
        transportista: transportistaDisponible,
        envio: envioGrande,
        posicionTransportista: posicionEnOrigen,
        envioEnTransitoActual: null,
      })
    ).toThrow(CapacidadInsuficiente);
  });
});
