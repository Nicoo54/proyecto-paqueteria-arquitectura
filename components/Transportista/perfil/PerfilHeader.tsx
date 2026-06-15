import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  nombre: string;
  imageUrl?: string | null;
  promedioCalificacion?: number;
  cantidadResenas?: number;
}

export function PerfilHeader({
  nombre,
  imageUrl,
  promedioCalificacion,
  cantidadResenas,
}: Props) {
  return (
    <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-6 flex items-center gap-4">
        {imageUrl && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 shadow-inner">
            <Image
              src={imageUrl}
              alt="Avatar"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-slate-900 truncate tracking-tight">
            {nombre}
          </h1>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
              {promedioCalificacion?.toFixed(2)}
            </span>
            <span>•</span>
            <span>{cantidadResenas} reseñas de clientes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
