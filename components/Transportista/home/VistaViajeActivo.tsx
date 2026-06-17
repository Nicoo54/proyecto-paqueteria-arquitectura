import { useRouter } from "next/navigation";
import { Navigation, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VistaViajeActivo({ viajeId }: { viajeId: string }) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-8 bg-slate-100 items-center justify-center">
      <Card className="w-full max-w-md border-amber-200 shadow-xl overflow-hidden rounded-3xl animate-in zoom-in-95">
        <div className="bg-amber-400 p-6 text-center">
          <Navigation className="w-12 h-12 text-slate-900 mx-auto mb-3 animate-bounce" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            ¡Tenés un viaje en curso!
          </h2>
          <p className="text-amber-900 font-medium mt-1">
            No podés aceptar nuevos pedidos.
          </p>
        </div>
        <CardContent className="p-6 text-center">
          <Button
            onClick={() => router.push(`/transportista/viaje/${viajeId}`)}
            className="w-full h-14 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
          >
            Volver al mapa <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
