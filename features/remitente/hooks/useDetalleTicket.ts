import { useState, useEffect } from "react";
import { TicketDetalle } from "../types/ticketDetalle";
import { ticketDetalleService } from "../services/ticketDetalleService";

export function useDetalleTicket(id: string) {
  const [ticket, setTicket] = useState<TicketDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setIsLoading(true);

    ticketDetalleService
      .obtenerDetalleTicket(id)
      .then((data) => {
        if (!isMounted) return;
        setTicket(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar detalle del ticket:", err);
        if (!isMounted) return;
        setError("No se pudo cargar la información del ticket.");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { ticket, isLoading, error };
}
