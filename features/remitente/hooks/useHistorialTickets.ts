import { useState, useEffect } from "react";
import { TicketHistorial } from "../types/soporte";
import { soporteService } from "../services/soporteService";

export function useHistorialTickets() {
  const [tickets, setTickets] = useState<TicketHistorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    soporteService
      .obtenerHistorialTickets()
      .then((data) => {
        if (!isMounted) return;
        setTickets(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando el historial de tickets:", error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { tickets, isLoading };
}
