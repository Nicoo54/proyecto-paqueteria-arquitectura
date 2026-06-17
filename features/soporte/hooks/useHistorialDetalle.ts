import { historialSoporteService } from "@/features/soporte/services/historialSoporteService";
import { TicketResueltoDetalle } from "@/features/soporte/types/historialSoporte";
import { useState, useEffect } from "react";

export function useHistorialDetalle(id: string) {
  const [ticket, setTicket] = useState<TicketResueltoDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    historialSoporteService.obtenerDetalleResuelto(id).then((data) => {
      setTicket(data);
      setIsLoading(false);
    });
  }, [id]);

  return { ticket, isLoading };
}
