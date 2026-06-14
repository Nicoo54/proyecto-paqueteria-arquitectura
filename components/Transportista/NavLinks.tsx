import { Car, Clock, Map } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Inicio", href: "/transportista", icon: Map },
  { name: "Historial", href: "/transportista/historial", icon: Clock },
  { name: "Mi Vehículo", href: "/transportista/perfil", icon: Car },
];

export function NavLinks({
  variant,
  onLinkClick,
}: {
  variant: "desktop" | "mobile";
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onLinkClick}
            className={
              variant === "desktop"
                ? `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isActive ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`
                : `flex items-center gap-3 px-4 py-4 rounded-xl text-base font-bold transition-all ${isActive ? "bg-slate-800 text-white" : "text-slate-400"}`
            }
          >
            <Icon className={variant === "desktop" ? "w-4 h-4" : "w-5 h-5"} />{" "}
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
