import { historialSoporteService } from "@/features/soporte/services/historialSoporteService";
import { TicketResuelto } from "@/features/soporte/types/historialSoporte";
import { useApiClient } from "@/shared/api-client";
import { useState, useEffect } from "react";

export function useHistorialSoporte() {
  const { apiFetch } = useApiClient();
  const [tickets, setTickets] = useState<TicketResuelto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    historialSoporteService.obtenerTicketsResueltos(apiFetch).then((data) => {
      setTickets(data);
      setIsLoading(false);
    });
  }, []);

  return { tickets, isLoading };
}
