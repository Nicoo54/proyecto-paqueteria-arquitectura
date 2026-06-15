import { historialHelperService } from "@/lib/service/soporte/historialHelperService";
import { TicketResuelto } from "@/lib/types/historialHelper";
import { useState, useEffect } from "react";

export function useHistorialHelper() {
  const [tickets, setTickets] = useState<TicketResuelto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    historialHelperService.obtenerTicketsResueltos().then((data) => {
      setTickets(data);
      setIsLoading(false);
    });
  }, []);

  return { tickets, isLoading };
}
