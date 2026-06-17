"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { nuevoTicketService } from "../services/nuevoTicketService";

export function useNuevoTicket() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const envioIdUrl = searchParams.get("envio");

  const [motivo, setMotivo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!envioIdUrl) {
      router.push("/cliente/historial");
    }
  }, [envioIdUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!envioIdUrl || !motivo.trim()) {
      setError("Por favor, describí el motivo de tu reclamo.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const respuesta = await nuevoTicketService.crearTicket({
        codigo_seguimiento: envioIdUrl,
        motivo: motivo.trim(),
      });

      router.push(`/cliente/soporte/${respuesta.id}`);
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar el reclamo. Intentá de nuevo.");
      setIsSubmitting(false);
    }
  };

  return {
    envioId: envioIdUrl || "",
    motivo,
    setMotivo,
    isSubmitting,
    error,
    handleSubmit,
    router,
  };
}
