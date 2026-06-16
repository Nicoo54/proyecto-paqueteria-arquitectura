"use client";

import HeaderSoporteCliente from "@/components/cliente/soporte/HeaderSoporteCliente";
import TicketsTabla from "@/components/cliente/soporte/TicketsTabla";
import { useHistorialTickets } from "@/features/remitente/hooks/useHistorialTickets";

export default function HistorialTicketsPage() {
  const { tickets, isLoading } = useHistorialTickets();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <HeaderSoporteCliente />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <TicketsTabla tickets={tickets} />
      )}
    </div>
  );
}
