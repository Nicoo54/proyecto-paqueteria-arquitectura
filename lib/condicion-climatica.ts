import { Direccion } from "./tipos";

export async function ObtenerCondicionClimatica(direccion: Direccion) {
    const { latitud, longitud } = direccion;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=weather_code,temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // timeout de 2 segundos

    try {
        const res = await fetch(url);
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("503");

        const data = await res.json();
        if (!data || !data.current) throw new Error("503");

        const { weather_code } = data.current;

        const condicion = interpretarCodigoClima(weather_code);

        return condicion;

    } catch (error) {
        clearTimeout(timeoutId);
        return "SIN_INFORMACION";
    }
}

/**
 * Interpreta códigos WMO (World Meteorological Organization) a condiciones legibles.
 * Referencia: https://www.open-meteo.com/en/docs
 */
function interpretarCodigoClima(codigoWmo: number): string {
    if (codigoWmo === 0 || codigoWmo === 1) return "DESPEJADO";
    if (codigoWmo === 2 || codigoWmo === 3) return "NUBLADO";
    if (codigoWmo === 51 || codigoWmo === 53 || codigoWmo === 55) return "LLUVIA";
    if (codigoWmo === 61 || codigoWmo === 63 || codigoWmo === 65) return "LLUVIA";
    if (codigoWmo === 71 || codigoWmo === 73 || codigoWmo === 75 || codigoWmo === 77) return "NIEVE";
    if (codigoWmo === 80 || codigoWmo === 81 || codigoWmo === 82) return "LLUVIA";
    if (codigoWmo === 85 || codigoWmo === 86) return "NIEVE";
    if (codigoWmo === 95 || codigoWmo === 96 || codigoWmo === 99) return "TORMENTA";

    return "DESPEJADO";
}

export function ObtenerMultiplicador(condicion: string) {

    if (condicion === "LLUVIA") return 1.5;
    if (condicion === "NIEVE") return 2.3;
    if (condicion === "TORMENTA") return 2.0;

    return 1.0;
}