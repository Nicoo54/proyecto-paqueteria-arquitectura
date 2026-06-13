import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import router from "next/router";

export default function HeaderTracking({
  esEnCamino,
}: {
  esEnCamino: boolean;
}) {
  return (
    <div className="absolute inset-x-0 top-0 p-4 pointer-events-none z-10 flex justify-between items-start">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => router.push("/cliente")}
        className="rounded-full shadow-md pointer-events-auto bg-white/90 backdrop-blur-sm hover:bg-white"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md pointer-events-auto flex items-center gap-2 border border-slate-200">
        <div className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${esEnCamino ? "animate-ping bg-emerald-400" : "bg-slate-400"}`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${esEnCamino ? "bg-emerald-500" : "bg-slate-500"}`}
          ></span>
        </div>
        <span className="text-xs font-bold text-slate-700">
          {esEnCamino ? "Seguimiento en vivo" : "Publicando pedido..."}
        </span>
      </div>
    </div>
  );
}
