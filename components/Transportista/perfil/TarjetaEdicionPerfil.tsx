import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface Props {
  titulo: string;
  onCancelar: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export function TarjetaEdicionPerfil({
  titulo,
  onCancelar,
  onSubmit,
  children,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <Card className="border-amber-200 shadow-md rounded-3xl overflow-hidden bg-white">
        <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-100 flex justify-between items-center">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            {titulo}
          </span>
          <button
            type="button"
            onClick={onCancelar}
            className="text-amber-700 hover:text-amber-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <CardContent className="p-6 space-y-6">{children}</CardContent>
      </Card>
    </form>
  );
}
