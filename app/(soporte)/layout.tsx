"use client";

import HeaderSoporte from "@/components/soporte/HeaderSoporte";

export default function SoporteRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <HeaderSoporte />
      <main className="flex-1 flex flex-col min-h-0 w-full bg-slate-50">
        {children}
      </main>
    </div>
  );
}
