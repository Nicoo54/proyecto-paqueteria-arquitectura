import { historialHelperService } from "@/lib/service/soporte/historialHelperService";
import { TicketResueltoDetalle } from "@/lib/types/historialHelper";
import { useState, useEffect } from "react";

export function useHistorialDetalle(id: string) {
  const [ticket, setTicket] = useState<TicketResueltoDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    historialHelperService.obtenerDetalleResuelto(id).then((data) => {
      setTicket(data);
      setIsLoading(false);
    });
  }, [id]);

  return { ticket, isLoading };
}
