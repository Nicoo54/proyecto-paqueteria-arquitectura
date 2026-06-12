"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidarDni } from "@/lib/onboardingContent";

export default function RemitenteForm() {
  const router = useRouter();
  const [dni, setDni] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errorDni, validarDni, setErrorDni } = useValidarDni();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validarDni(dni)) {
      setIsSubmitting(false);
      return;
    }

    // TODO: Crear usuario Remitente en el backend
    setTimeout(() => {
      router.push("/cliente");
    }, 1500);
  };

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
