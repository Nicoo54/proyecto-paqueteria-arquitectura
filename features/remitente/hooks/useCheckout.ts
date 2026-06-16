import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DraftEnvio } from "../types/checkout";
import { checkoutService } from "../services/checkoutService";

export function useCheckout() {
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
      const linkPago = await checkoutService.generarLinkMercadoPago(draft);

      // SIMULACIÓN DE FLUJO
      console.log("Redirigiendo a MercadoPago:", linkPago);
      setTimeout(() => {
        sessionStorage.removeItem("draft_envio"); // Limpiar caché tras pago
        alert("Pago aprobado en MercadoPago ✅ (Simulación)");
        router.push("/cliente");
      }, 1500);

      // TODO EN PRODUCCIÓN:
      // window.location.href = linkPago;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setIsProcessing(false);
    }
  };

  return {
    draft,
    isProcessing,
    handlePagar,
    router,
  };
}
