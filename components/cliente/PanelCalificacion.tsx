"use client";

import { Star, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCalificacion } from "@/features/remitente/hooks/useCalificacion";

interface PanelCalificacionProps {
  codigoEnvio: string;
  nombreTransportista: string;
  resenaPrevia?: { puntaje: number; comentario?: string };
}

export default function PanelCalificacion({
  codigoEnvio,
  nombreTransportista,
  resenaPrevia,
}: PanelCalificacionProps) {
  const router = useRouter();
  const hookState = useCalificacion(codigoEnvio, resenaPrevia);

  if (hookState.showReportPrompt) {
    return <VistaReporte hookState={hookState} />;
  }

  if (hookState.yaCalificado) {
    return (
      <VistaLectura
        hookState={hookState}
        router={router}
        codigoEnvio={codigoEnvio}
      />
    );
  }

  return (
    <VistaInteractiva
      hookState={hookState}
      router={router}
      codigoEnvio={codigoEnvio}
      nombreTransportista={nombreTransportista}
    />
  );
}

function VistaReporte({
  hookState,
}: {
  hookState: ReturnType<typeof useCalificacion>;
}) {
  return (
    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-center animate-in zoom-in-95 duration-300">
      <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-3" />
      <h3 className="font-bold text-rose-900 mb-1">
        Lamentamos tu mala experiencia
      </h3>
      <p className="text-sm text-rose-700 mb-4 max-w-sm mx-auto">
        Notamos que calificaste el viaje negativamente. ¿Deseás abrir un ticket
        de soporte para que nuestro equipo investigue el caso?
      </p>
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          onClick={() => hookState.setShowReportPrompt(false)}
          className="border-rose-200 text-rose-700 hover:bg-rose-100"
        >
          No, gracias
        </Button>
        <Button
          onClick={hookState.irASoporte}
          className="bg-rose-600 text-white hover:bg-rose-700"
        >
          Sí, abrir reporte
        </Button>
      </div>
    </div>
  );
}

function VistaLectura({
  hookState,
  router,
  codigoEnvio,
}: {
  hookState: ReturnType<typeof useCalificacion>;
  router: any;
  codigoEnvio: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
      <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
      <h3 className="font-bold text-slate-900 text-sm mb-2">
        Ya calificaste este viaje
      </h3>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= hookState.puntaje
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }`}
          />
        ))}
      </div>
      {hookState.comentario && (
        <p className="text-xs text-slate-500 italic mt-1 max-w-xs">
          "{hookState.comentario}"
        </p>
      )}

      <button
        onClick={() =>
          router.push(`/cliente/soporte/nuevo?envio=${codigoEnvio}`)
        }
        className="mt-4 text-xs font-bold text-rose-500 hover:text-rose-700 underline underline-offset-2 flex items-center gap-1"
      >
        <AlertTriangle className="w-3.5 h-3.5" /> Reportar un problema con este
        envío
      </button>
    </div>
  );
}

function VistaInteractiva({
  hookState,
  router,
  codigoEnvio,
  nombreTransportista,
}: {
  hookState: ReturnType<typeof useCalificacion>;
  router: any;
  codigoEnvio: string;
  nombreTransportista: string;
}) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 animate-in fade-in">
      <form onSubmit={hookState.enviarCalificacion}>
        <div className="text-center mb-4">
          <h3 className="font-black text-slate-900 text-lg">
            ¿Cómo fue tu experiencia?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Calificá a {nombreTransportista} para ayudar a la comunidad.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={hookState.isSubmitting}
              onClick={() => hookState.setPuntaje(star)}
              onMouseEnter={() => hookState.setHoverPuntaje(star)}
              onMouseLeave={() => hookState.setHoverPuntaje(0)}
              className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hookState.hoverPuntaje || hookState.puntaje)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-200"
                }`}
              />
            </button>
          ))}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${hookState.puntaje > 0 ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <textarea
            disabled={hookState.isSubmitting}
            value={hookState.comentario}
            onChange={(e) => hookState.setComentario(e.target.value)}
            placeholder="Opcional: Dejá un comentario sobre el servicio..."
            className="w-full h-20 p-3 text-sm rounded-xl border border-slate-200 bg-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3 disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={hookState.isSubmitting}
            className="w-full font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 h-11 rounded-xl"
          >
            {hookState.isSubmitting ? "Enviando..." : "Enviar calificación"}
          </Button>
        </div>
      </form>

      {!hookState.isSubmitting && hookState.puntaje === 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() =>
              router.push(`/cliente/soporte/nuevo?envio=${codigoEnvio}`)
            }
            className="text-xs font-bold text-rose-500 hover:text-rose-700 underline underline-offset-2 flex items-center justify-center gap-1 mx-auto"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Tuve un problema grave con
            el envío
          </button>
        </div>
      )}
    </div>
  );
}
