"use client";

import { Star, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const {
    puntaje,
    setPuntaje,
    hoverPuntaje,
    setHoverPuntaje,
    comentario,
    setComentario,
    isSubmitting,
    yaCalificado,
    showReportPrompt,
    setShowReportPrompt,
    enviarCalificacion,
    irASoporte,
  } = useCalificacion(codigoEnvio, resenaPrevia);

  // VISTA 1: INVITACIÓN A ABRIR REPORTE (Puntaje bajo)
  if (showReportPrompt) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-center animate-in zoom-in-95 duration-300">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-rose-900 mb-1">
          Lamentamos tu mala experiencia
        </h3>
        <p className="text-sm text-rose-700 mb-4 max-w-sm mx-auto">
          Notamos que calificaste el viaje negativamente. ¿Deseás abrir un
          ticket de soporte para que nuestro equipo investigue el caso?
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={() => setShowReportPrompt(false)}
            className="border-rose-200 text-rose-700 hover:bg-rose-100"
          >
            No, gracias
          </Button>
          <Button
            onClick={irASoporte}
            className="bg-rose-600 text-white hover:bg-rose-700"
          >
            Sí, abrir reporte
          </Button>
        </div>
      </div>
    );
  }

  // VISTA 2: YA CALIFICADO (Lectura)
  if (yaCalificado) {
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
              className={`w-5 h-5 ${star <= puntaje ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
            />
          ))}
        </div>
        {comentario && (
          <p className="text-xs text-slate-500 italic mt-1 max-w-xs">
            "{comentario}"
          </p>
        )}
      </div>
    );
  }

  // VISTA 3: FORMULARIO INTERACTIVO DE CALIFICACIÓN
  return (
    <form
      onSubmit={enviarCalificacion}
      className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 animate-in fade-in"
    >
      <div className="text-center mb-4">
        <h3 className="font-black text-slate-900 text-lg">
          ¿Cómo fue tu experiencia?
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Calificá a {nombreTransportista} para ayudar a la comunidad.
        </p>
      </div>

      {/* ESTRELLAS INTERACTIVAS */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isSubmitting}
            onClick={() => setPuntaje(star)}
            onMouseEnter={() => setHoverPuntaje(star)}
            onMouseLeave={() => setHoverPuntaje(0)}
            className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            <Star
              className={`w-8 h-8 transition-colors ${star <= (hoverPuntaje || puntaje) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`}
            />
          </button>
        ))}
      </div>

      {/* COMENTARIO (Se despliega solo si ya tocó alguna estrella) */}
      <div
        className={`overflow-hidden transition-all duration-300 ${puntaje > 0 ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <textarea
          disabled={isSubmitting}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Opcional: Dejá un comentario sobre el servicio..."
          className="w-full h-20 p-3 text-sm rounded-xl border border-slate-200 bg-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3 disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 h-11 rounded-xl"
        >
          {isSubmitting ? "Enviando..." : "Enviar calificación"}
        </Button>
      </div>
    </form>
  );
}
