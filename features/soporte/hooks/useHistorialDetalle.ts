import { historialSoporteService } from "@/features/soporte/services/historialSoporteService";
import { TicketResueltoDetalle } from "@/features/soporte/types/historialSoporte";
import { useApiClient } from "@/shared/api-client";
import { useState, useEffect } from "react";

export function useHistorialDetalle(id: string) {
  const { apiFetch } = useApiClient();
  const [ticket, setTicket] = useState<TicketResueltoDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    historialSoporteService
      .obtenerDetalleResuelto(id, apiFetch)
      .then((data) => {
        setTicket(data);
        setIsLoading(false);
      });
  }, [id]);

  return { ticket, isLoading };
}
