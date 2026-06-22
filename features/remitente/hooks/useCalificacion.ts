"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calificacionService } from "../services/calificacionService";
import { useApiClient } from "@/shared/api-client";

export function useCalificacion(
  codigoEnvio: string,
  resenaPrevia?: { puntaje: number; comentario?: string | null },
) {
  const router = useRouter();
  const { apiFetch } = useApiClient();

  const [yaCalificado, setYaCalificado] = useState(!!resenaPrevia);
  const [puntaje, setPuntaje] = useState(resenaPrevia?.puntaje || 0);
  const [hoverPuntaje, setHoverPuntaje] = useState(0);
  const [comentario, setComentario] = useState(resenaPrevia?.comentario || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportPrompt, setShowReportPrompt] = useState(false);

  const enviarCalificacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (puntaje === 0) return;

    setIsSubmitting(true);
    try {
      await calificacionService.enviarResena(
        codigoEnvio,
        {
          puntaje,
          comentario: comentario.trim() !== "" ? comentario.trim() : undefined,
        },
        apiFetch,
      );

      setYaCalificado(true);

      // REGLA DE NEGOCIO (CU-05): Si es 2 o menos, invitamos a reportar
      if (puntaje <= 2) {
        setShowReportPrompt(true);
      }
    } catch (error) {
      console.error("Error al guardar reseña", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const irASoporte = () => {
    router.push(`/cliente/soporte/nuevo?envio=${codigoEnvio}`);
  };

  return {
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
  };
}
