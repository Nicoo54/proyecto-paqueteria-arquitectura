import { gestionTicketService } from "@/features/soporte/services/gestionTicketService";
import { TicketGestionDetalle } from "@/features/soporte/types/ticketGestion";
import { useState, useEffect } from "react";

export function useGestionTicket(id: string) {
  const [ticket, setTicket] = useState<TicketGestionDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [resolucionText, setResolucionText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    gestionTicketService
      .obtenerDetalleTicket(id)
      .then((data) => {
        if (!isMounted) return;
        setTicket(data);
        if (data.resolucion) setResolucionText(data.resolucion);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Error al cargar los datos del ticket.");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleResolverTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolucionText.trim() || !ticket) return;

    setIsSaving(true);
    try {
      await gestionTicketService.resolverTicket(
        ticket.codigo_reclamo,
        resolucionText,
      );
      // Actualizamos el estado local para reflejar que ya está cerrado
      setTicket({ ...ticket, estado: "RESUELTO", resolucion: resolucionText });
      setMensajeExito(true);
    } catch (err) {
      setError("No se pudo guardar la resolución.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    ticket,
    isLoading,
    error,
    resolucionText,
    setResolucionText,
    isSaving,
    mensajeExito,
    handleResolverTicket,
  };
}
