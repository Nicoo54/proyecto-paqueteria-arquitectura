import { Button } from "@base-ui/react";
import { Card, CardContent } from "../ui/card";
import { CreditCard, ShieldCheck } from "lucide-react";

export default function PanelPago({
  precio,
  isProcessing,
  onPagar,
}: {
  precio: number;
  isProcessing: boolean;
  onPagar: () => Promise<void>;
}) {
  return (
    <div>
      <Card className="border-slate-900 bg-slate-900 shadow-xl rounded-3xl sticky top-24">
        <CardContent className="p-8">
          <h3 className="font-bold text-white mb-8 text-lg">Resumen de pago</h3>

          <div className="space-y-4 text-sm text-slate-300 border-b border-slate-700 pb-6 mb-6">
            <div className="flex justify-between">
              <span>Costo del envío</span>
              <span>${(precio * 0.8).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarifa de servicio</span>
              <span>${(precio * 0.2).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-white">Total a pagar</span>
            <div className="text-right">
              <span className="text-3xl font-black text-amber-400">
                ${precio.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={onPagar}
            disabled={isProcessing}
            className="flex items-center justify-center w-full h-14 text-lg font-bold bg-[#009EE3] text-white hover:bg-[#008ACB] rounded-xl shadow-md transition-all relative overflow-hidden"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Conectando con MP...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pagar con MercadoPago
              </div>
            )}
          </Button>

          <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pago 100%
            seguro
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
