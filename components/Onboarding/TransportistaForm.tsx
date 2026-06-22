"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectorVehiculo from "./SelectorVehiculo";
import { useOnboardingTransportista } from "@/features/landing/hooks/useOnboardingTransportista";

export default function TransportistaForm({
  onExito,
}: {
  onExito: () => void;
}) {
  const {
    dni,
    setDni,
    categoria,
    setCategoria,
    patente,
    setPatente,
    aliasBancario,
    setAliasBancario,
    requierePatente,
    errorDni,
    setErrorDni,
    errorPatente,
    setErrorPatente,
    errorCategoria,
    setErrorCategoria,
    errorAliasBancario,
    setErrorAliasBancario,
    errorGeneral,
    isSubmitting,
    handleSubmit,
    validarDni,
    validarPatente,
    validarAliasBancario,
  } = useOnboardingTransportista(onExito);

  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Último paso
        </h1>
        <p className="text-slate-500">
          Completá tus datos para que podamos asignarte los viajes adecuados.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DNI */}
        <div className="space-y-2">
          <Label htmlFor="dni" className="text-sm font-semibold text-slate-900">
            DNI
          </Label>
          <Input
            id="dni"
            placeholder="12345678"
            inputMode="numeric"
            value={dni}
            onChange={(e) => {
              setDni(e.target.value.replace(/\D/g, ""));
              if (errorDni) setErrorDni(null);
            }}
            onBlur={(e) => validarDni(e.target.value)}
            className={`h-12 text-lg bg-slate-50 ${errorDni ? "border-red-500" : "border-slate-200"}`}
          />
          {errorDni && (
            <p className="text-sm text-red-500 font-medium">{errorDni}</p>
          )}
        </div>

        {/* VEHÍCULO */}
        <Suspense
          fallback={
            <div className="space-y-3 pt-2">
              <Label className="text-sm font-semibold text-slate-900">
                ¿Qué vehículo usás?
              </Label>
              <div className="flex items-center justify-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          }
        >
          <SelectorVehiculo
            categoriaSeleccionada={categoria}
            onChange={(val) => {
              setCategoria(val);
              if (errorCategoria) setErrorCategoria(null);
            }}
            limpiarError={() => setErrorPatente(null)}
          />
        </Suspense>
        {errorCategoria && (
          <p className="text-sm text-red-500 font-medium -mt-4">
            {errorCategoria}
          </p>
        )}

        {/* PATENTE — solo si no es BICI y hay categoría seleccionada */}
        {requierePatente && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pt-2">
            <Label
              htmlFor="patente"
              className="text-sm font-semibold text-slate-900"
            >
              Número de Patente
            </Label>
            <Input
              id="patente"
              placeholder="AA123AA o AAA123"
              value={patente}
              onChange={(e) => {
                setPatente(e.target.value.toUpperCase());
                if (errorPatente) setErrorPatente(null);
              }}
              onBlur={(e) => validarPatente(e.target.value)}
              className={`h-12 text-lg uppercase bg-slate-50 ${errorPatente ? "border-red-500" : "border-slate-200"}`}
            />
            {errorPatente && (
              <p className="text-sm text-red-500 font-medium">{errorPatente}</p>
            )}
          </div>
        )}

        {/* CBU / CVU / ALIAS */}
        <div className="space-y-2">
          <Label
            htmlFor="aliasBancario"
            className="text-sm font-semibold text-slate-900"
          >
            CBU, CVU o Alias bancario
          </Label>
          <Input
            id="aliasBancario"
            placeholder="banco.nombre.apellido o 22 dígitos"
            value={aliasBancario}
            onChange={(e) => {
              setAliasBancario(e.target.value);
              if (errorAliasBancario) setErrorAliasBancario(null);
            }}
            onBlur={(e) => validarAliasBancario(e.target.value)}
            className={`h-12 text-lg bg-slate-50 ${errorAliasBancario ? "border-red-500" : "border-slate-200"}`}
          />
          {errorAliasBancario && (
            <p className="text-sm text-red-500 font-medium">
              {errorAliasBancario}
            </p>
          )}
          <p className="text-xs text-slate-400">
            Lo usamos para acreditarte las ganancias de cada viaje.
          </p>
        </div>

        {errorGeneral && (
          <p className="text-sm text-red-500 font-medium text-center">
            {errorGeneral}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 text-lg font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 rounded-xl mt-8"
        >
          {isSubmitting ? "Finalizando..." : "Confirmar y continuar"}
        </Button>
      </form>
    </div>
  );
}
