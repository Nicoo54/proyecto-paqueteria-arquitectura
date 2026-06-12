"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIAS_VEHICULOS } from "@/lib/onboardingContent";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get("role");

  const [role, setRole] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [categoria, setCategoria] = useState<string>("MOTO");
  const [patente, setPatente] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Cambiar a proxy cuando tenga backend
  useEffect(() => {
    if (roleFromUrl === "remitente") {
      setRole("remitente");
      // TODO: Llamar a api para crear usuario remitente
      router.push("/cliente");
    } else if (roleFromUrl === "transportista") {
      setRole("transportista");
      setIsInitializing(false);
    } else {
      router.push("/");
    }
  }, [roleFromUrl, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Crear transporitsta y vehiculo
    router.push("/transportistas");
  };

  if (isInitializing || role === "remitente") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-900">
          {role === "remitente" ? "Creando tu cuenta..." : "Cargando..."}
        </h2>
        {role === "remitente" && (
          <p className="text-slate-500 mt-2">
            Ya casi estás listo para cotizar envíos.
          </p>
        )}
      </div>
    );
  }

  if (role === "transportista") {
    return (
      <div className="min-h-screen flex flex-col items-center bg-slate-50 pt-12 px-4">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Detalles del vehículo
            </h1>
            <p className="text-slate-500">
              Contanos cómo te vas a mover para asignarte los viajes adecuados.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-900">
                ¿Qué vehículo usás?
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIAS_VEHICULOS.map((vehiculo) => (
                  <button
                    key={vehiculo.id}
                    type="button"
                    onClick={() => setCategoria(vehiculo.id)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border-2 flex flex-col items-center gap-1 ${
                      categoria === vehiculo.id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xl">{vehiculo.icon}</span>
                    {vehiculo.label}
                  </button>
                ))}
              </div>
            </div>

            {categoria !== CATEGORIAS_VEHICULOS[0].label && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <Label
                  htmlFor="patente"
                  className="text-sm font-semibold text-slate-900"
                >
                  Número de Patente
                </Label>
                <Input
                  id="patente"
                  placeholder="AA123AA"
                  required
                  value={patente}
                  onChange={(e) => setPatente(e.target.value.toUpperCase())}
                  className="h-14 text-lg uppercase bg-slate-50 border-slate-200 focus-visible:ring-slate-900 rounded-xl"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={
                isSubmitting || (categoria !== "BICI" && patente.length < 6)
              }
              className="w-full h-14 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl mt-4"
            >
              {isSubmitting ? "Guardando..." : "Comenzar a manejar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
