import { ObtenerCondicionClimatica, ObtenerMultiplicador } from "./condicion-climatica";
import { Direccion } from "./tipos";

/**
 * Computa la cotizacion dados parametros de ubicacion y paquete.
 * @param multiplicadorPaquete
 * @param origen
 * @param destino
 * @throws 503 si existe error de infraestructura externa. 400 si existe una ubicacion invalida.
 */
export async function calcularCotizacion(multiplicadorPaquete: number, origen: Direccion, destino: Direccion) {

    const token = process.env.MAPBOX_API;
    if (!token) throw new Error("503");

    const coords = `${origen.longitud},${origen.latitud};${destino.longitud},${destino.latitud}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coords}?access_token=${token}&overview=false&alternatives=false`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("503");

    const data = await res.json();
    if (!data || !Array.isArray(data.routes) || data.routes.length === 0) throw new Error("400");

    const multiplicaorCondicion = ObtenerMultiplicador(await ObtenerCondicionClimatica(origen));

    const distanciaMetros = data.routes[0].distance;
    const distanciaKm = distanciaMetros / 1000;

    const precioBase = distanciaKm * multiplicadorPaquete * multiplicaorCondicion;

    // TODO: zona caliente

    // capas que se agrega logica extra para el precio final.

    const precioFinal = precioBase;

    return Math.round(precioFinal * 100) / 100; // redondeo de 2 decimales.
}