import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, LucideIcon } from "lucide-react";

interface Props {
  icono: LucideIcon;
  titulo: string;
  onEditar: () => void;
  children: React.ReactNode;
}

export function TarjetaInfoPerfil({
  icono: Icono,
  titulo,
  onEditar,
  children,
}: Props) {
  return (
    <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden animate-in fade-in duration-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Icono className="w-4 h-4" /> {titulo}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditar}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
