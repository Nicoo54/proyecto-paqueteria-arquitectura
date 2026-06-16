export const CATEGORIAS_VEHICULOS = [
  { id: "BICI", label: "Bici", icon: "🚲", tienePatente: false },
  { id: "MOTO", label: "Moto", icon: "🏍️", tienePatente: true },
  { id: "AUTO", label: "Auto", icon: "🚗", tienePatente: true },
] as const;

export type CategoriaVehiculo = (typeof CATEGORIAS_VEHICULOS)[number];
