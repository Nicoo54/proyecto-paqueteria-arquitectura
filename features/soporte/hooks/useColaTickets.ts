import { soporteService } from "@/features/soporte/services/soporteService";
import { TicketPendiente } from "@/features/soporte/types/soporte";
import { useApiClient } from "@/shared/api-client";
import { useState, useEffect } from "react";

export function useColaTickets() {
  const { apiFetch } = useApiClient();
  const [tickets, setTickets] = useState<TicketPendiente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionProcessing, setIsActionProcessing] = useState<string | null>(
    null,
  );

  const cargarCola = () => {
    soporteService.obtenerColaPendientes(apiFetch).then((data) => {
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
      await soporteService.tomarTicket(id, apiFetch);
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
