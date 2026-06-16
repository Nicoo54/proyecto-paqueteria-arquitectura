"use client";

import ControlesHeader from "@/components/cliente/historial/ControlesHeader";
import EnviosTabla from "@/components/cliente/historial/EnviosTabla";
import { useHistorial } from "@/features/remitente/hooks/useHistorial";

export default function HistorialPage() {
  const { envios, isLoading } = useHistorial();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <ControlesHeader />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <EnviosTabla envios={envios} />
      )}
    </div>
  );
}
