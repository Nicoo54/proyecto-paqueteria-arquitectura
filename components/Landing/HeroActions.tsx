"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function HeroActions() {
  const clerk = useClerk();
  const isSignedIn = useUser();

  const handleAuthAndRedirect = (role: "remitente" | "transportista") => {
    if (!isSignedIn) {
      // TODO: revisar rol y redirigir a panel correspondiente
      if (role === "remitente") {
        redirect("/cliente");
      } else {
        redirect("/transportistas");
      }
    }

    clerk.openSignUp({
      fallbackRedirectUrl: `/onboarding?role=${role}`,
      forceRedirectUrl: `/onboarding?role=${role}`,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <button
        onClick={() => handleAuthAndRedirect("remitente")}
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center select-none cursor-pointer border-none outline-none"
      >
        📦 Enviar un paquete
      </button>

      <button
        onClick={() => handleAuthAndRedirect("transportista")}
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold bg-white text-slate-900 border-2 border-slate-200 hover:bg-slate-50 shadow-sm hover:-translate-y-0.5 transition-all duration-200 text-center select-none cursor-pointer outline-none"
      >
        🛵 Quiero ser chofer
      </button>
    </div>
  );
}
