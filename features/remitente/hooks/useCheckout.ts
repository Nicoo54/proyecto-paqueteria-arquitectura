import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DraftEnvio } from "../types/checkout";
import { checkoutService } from "../services/checkoutService";
import { useApiClient } from "@/shared/api-client";

export function useCheckout() {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftEnvio | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { apiFetch } = useApiClient();
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
      const linkPago = await checkoutService.generarLinkMercadoPago(
        draft,
        apiFetch,
      );

      sessionStorage.removeItem("draft_envio");

      window.location.href = linkPago;
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
