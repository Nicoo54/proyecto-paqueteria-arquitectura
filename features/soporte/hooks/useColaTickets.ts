import { soporteService } from "@/features/soporte/services/soporteService";
import { TicketPendiente } from "@/features/soporte/types/soporte";
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

  const asignarTicketASoporte = async (id: string, onSuccess: () => void) => {
    setIsActionProcessing(id);
    try {
      const mockDniSoporte = "38123456"; // Sacado de Clerk en producción
      await soporteService.tomarTicket(id, mockDniSoporte);
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
    asignarTicketASoporte,
    refrescarCola: cargarCola,
  };
}
