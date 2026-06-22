const categoriasValidas = ["S", "M", "L"];
const tiposPagoValidos = ["DIGITAL", "EFECTIVO"];

export interface Direccion {
    direccion: string,
    latitud: number,
    longitud: number
};


export function CategoriaValida(categoria: string) {
    if (typeof categoria !== "string") {
        return false;
    }

    return categoriasValidas.includes(categoria);
}

export function TipoPagoValido(tipoPago: string) {
    if (typeof tipoPago !== "string") {
        return false;
    }
    return tiposPagoValidos.includes(tipoPago);
}