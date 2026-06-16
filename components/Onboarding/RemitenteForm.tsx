"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOnboardingRemitente } from "@/features/landing/hooks/useOnboardingRemitente";
import { useValidarDni } from "@/features/landing/hooks/useValidarDni";

export function RemitenteForm({ onExito }: { onExito: () => void }) {
  const {
    dni,
    setDni,
    errorDni,
    setErrorDni,
    isSubmitting,
    handleSubmit,
    validarDni,
  } = useOnboardingRemitente(onExito);

  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Último paso
        </h1>
        <p className="text-slate-500">
          Ingresá tu DNI para facturación y seguridad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
