"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ResumenRuta from "@/components/cliente/ResumenRuta";
import PanelPago from "@/components/cliente/PanelPago";
import { Ubicacion } from "@/shared/types/ubicacion";

interface DraftEnvio {
  origen: Ubicacion;
  destino: Ubicacion;
  tamanoSeleccionado: string;
  cotizacion: { precio: number; eta: string; distancia: string };
}

// TODO: Cambiar por llamada real a nuestro backend que hable con MercadoPago
const generarLinkMercadoPago = async (draft: DraftEnvio) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("https://mercadopago.com.ar/sandbox_link_falso");
    }, 2000);
  });
};

export default function CheckoutPage() {
  const router = useRouter();

  const [draft, setDraft] = useState<DraftEnvio | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedDraft = sessionStorage.getItem("draft_envio");
    if (savedDraft) {
      setDraft(JSON.parse(savedDraft));
    } else {
      router.push("/cliente/cotizar");
    }
  }, [router]);

  const handlePagar = async () => {
    if (!draft) return;
    setIsProcessing(true);

    try {
      const linkPago = await generarLinkMercadoPago(draft);

      // TODO: EN PRODUCCIÓN, REDIRIGIR DIRECTAMENTE A MERCADOPAGO
      console.log("Redirigiendo a MercadoPago:", linkPago);

      setTimeout(() => {
        sessionStorage.removeItem("draft_envio");
        alert("Pago aprobado en MercadoPago ✅ (Simulación)");
        router.push("/cliente");
      }, 1500);

      // window.location.href = linkPago;
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  if (
    !draft ||
    !draft.origen ||
    !draft.destino ||
    !draft.tamanoSeleccionado ||
    !draft.cotizacion
  )
    return null;
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
