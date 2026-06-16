import { historialSoporteService } from "@/features/soporte/services/historialSoporteService";
import { TicketResuelto } from "@/features/soporte/types/historialSoporte";
import { useState, useEffect } from "react";

export function useHistorialSoporte() {
  const [tickets, setTickets] = useState<TicketResuelto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    historialSoporteService.obtenerTicketsResueltos().then((data) => {
      setTickets(data);
      setIsLoading(false);
    });
  }, []);

  return { tickets, isLoading };
}
