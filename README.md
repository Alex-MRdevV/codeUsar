# Bavaria-App (SendFlow)

Aplicación web diseñada para automatizar el envío de mensajes masivos utilizando la API de Cloud WhatsApp, Astro, React, Drizzle ORM y TailwindCSS v4.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
* **Node.js** (versión 18 o superior recomendada)
* **pnpm** (gestor de paquetes recomendado para instalar dependencias rápidas y eficientes)

---

## 🚀 Guía de Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto localmente:

### 1. Descomprimir e Instalar Dependencias
Extrae los archivos e instala las dependencias del proyecto utilizando `pnpm`:
```bash
pnpm install
```

### 2. Configurar Variables de Entorno
El proyecto requiere configuraciones específicas para conectarse con la API de WhatsApp, la base de datos (Turso/libSQL), Clerk (autenticación) y Ably (mensajes en tiempo real).

Copia los archivos de ejemplo para crear tus archivos locales:
```bash
cp .env.example .env
cp .dev.vars.example .dev.vars
```

Abre `.env` y `.dev.vars` y completa los valores correspondientes con tus credenciales y URLs.

### 3. Migrar la Base de Datos
El proyecto utiliza Drizzle ORM para gestionar la base de datos Turso (libSQL). Genera y aplica las migraciones utilizando los siguientes comandos:
```bash
# Generar las migraciones locales basadas en el esquema
pnpm db:generate

# Aplicar las migraciones a la base de datos remota/local
pnpm db:migrate
```

### 4. Servidor de Desarrollo
Inicia el servidor de desarrollo local para probar la aplicación:
```bash
pnpm dev
```
Por defecto, la aplicación estará disponible en `http://localhost:4321`.

### 5. Construcción para Producción
Para compilar la aplicación para producción (adaptada para Vercel):
```bash
pnpm build
```

---

## 📁 Estructura Principal del Proyecto
* `/src/pages/` - Rutas de la aplicación (incluyendo endpoints de la API).
* `/src/components/` - Componentes React y Astro ordenados por módulos (mensajes, historial, subida de archivos, etc.).
* `/src/hooks/` - Hooks personalizados de React para lógica de negocio.
* `/src/utils/` - Funciones de utilidad, tipos TypeScript y servicios de base de datos.
* `astro.config.mjs` - Configuración de Astro e integraciones.
* `drizzle.config.ts` - Configuración de Drizzle ORM para base de datos.
