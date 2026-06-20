interface WeatherCacheData {
  condicion: string;
  expiresAt: number;
}

// Caché en memoria para zonas climáticas (10 minutos)
const CACHE_DURATION_MS = 10 * 60 * 1000;
const weatherCache = new Map<string, WeatherCacheData>();

/**
 * Obtiene la condición climática para una coordenada, aplicando resiliencia:
 * - Caché de 10 minutos (por zonas cercanas)
 * - Timeout estricto de 3 segundos
 * - Valor de respaldo ante fallos (Despejado)
 */
export const getCondicionClimatica = async (lat: number, lng: number): Promise<string> => {
  // Clave de caché aproximando a 2 decimales para agrupar peticiones de la misma zona (~1.1 km)
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  
  const cached = weatherCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.condicion;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout estricto de 3 segundos

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    const weatherCode = data.current_weather?.weathercode;
    
    const condicion = mapWeatherCode(weatherCode);

    // Guardar en caché
    weatherCache.set(cacheKey, {
      condicion,
      expiresAt: Date.now() + CACHE_DURATION_MS,
    });

    return condicion;

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error obteniendo clima (timeout o fallo), usando valor de respaldo:", error);
    // Según ADR, usamos valor de respaldo para no bloquear el flujo de cotización
    return "Despejado";
  }
};

/**
 * Mapea el código del estado del tiempo WMO a un estado manejable por el sistema.
 * @param code WMO weather code
 */
function mapWeatherCode(code?: number): string {
  if (code === undefined) return "Despejado";
  if (code === 0 || code === 1) return "Despejado";
  if (code === 2 || code === 3) return "Nublado";
  if (code >= 45 && code <= 48) return "Niebla";
  if (code >= 51 && code <= 67) return "Lluvia";
  if (code >= 71 && code <= 77) return "Nieve";
  if (code >= 80 && code <= 82) return "Lluvia";
  if (code >= 95) return "Tormenta";
  
  return "Despejado"; // Default fallback
}
