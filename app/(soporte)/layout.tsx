"use client";

import HeaderSoporte from "@/components/soporte/HeaderSoporte";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SoporteRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // TODO: Cambiar validacion segun se haga
    const userRole = user?.publicMetadata?.role;

    if (!user || userRole !== "SOPORTE") {
      console.warn("Acceso denegado. Rol insuficiente.");
      // router.push("/");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <HeaderSoporte />
      <main className="flex-1 flex flex-col min-h-0 w-full bg-slate-50">
        {children}
      </main>
    </div>
  );
}
