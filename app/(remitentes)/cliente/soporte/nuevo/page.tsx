"use client";

import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  MessageSquarePlus,
  ShieldAlert,
  PackageCheck,
} from "lucide-react";
import { useNuevoTicket } from "@/features/remitente/hooks/useNuevoTicket";

export default function NuevoTicketPage() {
  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <Suspense
        fallback={
          <div className="flex h-[50vh] items-center justify-center">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <FormularioTicket />
      </Suspense>
    </div>
  );
}

function FormularioTicket() {
  const {
    envioId,
    motivo,
    setMotivo,
    isSubmitting,
    error,
    handleSubmit,
    router,
  } = useNuevoTicket();

  return (
    <>
      <BotonVolver onBack={() => router.back()} />
      <TituloHeader />

      <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <AlertaError mensaje={error} />}
            <InsigniaEnvio envioId={envioId} />

            <div className="space-y-2">
              <Label
                htmlFor="motivo"
                className="text-sm font-bold text-slate-700"
              >
                Detalle del problema
              </Label>
              <textarea
                id="motivo"
                placeholder="Por favor, explicá detalladamente qué sucedió (ej: el paquete llegó dañado, el transportista no coincidía, retraso crítico)..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={isSubmitting}
                className="w-full min-h-40 p-4 text-sm rounded-xl border border-slate-200 bg-slate-50 resize-y focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all disabled:opacity-50"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !motivo.trim()}
              className="w-full h-14 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-md transition-all mt-4"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Abriendo caso en soporte...
                </div>
              ) : (
                "Enviar Reporte a Soporte"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

function BotonVolver({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar y volver
    </button>
  );
}

function TituloHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        Reportar Envío <MessageSquarePlus className="w-6 h-6 text-amber-500" />
      </h1>
      <p className="text-slate-500 mt-1">
        Describí el inconveniente técnico o logístico con tu entrega. Nuestro
        equipo lo resolverá.
      </p>
    </div>
  );
}

function AlertaError({ mensaje }: { mensaje: string }) {
  return (
    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 animate-in fade-in">
      <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <p className="text-sm font-medium text-rose-800">{mensaje}</p>
    </div>
  );
}

function InsigniaEnvio({ envioId }: { envioId: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
        Envío Vinculado al Reclamo
      </Label>
      <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-inner">
          <PackageCheck className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="font-mono text-base font-black text-slate-900">
            ID de Envío: #{envioId}
          </p>
        </div>
      </div>
    </div>
  );
}
