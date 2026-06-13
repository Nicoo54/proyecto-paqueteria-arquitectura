"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Package } from "lucide-react";
import { useRouter } from "next/navigation";

// TODO: Cambiar por consulta real
const historialMock = [
  {
    codigo_envio: "1004",
    fecha: "12 Jun, 2026",
    destino: "Av. Alem 1253",
    categoria: "M",
    costo: 1850.5,
    estado: "EN_CAMINO",
  },
  {
    codigo_envio: "1003",
    fecha: "10 Jun, 2026",
    destino: "Mitre 150",
    categoria: "S",
    costo: 1200.0,
    estado: "ENTREGADO",
  },
  {
    codigo_envio: "1002",
    fecha: "05 Jun, 2026",
    destino: "Av. Colon 432",
    categoria: "L",
    costo: 2900.0,
    estado: "ENTREGADO",
  },
  {
    codigo_envio: "1001",
    fecha: "01 Jun, 2026",
    destino: "Estomba 88",
    categoria: "M",
    costo: 1850.5,
    estado: "CANCELADO",
  },
];

// TODO: Cambiar por algo unificado
const getBadgeStyles = (estado: string) => {
  switch (estado) {
    case "ENTREGADO":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "EN_CAMINO":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "CANCELADO":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export default function EnviosTabla() {
  const router = useRouter();

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID Envió</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Destino de Entrega</th>
                <th className="px-6 py-4">Paquete</th>
                <th className="px-6 py-4">Costo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {historialMock.map((envio) => (
                <tr
                  key={envio.codigo_envio}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    #{envio.codigo_envio}
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {envio.fecha}
                  </td>
                  <td className="px-6 py-4 font-medium max-w-50 truncate">
                    {envio.destino}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                      <Package className="w-3.5 h-3.5 text-slate-400" /> Talle{" "}
                      {envio.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ${envio.costo.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyles(envio.estado)}`}
                    >
                      {envio.estado.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-3 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-900 hover:text-white transition-all"
                      onClick={() =>
                        router.push(`/cliente/historial/${envio.codigo_envio}`)
                      }
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {historialMock.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-medium">
            Aún no registraste ninguna operación en la plataforma.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
