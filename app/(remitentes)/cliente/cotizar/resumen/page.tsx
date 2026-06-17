"use client";

import PanelPago from "@/components/cliente/PanelPago";
import ResumenRuta from "@/components/cliente/ResumenRuta";
import { useCheckout } from "@/features/remitente/hooks/useCheckout";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { draft, isProcessing, handlePagar, router } = useCheckout();

  if (
    !draft ||
    !draft.origen ||
    !draft.destino ||
    !draft.tamanoSeleccionado ||
    !draft.cotizacion
  ) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al cotizador
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Resumen de tu envío
        </h1>
        <p className="text-slate-500 mt-1">
          Revisá los datos antes de proceder al pago seguro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResumenRuta
          origen={draft.origen.nombre}
          destino={draft.destino.nombre}
          tamano={draft.tamanoSeleccionado}
          eta={draft.cotizacion.eta}
        />

        <PanelPago
          precio={draft.cotizacion.precio}
          isProcessing={isProcessing}
          onPagar={handlePagar}
        />
      </div>
    </div>
  );
}
