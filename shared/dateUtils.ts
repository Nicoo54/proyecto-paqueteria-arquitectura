export const formatearFecha = (fechaString: string) => {
  return new Date(fechaString).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export function formatearFechaRelativa(isoString: string): string {
  if (!isoString) return "Fecha desconocida";

  const [year, month, day] = isoString.split("T")[0].split("-");
  const fecha = new Date(Number(year), Number(month) - 1, Number(day));

  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);

  fecha.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);
  ayer.setHours(0, 0, 0, 0);

  if (fecha.getTime() === hoy.getTime()) return "Hoy";
  if (fecha.getTime() === ayer.getTime()) return "Ayer";

  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
