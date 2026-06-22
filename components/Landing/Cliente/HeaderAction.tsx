"use client";

import { usePathname } from "next/navigation";
import { Clock, HelpCircle, MapPin, Package } from "lucide-react";
import Link from "next/link";

const routes = [
  { href: "/cliente", icon: Package, text: "Inicio" },
  { href: "/cliente/historial", icon: Clock, text: "Historial" },
  { href: "/cliente/soporte", icon: HelpCircle, text: "Soporte" },
  { href: "/cliente/direcciones", icon: MapPin, text: "Direcciones" },
];

export default function ClienteHeader() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {routes.map((route) => (
        <IconLink
          key={route.href}
          href={route.href}
          icon={route.icon}
          text={route.text}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
}

function IconLink({
  href,
  icon: Icon,
  text,
  isActive = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  isActive?: boolean;
}) {
  const baseClasses = `flex items-center gap-2 text-sm font-medium transition-colors ${
    isActive
      ? "text-amber-500 font-semibold cursor-default"
      : "text-slate-600 hover:text-slate-900"
  }`;

  if (isActive) {
    return (
      <span className={baseClasses}>
        <Icon className="w-4 h-4" /> {text}
      </span>
    );
  }

  return (
    <Link href={href} className={baseClasses}>
      <Icon className="w-4 h-4" /> {text}
    </Link>
  );
}
