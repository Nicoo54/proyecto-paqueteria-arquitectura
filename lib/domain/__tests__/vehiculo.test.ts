import { PatenteInvalida } from "../errors";
import { admiteCategoriaPaquete } from "../vehiculo/types";
import {
  esPatenteValida,
  normalizarPatente,
  requierePatente,
  validarPatente,
} from "../vehiculo/validations";
import { describe, it, expect } from "./_runner";

describe("Vehiculo - capacidad por categoría", () => {
  it("BICI solo admite S", () => {
    expect(admiteCategoriaPaquete("BICI", "S")).toBeTrue();
    expect(admiteCategoriaPaquete("BICI", "M")).toBeFalse();
    expect(admiteCategoriaPaquete("BICI", "L")).toBeFalse();
  });

  it("MOTO admite S y M, no L", () => {
    expect(admiteCategoriaPaquete("MOTO", "S")).toBeTrue();
    expect(admiteCategoriaPaquete("MOTO", "M")).toBeTrue();
    expect(admiteCategoriaPaquete("MOTO", "L")).toBeFalse();
  });

  it("AUTO admite todas", () => {
    expect(admiteCategoriaPaquete("AUTO", "S")).toBeTrue();
    expect(admiteCategoriaPaquete("AUTO", "M")).toBeTrue();
    expect(admiteCategoriaPaquete("AUTO", "L")).toBeTrue();
  });
});

describe("Vehiculo - patente", () => {
  it("requiere patente para MOTO y AUTO, no para BICI", () => {
    expect(requierePatente("BICI")).toBeFalse();
    expect(requierePatente("MOTO")).toBeTrue();
    expect(requierePatente("AUTO")).toBeTrue();
  });

  it("acepta formato nuevo AB123CD", () => {
    expect(esPatenteValida("AB123CD")).toBeTrue();
  });

  it("acepta formato viejo ABC123", () => {
    expect(esPatenteValida("ABC123")).toBeTrue();
  });

  it("rechaza formatos inválidos", () => {
    expect(esPatenteValida("123ABC")).toBeFalse();
    expect(esPatenteValida("AB1234")).toBeFalse();
    expect(esPatenteValida("")).toBeFalse();
  });

  it("normaliza a mayúsculas y trimmea", () => {
    expect(normalizarPatente("  ab123cd  ")).toBe("AB123CD");
    expect(normalizarPatente(null)).toBe(null);
    expect(normalizarPatente("")).toBe(null);
  });

  it("validarPatente lanza PatenteInvalida si MOTO sin patente", () => {
    expect(() => validarPatente({ categoria: "MOTO", patente: null })).toThrow(PatenteInvalida);
  });

  it("validarPatente lanza PatenteInvalida si formato inválido", () => {
    expect(() => validarPatente({ categoria: "AUTO", patente: "XXX" })).toThrow(PatenteInvalida);
  });

  it("validarPatente no lanza si BICI sin patente", () => {
    validarPatente({ categoria: "BICI", patente: null });
  });
});
