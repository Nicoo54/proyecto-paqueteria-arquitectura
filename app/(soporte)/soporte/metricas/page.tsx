"use client";

import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Package,
  Flame,
  ShieldAlert,
  Layers,
  DollarSign,
} from "lucide-react";
import { useDashboardMetricas } from "@/lib/hooks/soporte/useDashboardMetricas";
import { ZonaCalienteDB } from "@/lib/types/metricas";

export default function MetricasAnalyticsPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const { metricas, zonas, geoJsonZonas, isLoading } = useDashboardMetricas();

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Consola Analítica Global{" "}
          <BarChart3 className="w-6 h-6 text-indigo-500" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Métricas financieras y geografico operativas del proceso batch
          nocturno consolidado.
        </p>
      </div>

      {!metricas ? (
        <MetricasVacias />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricaCard
            titulo="Envíos Completados"
            valor={metricas.cantidad_envios_totales}
            icono={<Package className="w-3.5 h-3.5" />}
            fecha={metricas.fecha_reporte}
          />

          <MetricaCard
            titulo="Ganancia Neta"
            valor={metricas.ganancia_neta_plataforma.toLocaleString("es-AR")}
            icono={<DollarSign className="w-3.5 h-3.5" />}
          />
        </div>
      )}

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-400" /> Monitoreo Geográfico
              de Demanda
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Visualización del radio de acción de los recargos dinámicos en
              vigencia.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
            <Flame className="w-3 h-3 fill-rose-500" /> Zona calientes
          </span>
        </div>

        <MapaZonaCaliente
          mapboxToken={mapboxToken}
          geoJsonZonas={geoJsonZonas}
          zonas={zonas}
        />
      </Card>
    </div>
  );
}

function MetricasVacias() {
  return (
    <Card className="border-amber-200 bg-amber-50/50 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
      <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-bold text-amber-900 text-sm mb-1">
          Métricas de procesamiento no disponibles
        </h3>
        <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
          El proceso batch nocturno consolidado aún no ha ejecutado ninguna
          rutina informática (Comportamiento esperado durante el primer día de
          operación o ventanas de mantenimiento del Pipeline). Los datos
          financieros se computarán en el próximo ciclo automático.
        </p>
      </div>
    </Card>
  );
}

function MetricaCard({
  titulo,
  valor,
  icono,
  fecha,
}: {
  titulo: string;
  valor: string | number;
  icono: React.ReactNode;
  fecha?: string;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            {icono} {titulo}
          </p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {valor}
          </h2>
          <p className="text-[10px] text-slate-400 font-medium mt-1">{fecha}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
          {icono}
        </div>
      </CardContent>
    </Card>
  );
}

function MapaZonaCaliente({
  mapboxToken,
  geoJsonZonas,
  zonas,
}: {
  mapboxToken: string;
  geoJsonZonas?: any;
  zonas: ZonaCalienteDB[];
}) {
  const layerRellenoStyle: any = {
    id: "zona-caliente-fill",
    type: "fill",
    paint: {
      "grid-color": "transparent",
      "fill-color": "#ef4444",
      "fill-opacity": 0.25,
    },
  };

  const layerBordeStyle: any = {
    id: "zona-caliente-borde",
    type: "line",
    paint: {
      "line-color": "#dc2626",
      "line-width": 2,
      "line-dasharray": [2, 2],
    },
  };

  return (
    <CardContent className="p-0 relative h-87.5 w-full bg-slate-100">
      {mapboxToken ? (
        <div className="absolute inset-0">
          <Map
            mapboxAccessToken={mapboxToken}
            initialViewState={{
              longitude: -62.2663,
              latitude: -38.7183,
              zoom: 12.5,
            }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            style={{ width: "100%", height: "100%" }}
          >
            {geoJsonZonas && (
              <Source
                id="zonas-calientes-source"
                type="geojson"
                data={geoJsonZonas}
              >
                <Layer {...layerRellenoStyle} />
                <Layer {...layerBordeStyle} />
              </Source>
            )}

            {zonas.map((z) => (
              <Marker
                key={z.codigo_zona_caliente}
                longitude={z.centro_lng}
                latitude={z.centro_lat}
                anchor="center"
              >
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-xl border border-slate-800 tracking-wider uppercase mb-1">
                    Tarifa x{z.multiplicador_precio.toFixed(2)}
                  </div>
                  <div className="w-3 h-3 bg-red-600 rounded-full shadow-lg border-2 border-white animate-pulse" />
                </div>
              </Marker>
            ))}
          </Map>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-slate-400 font-medium">
          Falta cargar NEXT_PUBLIC_MAPBOX_TOKEN en .env.local
        </div>
      )}
    </CardContent>
  );
}
