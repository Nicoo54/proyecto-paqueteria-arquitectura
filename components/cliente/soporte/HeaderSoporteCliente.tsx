import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquarePlus, LifeBuoy } from "lucide-react";

export default function HeaderSoporteCliente() {
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Soporte <LifeBuoy className="w-8 h-8 text-amber-500" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Historial de tus consultas y reclamos técnicos.
        </p>
      </div>

      <Button className="rounded-xl font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-sm h-11 px-6">
        <MessageSquarePlus className="w-4 h-4 mr-2" /> Nuevo Ticket
      </Button>
    </div>
  );
}
