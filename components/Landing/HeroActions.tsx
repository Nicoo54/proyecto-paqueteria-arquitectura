"use client";

import Link from "next/link";

export default function HeroActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Link
        href="/onboarding?role=remitente"
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center select-none"
      >
        📦 Enviar un paquete
      </Link>
      <Link
        href="/onboarding?role=transportista"
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold bg-white text-slate-900 border-2 border-slate-200 hover:bg-slate-50 shadow-sm hover:-translate-y-0.5 transition-all duration-200 text-center select-none"
      >
        🛵 Quiero ser chofer
      </Link>
    </div>
  );
}
