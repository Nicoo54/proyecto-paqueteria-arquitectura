import { distanciaMetros, distanciaKilometros } from "../geo/haversine";
import { estaEnGeofence, evaluarGeofence, RADIO_GEOFENCE_DEFAULT_M } from "../geo/geofence";
import { describe, it, expect } from "./_runner";
import { posicionEnDestino, posicionEnOrigen, posicionLejana } from "./_fixtures";

describe("Geo - Haversine", () => {
  it("distancia entre el mismo punto es 0", () => {
    const d = distanciaMetros(posicionEnOrigen, posicionEnOrigen);
    expect(d).toBeCloseTo(0, 0.001);
  });

  it("distancia Bahía Blanca origen-destino ronda los 1.5 km", () => {
    const d = distanciaKilometros(posicionEnOrigen, posicionEnDestino);
    expect(d).toBeCloseTo(1.5, 0.3);
  });

  it("distancia simétrica: A→B = B→A", () => {
    const ab = distanciaMetros(posicionEnOrigen, posicionEnDestino);
    const ba = distanciaMetros(posicionEnDestino, posicionEnOrigen);
    expect(ab).toBeCloseTo(ba, 0.001);
  });
});

describe("Geo - Geofence", () => {
  it("estaEnGeofence true si el punto coincide con el centro", () => {
    expect(estaEnGeofence(posicionEnOrigen, { centro: posicionEnOrigen, radioM: 50 })).toBeTrue();
  });

  it("estaEnGeofence false si el punto está lejos del centro", () => {
    expect(estaEnGeofence(posicionLejana, { centro: posicionEnOrigen, radioM: 100 })).toBeFalse();
  });

  it("evaluarGeofence detecta EN_ORIGEN", () => {
    const r = evaluarGeofence(posicionEnOrigen, posicionEnOrigen, posicionEnDestino);
    expect(r).toBe("EN_ORIGEN");
  });

  it("evaluarGeofence detecta EN_DESTINO", () => {
    const r = evaluarGeofence(posicionEnDestino, posicionEnOrigen, posicionEnDestino);
    expect(r).toBe("EN_DESTINO");
  });

  it("evaluarGeofence FUERA si no coincide", () => {
    const r = evaluarGeofence(posicionLejana, posicionEnOrigen, posicionEnDestino);
    expect(r).toBe("FUERA");
  });

  it("radio default es 100 metros", () => {
    expect(RADIO_GEOFENCE_DEFAULT_M).toBe(100);
  });
});
