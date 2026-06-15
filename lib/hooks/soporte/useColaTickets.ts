import { soporteService } from "@/lib/service/soporte/soporteService";
import { TicketPendiente } from "@/lib/types/soporte";
import { useState, useEffect } from "react";

export function useColaTickets() {
  const [tickets, setTickets] = useState<TicketPendiente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionProcessing, setIsActionProcessing] = useState<string | null>(
    null,
  );

  const cargarCola = () => {
    soporteService.obtenerColaPendientes().then((data) => {
      setTickets(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    cargarCola();
  }, []);

  const asignarTicketAHelper = async (id: string, onSuccess: () => void) => {
    setIsActionProcessing(id);
    try {
      const mockDniHelper = "38123456"; // Sacado de Clerk en producción
      await soporteService.tomarTicket(id, mockDniHelper);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsActionProcessing(null);
    }
  };

  return {
    tickets,
    isLoading,
    isActionProcessing,
    asignarTicketAHelper,
    refrescarCola: cargarCola,
  };
}
