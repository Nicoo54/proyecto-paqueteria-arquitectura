"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { ToggleConexion } from "./ToggleConexion";
import { NavLinks } from "./NavLinks";
import { Skeleton } from "../ui/skeleton";

export function HeaderTransportista() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-900 shadow-md">
        <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              className="sm:hidden text-white p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <Link
              href="/transportista"
              className="text-xl font-black tracking-tight text-white"
            >
              Packeteer<span className="text-amber-400">Driver</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <ToggleConexion />

            <nav className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
              <NavLinks variant="desktop" />
            </nav>

            {/* Perfil de Clerk */}
            <div className="relative w-9 h-9 flex items-center justify-center">
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

      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-16 z-40 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-2">
            <NavLinks
              variant="mobile"
              onLinkClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>
        </div>
      )}
    </>
  );
}
