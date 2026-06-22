# Packeteer

Plataforma de logística colaborativa peer-to-peer. Conecta remitentes que necesitan
enviar paquetes con transportistas particulares que ofrecen su vehículo y tiempo.

Trabajo Práctico Final · Arquitectura y Diseño de Sistemas 2026 · UNS · Grupo 18.

---

## Tabla de contenido

- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Setup local](#setup-local)
- [Variables de entorno](#variables-de-entorno)
- [Comandos útiles](#comandos-útiles)
- [Endpoints HTTP](#endpoints-http)
- [Autenticación y roles](#autenticación-y-roles)
- [Patrones para nuevos módulos](#patrones-para-nuevos-módulos-leer-si-tu-rol-no-es-transportista)
- [Schema de base de datos](#schema-de-base-de-datos)
- [Cómo importar piezas compartidas](#cómo-importar-piezas-compartidas)
- [Manejo de errores](#manejo-de-errores)
- [Pipeline de datos](#pipeline-de-datos)
- [Cómo grabar la demo](#cómo-grabar-la-demo)
- [Tests](#tests)
- [Coordinación entre ramas](#coordinación-entre-ramas)

---

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend + API | Next.js (App Router) | 16.2.6 |
| Lenguaje | TypeScript | ^5 |
| UI components | shadcn/ui + base-ui | — |
| Mapas | Mapbox GL + react-map-gl | 3.x |
| Autenticación | Clerk | 7.5.x |
| Base de datos | PostgreSQL (Neon) | — |
| ORM | Prisma + adapter-pg | 6.19.3 |
| Validación | Zod | 4.4.3 |
| Pagos | MercadoPago (fake en demo) | 3.1.x |
| Clima | Open-Meteo (REST) | — |
| Storage | Vercel Blob | 2.4.x |
| Hosting | Vercel (cron incluido) | — |

Stack confirmado por los ADRs:
- **ADR-001** Monolito modular como organización del backend.
- **ADR-002** REST entre componentes (sin colas ni eventos asincrónicos).
- **ADR-003** Cloud sin contenerización.
- **ADR-005** PostgreSQL como motor relacional único.

---

## Arquitectura

Capas inspiradas en Hexagonal / Ports & Adapters, aplicadas dentro del monolito modular.

```
┌─────────────────────────────────────────────────────────────────┐
│  app/(landing|remitentes|transportista|soporte) ── Vistas Next  │
│  app/api/**/route.ts ──────────────────────────── Route Handlers│
├─────────────────────────────────────────────────────────────────┤
│  lib/composition.ts ───────────────────────── Composition Root  │
├─────────────────────────────────────────────────────────────────┤
│  lib/application/use-cases/ ───────────────── Casos de uso      │
│  lib/application/repositories/ ─ Puertos (interfaces)           │
│  lib/application/ports/ ──────── Otros puertos (auth, lock, …)  │
├─────────────────────────────────────────────────────────────────┤
│  lib/domain/ ─────────── Entidades, reglas, máquinas de estado  │
├─────────────────────────────────────────────────────────────────┤
│  lib/infrastructure/prisma/ ─ Adapters Prisma (impl. de repos)  │
│  lib/infrastructure/clerk/ ── Adapter de auth                   │
│  lib/infrastructure/pasarela/  Adapter de pagos                 │
│  lib/application/in-memory/ ── Adapters fake (tests + dev)      │
└─────────────────────────────────────────────────────────────────┘
```

El dominio no conoce Next, Prisma ni Clerk. La capa de aplicación tampoco. Eso
permite testear ~115 escenarios sin levantar base de datos.

---

## Estructura de carpetas

```
app/
  api/                         Route Handlers
    envios/                    Remitente + Transportista
    transportistas/me/         Transportista (perfil, vehículo, ubicación)
    remitentes/                Remitente
    tickets/                   Soporte
    jobs/liquidacion/          Cron nocturno (Pipeline 4)
    webhooks/clerk/            Sync de usuarios desde Clerk
  (landing) (remitentes) (transportista) (soporte)
                               Páginas por actor
components/                    UI components (shadcn + propios)
features/                      Hooks y services por feature
lib/
  api-contract/                DTOs exportados para que UI importe
  application/
    in-memory/                 Fakes para tests y mocks de UI
    ports/                     Puertos (Authenticator, PasarelaDePagos…)
    repositories/              Interfaces de repositorios
    use-cases/                 Lógica de aplicación
    __tests__/                 Tests de application layer
  auth/                        Helpers de auth (contexto, errores)
  domain/                      Entidades + reglas (puro TS)
    transportista/ envio/ vehiculo/ geo/ liquidacion/
    __tests__/                 Tests de dominio
  http/                        DTOs, mapeo de errores, helpers HTTP
  infrastructure/
    clerk/                     Adapter Clerk
    pasarela/                  Adapter MercadoPago (fake en demo)
    prisma/                    Adapters Prisma + mappers
  validation/                  Schemas Zod por endpoint
  composition.ts               Composition Root (inyección de deps)
  prisma.ts                    Singleton del cliente Prisma
prisma/
  schema.prisma                Schema único de la BD
  seed.ts                      Data sembrada para demo
proxy.ts                       Middleware de Next 16 (ex middleware.ts)
vercel.json                    Cron config para el job nocturno
```

---

## Setup local

### 1) Clonar y dependencias

```bash
git clone https://github.com/Nicoo54/proyecto-paqueteria-arquitectura.git
cd proyecto-paqueteria-arquitectura
npm install
```

### 2) Variables de entorno

Crear `.env.local` en la raíz (ver sección [Variables de entorno](#variables-de-entorno)).

### 3) Aplicar el schema a la BD

```bash
npx prisma db push          # Sincroniza el schema sin crear migraciones
# o
npx prisma migrate dev      # Crea migraciones formales (recomendado para producción)
```

### 4) Sembrar datos de demo

```bash
npx tsx prisma/seed.ts
```

### 5) Arrancar el dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Variables de entorno

Archivo `.env.local`:

```env
# Base de datos (Neon)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Clerk (auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="pk.ey..."

# MercadoPago (sandbox)
MP_ACCESS_TOKEN="TEST-..."

# Vercel Blob (storage)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Cron (proteje el endpoint /api/jobs/liquidacion)
CRON_SECRET="cualquier-string-secreto"

# App URL (usado por MercadoPago para back URLs)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Seed (opcional, mapea clerkId reales a DNIs sembrados)
SEED_CLERK_REMITENTE_ID="user_..."
SEED_CLERK_TRANSPORTISTA_ID="user_..."
SEED_CLERK_ADMIN_ID="user_..."
```

> **Aviso:** `.env.local` NO se commitea. Compartir las credenciales por canal
> privado (1Password, Bitwarden, mensaje directo).

---

## Comandos útiles

```bash
npm run dev                    Arrancar dev server
npm run build                  Build de producción
npm run lint                   ESLint
npx tsc --noEmit               Type-check
npx prisma generate            Regenerar el cliente Prisma
npx prisma db push             Aplicar el schema a la BD
npx prisma studio              Abrir GUI de la BD en :5555
npx tsx prisma/seed.ts         Sembrar datos de demo
npx tsx lib/domain/__tests__/run.ts   Correr los ~115 tests
```

---

## Endpoints HTTP

### Transportista (implementado en `feature/transportista`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET`   | `/api/transportistas/me` | Datos del perfil |
| `PATCH` | `/api/transportistas/me/disponibilidad` | Cambiar a DISPONIBLE / NO_DISPONIBLE |
| `PATCH` | `/api/transportistas/me/ubicacion` | Reportar lat/lng (Pipeline 1) |
| `GET`   | `/api/transportistas/me/envios` | Historial paginado |
| `GET`   | `/api/transportistas/me/vehiculos` | Datos del vehículo |
| `POST`  | `/api/transportistas/me/vehiculos` | Registrar primer vehículo |
| `PATCH` | `/api/transportistas/me/vehiculos` | Actualizar vehículo |
| `GET`   | `/api/envios` | Explorar envíos BUSCANDO cerca |
| `PATCH` | `/api/envios/{id}` | Aceptar un envío |
| `PATCH` | `/api/envios/{id}/estado` | Cambiar estado: RETIRADO / EN_CAMINO / ENTREGADO |
| `POST`  | `/api/jobs/analitica-nocturna` | Cron nocturno (Pipeline 3) — protegido por `CRON_SECRET` |
| `POST`  | `/api/jobs/liquidacion` | Cron nocturno (Pipeline 4) — protegido por `CRON_SECRET` |

### Remitente (implementado en `feature/remitente`)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/envios/cotizaciones` | Cotizar envío (Pipeline 2) |
| `POST` | `/api/envios` | Confirmar envío con precio cotizado |
| `GET`  | `/api/envios/{id}` | Detalle del envío |
| `GET`  | `/api/envios/{id}/tracking` | Última posición del transportista |
| `POST` | `/api/envios/{id}/resenas` | Calificar al transportista (Pipeline 5) |
| `GET`  | `/api/remitentes/{id}/envios` | Historial del remitente |

### Soporte / Tickets

| Método | Ruta | Descripción |
|---|---|---|
| `POST`  | `/api/tickets` | Crear reclamo |
| `PATCH` | `/api/tickets/{id}` | Tomar / actualizar ticket |

### Webhook

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/webhooks/clerk` | Sincronizar usuarios desde Clerk a la tabla `Usuario` |

---

## Autenticación y roles

### Configuración en Clerk

Hay 3 usuarios de prueba creados en Clerk:

| Email | Contraseña | Rol (publicMetadata) |
|---|---|---|
| `usuario+clerk_test@a.com` | `1234` | (sin rol → tratado como remitente) |
| `transportista+clerk_test@a.com` | `1234` | `"role": "transportista"` |
| `admin+clerk_test@a.com` | `1234` | `"role": "admin"` (= Soporte) |

Código de verificación: `424242`.

### Cómo se valida en el backend

Cada Route Handler que requiere auth llama:

```ts
import { contextoTransportista } from "@/lib/http/handler-utils";

export async function GET() {
  const { deps, ctx } = await contextoTransportista();
  // ctx.dni → DNI del transportista logueado
  // ctx.clerkId → id de Clerk
  // ctx.rol → "transportista"
}
```

Internamente: `Authenticator` (Clerk) → `UsuarioRepository` (mapea `clerkId` → `dni`)
→ chequea que `publicMetadata.role === "transportista"`.

Para tus propios endpoints podés crear helpers similares (`contextoRemitente`,
`contextoAdmin`). El patrón está en `lib/auth/contexto-auth.ts`.

---

## Patrones para nuevos módulos (leer si tu rol no es Transportista)

El módulo Transportista quedó como referencia de cómo construir cada feature.
Te paso el resumen para que repitas la receta sin pensarlo demasiado.

### 1. Modelo de dominio puro

Si vas a tener entidades con reglas de negocio (ej: Cotizacion, Ticket, Resena),
crealas en `lib/domain/<entidad>/`. Solo TypeScript, sin imports de Prisma ni Next.
Esto te permite testear las reglas sin levantar BD.

### 2. Define el contrato del repositorio

En `lib/application/repositories/<entidad>-repository.ts`:

```ts
export interface CotizacionRepository {
  guardar(c: Cotizacion): Promise<Cotizacion>;
  obtenerVigente(remitenteDni: string, hash: string): Promise<Cotizacion | null>;
}
```

### 3. Caso de uso en la capa de aplicación

En `lib/application/use-cases/<modulo>/<caso>.ts`. Inyectá los repos en el
constructor, no importes Prisma directo.

### 4. Implementá el repo con Prisma

En `lib/infrastructure/prisma/prisma-<entidad>-repository.ts`. Acá sí usás
`prisma` directamente.

### 5. Schema Zod para el request

En `lib/validation/<modulo>.ts`. Exportá el schema **y** el tipo inferido.

### 6. Route Handler

En `app/api/<ruta>/route.ts`. Plantilla mínima:

```ts
import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/http/response";
import { parseConSchema } from "@/lib/validation/parse";
import { MiSchema } from "@/lib/validation/mimodulo";
import { contextoTransportista, leerBody } from "@/lib/http/handler-utils";

export async function POST(req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const body = await leerBody(req);
    const parse = parseConSchema(MiSchema, body);
    if (!parse.ok) return jsonOk(parse.error.body, parse.error.status);

    const r = await deps.casosDeUso.algo.ejecutar({ ...parse.valor, dni: ctx.dni });
    return jsonOk(r);
  } catch (e) {
    return jsonError(e);
  }
}
```

### 7. Agregalo al composition root

`lib/composition.ts` instancia todos los adapters y casos de uso. Sumá ahí
tu nuevo repo y caso de uso para que los handlers lo reciban inyectado.

---

## Schema de base de datos

Definido en `prisma/schema.prisma`.

### Decisiones del schema

- **Enums** para todos los estados (EstadoEnvio, EstadoPago, EstadoTransportista,
  EstadoTicket, CategoriaVehiculoEnum, CategoriaPaqueteEnum, TipoPago). Resuelve
  la observación de la cátedra de E3 sobre CHECK constraints.
- **Relaciones declaradas** entre todos los modelos (FK con `@relation`).
  Permite `include` anidado en Prisma sin queries extras.
- **camelCase en los nombres de modelo y campos** (`Transportista.aliasBancario`)
  con `@map` a snake_case en columnas. Estándar de Prisma.
- **Singleton del cliente** en `lib/prisma.ts` para evitar múltiples conexiones
  en hot reload.

### Campos clave agregados sobre E3

| Modelo | Campos | Para qué |
|---|---|---|
| `Transportista` | `estado` (enum), `ultimaLat`, `ultimaLng`, `ultimaActualizacion` | Disponibilidad + tracking GPS |
| `Transaccion` | `fechaLiquidacion`, `montoComisionPlataforma`, `montoTransportista`, `idTransferenciaExterna` | Auditoría de liquidación |
| `Envio` | `tipoPago` (enum DIGITAL/EFECTIVO) | Define si va por MercadoPago o efectivo |
| `Vehiculo` | `transportistaDni` (FK 1-1) | Coincide con `openapi.yaml` |

### Cómo aplicar cambios al schema

1. Modificás `prisma/schema.prisma`.
2. `npx prisma generate` regenera el cliente TS.
3. `npx prisma db push` aplica el cambio a la BD (sin migraciones formales).
4. `npx prisma migrate dev --name describe-cambio` si querés migraciones.

> **Convención del equipo:** los cambios al schema se coordinan en el grupo.
> Si lo tocás, avisá por chat antes de pushear para que nadie pierda trabajo.

---

## Cómo importar piezas compartidas

### Cliente Prisma

```ts
import { prisma } from "@/lib/prisma";

const envio = await prisma.envio.findUnique({ where: { id: 1040 } });
```

### Tipos de dominio (entidades, estados)

```ts
import type { EstadoEnvio } from "@/lib/domain/envio/types";
import type { Transportista } from "@/lib/domain/transportista/types";
```

### DTOs y contratos de API (para UI)

```ts
import type {
  TransportistaDto,
  EnvioDto,
  EstadoEnvio,
} from "@/lib/api-contract";
import { API_ENDPOINTS } from "@/lib/api-contract";

const r = await fetch(API_ENDPOINTS.TRANSPORTISTA.PERFIL);
const data: TransportistaDto = await r.json();
```

> **Nota para UI:** los DTOs van en camelCase. Si en tus mocks tenés snake_case
> (`codigo_envio`, `categoria_paquete`), cambialos antes de integrar con la API real.

### Helpers HTTP

```ts
import { jsonOk, jsonError, noContent } from "@/lib/http/response";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, leerBody } from "@/lib/http/handler-utils";
```

### Errores tipados del dominio

```ts
import {
  DomainError,
  EstadoInvalido,
  CapacidadInsuficiente,
  // …
} from "@/lib/domain/errors";

throw new EstadoInvalido("El envío no puede aceptarse en este estado");
// El handler los mapea automáticamente al código HTTP correcto.
```

---

## Manejo de errores

Los errores del dominio (instancias de `DomainError`) se traducen a HTTP
automáticamente mediante `lib/http/errors.ts`. Algunos ejemplos:

| Error | Código HTTP |
|---|---|
| `CapacidadInsuficiente` | 422 |
| `CoordenadasFaltantes` | 412 |
| `TransportistaNoDisponible` | 403 |
| `EnvioNoDisponible` | 409 |
| `VehiculoNoRegistrado` | 422 |
| `PatenteInvalida` | 422 |

Todos respetan el shape del schema `Error` del `openapi.yaml`:

```json
{
  "error": {
    "code": "CAPACIDAD_INSUFICIENTE",
    "message": "El vehículo MOTO no puede transportar paquetes de categoría L",
    "details": { "categoriaVehiculo": "MOTO", "categoriaPaquete": "L" }
  }
}
```

---

## Pipeline de datos

Los 5 pipelines del Entregable 4:

| # | Nombre | Tipo | Implementado en |
|---|---|---|---|
| 1 | Tracking GPS | Streaming (polling HTTP) | `app/api/transportistas/me/ubicacion` + `actualizar-ubicacion` use case |
| 2 | Cotización con clima | Event-driven sincrónico | `app/api/envios/cotizaciones` (Remitente) |
| 3 | Analítico nocturno (Zonas Calientes + Métricas) | Batch nocturno | `app/api/jobs/analitica-nocturna` + `CalcularAnaliticaNocturnaUseCase` |
| 4 | Liquidación de pagos | Batch nocturno + integración externa | `app/api/jobs/liquidacion` + `LiquidarPagosNocturnaUseCase` |
| 5 | Recálculo de puntuación | Event-driven in-process | `app/api/envios/{id}/resenas` (Remitente) |

### Pipeline 3 (Analítico nocturno) — detalles

- Disparado por **Vercel Cron** a las 02:00 AM (config en `vercel.json`).
- Fusiona dos artefactos en un mismo job: Zonas Calientes vigentes para hoy + Métrica diaria del día anterior.
- Lee envíos del día previo, agrupa orígenes en un grid de ~0.5km, detecta celdas que superan un umbral de densidad, calcula centroide y emite Zona Caliente con vigencia hoy → mañana.
- Calcula la métrica diaria: cantidad total de envíos y ganancia neta de la plataforma (suma de comisión 15% sobre los entregados).
- Idempotente: `vencerHasta(hoy)` + `insertarVarias` reemplaza el set de zonas; `UPSERT` en Métrica.
- Lock distribuido por `pg_try_advisory_lock` evita corridas concurrentes.
- Para grabar la demo: `curl -X POST http://localhost:3000/api/jobs/analitica-nocturna -H "authorization: Bearer $CRON_SECRET"`.

### Pipeline 4 (Liquidación) — detalles

- Disparado por **Vercel Cron** a las 03:00 AM (config en `vercel.json`).
- Idempotencia con **PostgreSQL advisory locks** (`pg_try_advisory_lock`).
- Reintentos con backoff exponencial: 1s, 2s, 4s.
- Resultados posibles por transacción: `LIQUIDADO`, `REVISION_MANUAL`, queda en `LIBERADO` para próxima corrida.
- Para la demo: la `PasarelaDePagos` real fue reemplazada por una `FakePasarelaDePagos` que siempre responde EXITOSA. La integración con MercadoPago Money Out está documentada como comentario en `lib/infrastructure/pasarela/fake-pasarela-pagos.ts`.

### Cómo disparar la liquidación manualmente

Para la grabación de la demo, en lugar de esperar al cron:

```bash
curl -X POST http://localhost:3000/api/jobs/liquidacion \
     -H "authorization: Bearer $CRON_SECRET"
```

Devuelve JSON con estadísticas:

```json
{
  "ok": true,
  "ejecutado": true,
  "procesados": 3,
  "liquidados": 2,
  "revisionManual": 0,
  "fallidosTransitorios": 1
}
```

---

## Cómo grabar la demo

1. **Sembrar la BD** con `npx tsx prisma/seed.ts`. Esto crea:
   - 1 envío en estado `BUSCANDO` (listo para aceptar)
   - 1 envío en estado `EN_CAMINO` con un transportista asignado (listo para tracking)
   - 1 envío en estado `ENTREGADO` con transacción `RETENIDA` (listo para liquidar)
   - 1 envío con reseña ya cargada
2. **Levantar el dev server**: `npm run dev`.
3. **Loguearse como remitente** y mostrar:
   - Cotización con clima
   - Confirmación del envío
4. **Loguearse como transportista** (`transportista+clerk_test@a.com`) y mostrar:
   - Explorar el envío disponible
   - Aceptarlo
   - Reportar ubicaciones (manual o con simulador)
   - Marcar RETIRADO → EN_CAMINO → ENTREGADO
5. **Volver al remitente** y dejar una reseña.
6. **Disparar la liquidación manualmente** con `curl` y mostrar la respuesta.

El video debe durar 5 a 7 minutos. Cortar tiempos muertos.

---

## Tests

Hay ~115 tests unitarios que cubren dominio y application layer. No requieren BD.

```bash
npx tsx lib/domain/__tests__/run.ts
```

Cobertura:
- Máquinas de estado de Envío, Transportista y Pago.
- Validaciones de patente, capacidad de vehículo, transiciones.
- Geofencing y Haversine.
- Casos de uso con adapters in-memory.
- Liquidación nocturna: happy path, reintentos, lock distribuido, rechazo, idempotencia.

Cuando el grupo decida un framework formal (Vitest / Jest), los archivos
`.test.ts` están escritos con `describe` / `it` / `expect` y solo cambia el import
del runner.

---

## Coordinación entre ramas

### Estado actual de las ramas

| Rama | Dueño | Estado |
|---|---|---|
| `main` | — | Solo scaffold inicial |
| `develop` | Tech Lead | Tiene UI mergeada (todas las páginas con mocks) |
| `feature/db-setup` | — | Schema SQL inicial del E3 |
| `feature/ui` | UI | Mergeada a develop |
| `feature/transportista` | Transportista | **Esta rama.** Domain + application + adapters + endpoints + Pipeline 4 |
| `feature/remitente` | Remitente | Schema Prisma diferente + 10 route handlers propios |
| `Sistemas` | Sistemas Externos | Wrappers de MercadoPago, Open-Meteo, Vercel Blob |

### Notas al mergear `feature/transportista` a develop

- **Conflicto en `prisma/schema.prisma`** con `feature/remitente`. Resolución: mantener este schema (tiene enums + relaciones + campos de tracking y auditoría que no están en el otro). Los route handlers de Remitente necesitan ajustarse a los nombres camelCase, son ~30 cambios mecánicos.
- **`lib/prisma.ts`** sigue el mismo patrón que el de Remitente. Si hay conflicto, mantener cualquiera de los dos (son equivalentes).
- **`app/api/envios/route.ts`**: este archivo aporta el `GET` para explorar (Transportista). El `POST` para publicar lo aporta Remitente. Al mergear, ambos handlers conviven en el mismo file.
- **`app/api/envios/[id]/route.ts`**: este aporta el `PATCH` (aceptar). El `GET` (detalle) lo aporta Remitente.

### Pendientes de coordinación

- Cuando Sistemas Externos integre MercadoPago Money Out real para liquidación, reemplazar `FakePasarelaDePagos` por la implementación real (ver comentario en `lib/infrastructure/pasarela/fake-pasarela-pagos.ts`).
- Mover de polling a WebSocket si en algún momento el sistema escala (no es necesario para esta demo).
