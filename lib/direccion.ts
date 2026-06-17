import { Direccion } from "./tipos";

/**
 * Obtiene coordenadas (longitud, latitud) de una direccion.
 * @param direccion
 * @returns La direccion junto a sus coordenadas o null si la direccion no existe.
 */
export async function ObtenerCoordenadas(direccion: string): Promise<Direccion | null> {

    const token = process.env.MAPBOX_API;
    if (!token) throw new Error("503");

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        direccion
    )}.json?access_token=${token}&limit=1&autocomplete=false`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("503");

    const data = await res.json();

    if (!data || !Array.isArray(data.features)) throw new Error("503");

    if (data.features.length === 0) return null;

    if (data.features[0].matching_place_name === undefined) {
        return null;
    }

    const [lon, lat] = data.features[0].center;
    return { latitud: lat, longitud: lon, direccion: data.features[0].matching_place_name };
}