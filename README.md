# TrackOrder

Sistema de gestión y seguimiento de pedidos en tiempo real. Proyecto integrador de Angel Barbarin, Diego Valerio y Diego Alvarez.

El backend es un **monolito modular orientado a eventos** construido con NestJS, PostgreSQL y Socket.IO, escrito en **JavaScript**.

## Requisitos

- Node.js 22 o superior
- Docker y Docker Compose (para la base de datos), o un PostgreSQL 16 local

## Cómo correrlo en local

```bash
cp .env.example .env
docker compose up -d db      # levanta PostgreSQL
npm install
npm run start:dev            # API en http://localhost:3000/api
```

- Documentación interactiva (Swagger): http://localhost:3000/api/docs
- Verificación rápida: `GET http://localhost:3000/api/health`

Para levantar todo (API + base de datos) en contenedores: `docker compose up --build`.

## Pruebas

```bash
npm test
```

## Estructura

```
src/
  main.js                 arranque, prefijo /api y Swagger
  app.module.js           conexión a PostgreSQL y registro de módulos
  common/                 decoradores, guardias, validación y utilidades compartidas
docs/                     documentación del avance
```

Cada módulo de negocio vive en su propia carpeta dentro de `src/`:

| Módulo | Qué hace |
|---|---|
| `auth`, `usuarios` | Registro, login con JWT, roles y administración de cuentas |
| `catalogo` | Tiendas y productos |
| `pedidos` | Checkout, máquina de estados, asignación de repartidor, incidencias e historial de eventos |
| `notificaciones` | Canal en tiempo real (Socket.IO, namespace `/tiempo-real`) |

Los módulos se comunican mediante eventos de dominio (`pedido.creado`, `pedido.estado_cambiado`, `pedido.asignado`, `pedido.incidencia`).

## NestJS en JavaScript

NestJS usa decoradores (`@Controller`, `@Get`, `@Column`...), que JavaScript todavía no soporta de forma nativa. Por eso el código pasa por **Babel** (`babel.config.json`): `npm start` lo traduce al vuelo y `npm run build` genera la carpeta `dist/` que se usa en producción y en Docker.

Hay tres diferencias con los ejemplos de NestJS en TypeScript (la documentación oficial muestra ambas versiones con la pestaña **JS**):

- Las dependencias de una clase se declaran con `@Dependencies(...)` y se reciben en el constructor en el mismo orden.
- Los parámetros de una ruta se indican con `@Bind(Param('id'), Body(...), ...)` en lugar de decorar cada parámetro.
- Cada body o query se valida con `validar(MiDto)` (`src/common/pipes/validar.js`), y en las entidades cada `@Column` lleva su `type`.

## Documentación

- [Primer avance (PDF)](docs/TrackOrder_Primer_Avance.pdf) y su [versión en Markdown](docs/primer-avance.md): arquitectura, modelo de datos y API.
- [Contrato OpenAPI](docs/openapi.json), también navegable en `/api/docs` con la API corriendo.
