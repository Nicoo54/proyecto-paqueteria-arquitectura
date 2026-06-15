"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { LifeBuoy, Inbox, BarChart3, History } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function HeaderSoporte() {
  const pathname = usePathname();

  const links = [
    { name: "Inicio", href: "/soporte", icon: Inbox },
    { name: "Historial", href: "/soporte/historial", icon: History },
    { name: "Métricas", href: "/soporte/metricas", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 border-b border-slate-800 shadow-sm text-white">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href="/soporte"
          className="text-lg font-black tracking-tight flex items-center gap-2 shrink-0"
        >
          <LifeBuoy className="w-5 h-5 text-indigo-400 animate-spin-slow" />
          Packeteer<span className="text-indigo-400">Helper</span>
        </Link>

        <div className="flex-1 flex items-center justify-end gap-6">
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
            <ClerkLoading>
              <Skeleton className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-700 animate-pulse shrink-0" />
            </ClerkLoading>

            <ClerkLoaded>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 border-2 border-slate-700",
                  },
                }}
              />
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </header>
  );
}
