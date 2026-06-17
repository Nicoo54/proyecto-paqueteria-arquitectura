import { useState } from "react";
import { useRouter } from "next/navigation";
import { calificacionService } from "../services/calificacionService";

export function useCalificacion(
  codigoEnvio: string,
  resenaPrevia?: { puntaje: number; comentario?: string },
) {
  const router = useRouter();

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
      await calificacionService.enviarResena({
        codigo_seguimiento: codigoEnvio,
        puntaje,
        comentario,
      });

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
    // Redirigimos a la pantalla de nuevo ticket
    // TODO: Cambiar ref
    router.push("/cliente/soporte/nuevo");
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
