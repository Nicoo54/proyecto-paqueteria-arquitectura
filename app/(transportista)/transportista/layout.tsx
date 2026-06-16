"use client";

import { HeaderTransportista } from "@/components/Transportista/TransportistaHeader";
import { EstadoTransportistaProvider } from "@/features/transportista/context/EstadoTransportistaProvider";

export default function TransportistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EstadoTransportistaProvider>
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <HeaderTransportista />
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
      </div>
    </EstadoTransportistaProvider>
  );
}
