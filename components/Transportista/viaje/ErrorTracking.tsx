import { ArrowLeft, PackageX } from "lucide-react";
import Link from "next/link";

export default function ErrorTracking() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <PackageX className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-xl font-black text-slate-800 mb-2">
        Envío no disponible
      </h2>
      <p className="text-slate-500 text-sm font-medium mb-6 max-w-xs">
        Este envío no existe, ya fue completado, o no tenés permisos para verlo.
      </p>
      <Link
        href="/transportista"
        className="h-12 px-6 font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
      </Link>
    </div>
  );
}
