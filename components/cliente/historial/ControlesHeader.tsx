"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ControlesHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <button
          onClick={() => router.push("/cliente")}
          className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Mis Envíos
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Listado histórico de todas tus solicitudes en Packeteer.
        </p>
      </div>
    </div>
  );
}
