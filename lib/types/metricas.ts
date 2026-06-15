export interface ConsolidadorMetricas {
  fecha_reporte: string;
  cantidad_envios_totales: number;
  ganancia_neta_plataforma: number;
}

export interface ZonaCalienteDB {
  codigo_zona_caliente: string;
  centro_lat: number;
  centro_lng: number;
  radio_m: number;
  multiplicador_precio: number;
}
