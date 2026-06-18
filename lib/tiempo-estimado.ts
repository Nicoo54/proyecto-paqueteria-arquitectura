import { Direccion } from '@/lib/tipos';

export async function TiempoEstimado(origen: Direccion, destino: Direccion /* se tiene que saber que tipo de vehiculo */) {
    const token = process.env.MAPBOX_API;
    if (!token) throw new Error("503");

    const coords = `${origen.longitud},${origen.latitud};${destino.longitud},${destino.latitud}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coords}?access_token=${token}&overview=false&alternatives=false`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("503");

    const data = await res.json();
    if (!data || !Array.isArray(data.routes) || data.routes.length === 0) throw new Error("400");

    const durationSec = data.routes[0].duration;
    return Math.ceil(durationSec / 60);
}