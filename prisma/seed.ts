// Seed para la demo del Entregable Final.
// Ejecutar con: npx prisma db seed
//
// Pre-requisitos:
//  · Variables de entorno DATABASE_URL configuradas.
//  · Schema aplicado: npx prisma migrate dev (o npx prisma db push).
//
// Los clerkId corresponden a los 3 usuarios de prueba que crea
// Sistemas Externos en Clerk:
//   usuario+clerk_test@a.com           → role: remitente
//   transportista+clerk_test@a.com     → role: transportista
//   admin+clerk_test@a.com             → role: admin
// Si los clerkId reales no coinciden con los placeholders de abajo,
// reemplazarlos antes de correr el seed.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLERK_IDS = {
  REMITENTE: process.env.SEED_CLERK_REMITENTE_ID ?? "user_seed_remitente",
  TRANSPORTISTA: process.env.SEED_CLERK_TRANSPORTISTA_ID ?? "user_seed_transportista",
  ADMIN: process.env.SEED_CLERK_ADMIN_ID ?? "user_seed_admin",
} as const;

const DNI = {
  REMITENTE: "35123456",
  TRANSPORTISTA_1: "28987654",
  TRANSPORTISTA_2: "30111222",
  ADMIN: "40555666",
} as const;

const BAHIA = {
  origenAlem: { direccion: "Av. Alem 1253, Bahía Blanca", lat: -38.718334, lng: -62.266321 },
  destinoSarmiento: { direccion: "Sarmiento 456, Bahía Blanca", lat: -38.712451, lng: -62.254124 },
  origenMitre: { direccion: "Mitre 150, Bahía Blanca", lat: -38.720101, lng: -62.272555 },
  destinoColon: { direccion: "Av. Colón 432, Bahía Blanca", lat: -38.714112, lng: -62.250901 },
};

async function main() {
  console.log("→ Seed Packeteer arrancando…");

  console.log("• Categorías de vehículo");
  await prisma.categoriaVehiculo.createMany({
    data: [
      { nombre: "BICI", capacidadMaxima: 5 },
      { nombre: "MOTO", capacidadMaxima: 20 },
      { nombre: "AUTO", capacidadMaxima: 100 },
    ],
    skipDuplicates: true,
  });

  console.log("• Categorías de paquete");
  await prisma.categoriaPaquete.createMany({
    data: [
      { categoria: "S", pesoMaximo: 5, multiplicadorCosto: 1.0 },
      { categoria: "M", pesoMaximo: 20, multiplicadorCosto: 1.5 },
      { categoria: "L", pesoMaximo: 100, multiplicadorCosto: 2.5 },
    ],
    skipDuplicates: true,
  });

  console.log("• Usuarios + roles del dominio");
  await prisma.usuario.upsert({
    where: { dni: DNI.REMITENTE },
    update: { clerkId: CLERK_IDS.REMITENTE },
    create: {
      dni: DNI.REMITENTE,
      clerkId: CLERK_IDS.REMITENTE,
      remitente: { create: {} },
    },
  });

  await prisma.usuario.upsert({
    where: { dni: DNI.TRANSPORTISTA_1 },
    update: { clerkId: CLERK_IDS.TRANSPORTISTA },
    create: {
      dni: DNI.TRANSPORTISTA_1,
      clerkId: CLERK_IDS.TRANSPORTISTA,
      transportista: {
        create: {
          aliasBancario: "packeteer.moto.carlos",
          cantidadResenas: 24,
          promedioCalificacion: 4.85,
          estado: "DISPONIBLE",
          vehiculo: { create: { categoriaId: "MOTO", patente: "AB123CD" } },
        },
      },
    },
  });

  await prisma.usuario.upsert({
    where: { dni: DNI.TRANSPORTISTA_2 },
    update: {},
    create: {
      dni: DNI.TRANSPORTISTA_2,
      clerkId: "user_seed_transportista_2",
      transportista: {
        create: {
          aliasBancario: "packeteer.auto.lucia",
          cantidadResenas: 47,
          promedioCalificacion: 4.92,
          estado: "NO_DISPONIBLE",
          vehiculo: { create: { categoriaId: "AUTO", patente: "AC456DE" } },
        },
      },
    },
  });

  await prisma.usuario.upsert({
    where: { dni: DNI.ADMIN },
    update: { clerkId: CLERK_IDS.ADMIN },
    create: {
      dni: DNI.ADMIN,
      clerkId: CLERK_IDS.ADMIN,
      helper: { create: {} },
    },
  });

  console.log("• Direcciones del remitente");
  await prisma.direccion.createMany({
    data: [
      {
        remitenteDni: DNI.REMITENTE,
        direccion: BAHIA.origenAlem.direccion,
        ciudad: "Bahía Blanca",
        provincia: "Buenos Aires",
        pais: "Argentina",
        codigoPostal: "8000",
        origenLat: BAHIA.origenAlem.lat,
        origenLng: BAHIA.origenAlem.lng,
      },
      {
        remitenteDni: DNI.REMITENTE,
        direccion: BAHIA.origenMitre.direccion,
        ciudad: "Bahía Blanca",
        provincia: "Buenos Aires",
        pais: "Argentina",
        codigoPostal: "8000",
        origenLat: BAHIA.origenMitre.lat,
        origenLng: BAHIA.origenMitre.lng,
      },
    ],
  });

  console.log("• Zona Caliente vigente");
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  const zona = await prisma.zonaCaliente.create({
    data: {
      centroLat: BAHIA.origenAlem.lat,
      centroLng: BAHIA.origenAlem.lng,
      radioM: 800,
      multiplicadorPrecio: 1.5,
      fechaVigenciaInicio: hoy,
      fechaVigenciaFin: manana,
    },
  });

  console.log("• Envíos en distintos estados");

  // 1) Envío BUSCANDO (para que el transportista pueda aceptar en la demo)
  await prisma.envio.create({
    data: {
      categoriaPaquete: "M",
      remitenteDni: DNI.REMITENTE,
      origenDireccion: BAHIA.origenAlem.direccion,
      origenLat: BAHIA.origenAlem.lat,
      origenLng: BAHIA.origenAlem.lng,
      destinoDireccion: BAHIA.destinoSarmiento.direccion,
      destinoLat: BAHIA.destinoSarmiento.lat,
      destinoLng: BAHIA.destinoSarmiento.lng,
      condicionClimatica: "DESPEJADO",
      estado: "BUSCANDO",
      costo: 1850,
      tipoPago: "DIGITAL",
      zonaCalienteId: zona.codigo,
    },
  });

  // 2) Envío EN_CAMINO (para mostrar tracking en vivo)
  const enCamino = await prisma.envio.create({
    data: {
      categoriaPaquete: "M",
      remitenteDni: DNI.REMITENTE,
      transportistaDni: DNI.TRANSPORTISTA_1,
      origenDireccion: BAHIA.origenMitre.direccion,
      origenLat: BAHIA.origenMitre.lat,
      origenLng: BAHIA.origenMitre.lng,
      destinoDireccion: BAHIA.destinoColon.direccion,
      destinoLat: BAHIA.destinoColon.lat,
      destinoLng: BAHIA.destinoColon.lng,
      condicionClimatica: "DESPEJADO",
      estado: "EN_CAMINO",
      costo: 2200,
      tipoPago: "EFECTIVO",
    },
  });

  await prisma.transportista.update({
    where: { dni: DNI.TRANSPORTISTA_1 },
    data: {
      estado: "OCUPADO",
      ultimaLat: BAHIA.origenMitre.lat,
      ultimaLng: BAHIA.origenMitre.lng,
      ultimaActualizacion: new Date(),
    },
  });

  // 3) Envío ENTREGADO con transacción RETENIDA — alimenta la liquidación
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);

  const entregado = await prisma.envio.create({
    data: {
      categoriaPaquete: "M",
      remitenteDni: DNI.REMITENTE,
      transportistaDni: DNI.TRANSPORTISTA_1,
      origenDireccion: BAHIA.origenAlem.direccion,
      origenLat: BAHIA.origenAlem.lat,
      origenLng: BAHIA.origenAlem.lng,
      destinoDireccion: BAHIA.destinoSarmiento.direccion,
      destinoLat: BAHIA.destinoSarmiento.lat,
      destinoLng: BAHIA.destinoSarmiento.lng,
      condicionClimatica: "LLUVIA",
      estado: "ENTREGADO",
      costo: 2150.5,
      tipoPago: "DIGITAL",
      zonaCalienteId: zona.codigo,
      createdAt: ayer,
      updatedAt: ayer,
    },
  });

  await prisma.transaccion.create({
    data: {
      idReferenciaExterna: `MP-${entregado.id}-${Date.now()}`,
      envioId: entregado.id,
      montoTotal: 2150.5,
      estadoPago: "RETENIDO",
    },
  });

  // 4) Envío ENTREGADO con reseña (para mostrar puntuación)
  const conResena = await prisma.envio.create({
    data: {
      categoriaPaquete: "S",
      remitenteDni: DNI.REMITENTE,
      transportistaDni: DNI.TRANSPORTISTA_1,
      origenDireccion: BAHIA.origenAlem.direccion,
      origenLat: BAHIA.origenAlem.lat,
      origenLng: BAHIA.origenAlem.lng,
      destinoDireccion: BAHIA.destinoColon.direccion,
      destinoLat: BAHIA.destinoColon.lat,
      destinoLng: BAHIA.destinoColon.lng,
      condicionClimatica: "DESPEJADO",
      estado: "ENTREGADO",
      costo: 1200,
      tipoPago: "EFECTIVO",
      createdAt: ayer,
      updatedAt: ayer,
    },
  });

  await prisma.resena.create({
    data: {
      envioId: conResena.id,
      puntaje: 5,
      comentario: "Excelente servicio, llegó antes de tiempo.",
    },
  });

  console.log("• Métrica del día anterior");
  await prisma.metrica.upsert({
    where: { fechaReporte: ayer },
    update: {},
    create: {
      fechaReporte: ayer,
      cantidadEnviosTotales: 12,
      gananciaNetaPlataforma: 8950.75,
    },
  });

  console.log("✓ Seed completado.");
  console.log(`  Transportista DISPONIBLE: ${DNI.TRANSPORTISTA_1} (MOTO, posición actual seteada)`);
  console.log(`  Envío BUSCANDO: aparece en explorar`);
  console.log(`  Envío EN_CAMINO: visible en tracking`);
  console.log(`  Transacción RETENIDA: lista para el job de liquidación`);
  console.log(`  Helper: ${DNI.ADMIN}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
