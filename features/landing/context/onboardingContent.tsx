import type { CategoriaVehiculo } from "@/lib/api-contract";

export const CONFIG_VEHICULOS: {
  id: CategoriaVehiculo;
  label: string;
  icon: string;
  tienePatente: boolean;
}[] = [
  { id: "BICI", label: "Bici", icon: "🚲", tienePatente: false },
  { id: "MOTO", label: "Moto", icon: "🏍️", tienePatente: true },
  { id: "AUTO", label: "Auto", icon: "🚗", tienePatente: true },
];
