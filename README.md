# 👟 SNEAKDEX - Sneaker Collection Pokédex (Vercel Native)

Aplicación web interactiva para coleccionismo de zapatillas inspirada fielmente en la **Pokédex de Pokémon**, con almacenamiento en la nube en el ecosistema nativo de **Vercel** (`@vercel/blob` + `@vercel/kv`), Serverless Functions y optimizada para dispositivos móviles.

![Sneakdex Preview](public/favicon.svg)

---

## ⚡ Arquitectura Vercel Native

- **Imágenes (`@vercel/blob`)**: Almacenamiento seguro de fotos en CDN global. Las imágenes no se guardan en el cliente ni consumen la cuota de `localStorage`.
- **Datos de Colección (`@vercel/kv`)**: Almacén clave-valor ultrarrápido (Upstash / Redis) que persiste el nombre, número, descripción, marca, talla y URLs de las fotos de cada zapatilla en la nube.
- **Serverless Functions (`/api`)**: Endpoints seguros en Node.js que manejan el CRUD y las subidas a Blob sin exponer ningún token o credencial sensible en el cliente.
- **Fallback local inteligente**: El servidor de desarrollo incluye un middleware en `vite.config.js` que emula los endpoints `/api` durante el desarrollo local (`npm run dev`), garantizando que la aplicación funcione siempre.

---

## 🔑 Variables de Entorno en Vercel

Al desplegar tu proyecto en Vercel o vincular los stores desde la pestaña **Storage** de tu panel de Vercel, debes configurar estas variables:

| Variable | Descripción | Dónde se obtiene |
| :--- | :--- | :--- |
| `BLOB_READ_WRITE_TOKEN` | Token con permisos de lectura y escritura para subir imágenes a Vercel Blob. | En tu proyecto Vercel > **Storage** > **Create Database** > **Blob**. Se inyecta automáticamente al pulsar *Connect to Project*. |
| `KV_REST_API_URL` | URL de conexión REST para la base de datos KV (Upstash Redis). | En tu proyecto Vercel > **Storage** > **Create Database** > **KV**. Se inyecta automáticamente al conectar. |
| `KV_REST_API_TOKEN` | Token de autenticación REST para Vercel KV. | En tu proyecto Vercel > **Storage** > **KV** > pestaña *.env*. Se inyecta automáticamente. |
| `KV_REST_API_READ_ONLY_TOKEN` *(Opcional)* | Token de solo lectura generado por Vercel KV. | Generado automáticamente por Vercel KV. |
| `KV_URL` *(Opcional)* | Cadena de conexión `redis://...` completa. | Generado automáticamente por Vercel KV. |

> 💡 **Nota rápida**: Si creas los almacenes **KV** y **Blob** directamente desde la sección **Storage** del panel de control de tu proyecto en Vercel, Vercel **inyecta automáticamente todas estas variables** en tu entorno sin que tengas que copiarlas manualmente.

Para desarrollo local, puedes crear un archivo `.env.local` en la raíz con tus claves o ejecutar `npx vercel env pull .env.local`.

---

## 🛠️ Comandos de Instalación y Ejecución

```bash
# 1. Instalar dependencias del proyecto (incluye @vercel/blob y @vercel/kv)
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Compilar bundle de producción
npm run build
```

---

## 🚀 Despliegue en Vercel

### Opción 1: Conectar repositorio GitHub a Vercel (Recomendado)
1. Sube tu código a GitHub:
   ```bash
   git add .
   git commit -m "feat: migrate to @vercel/blob and @vercel/kv"
   git push origin main
   ```
2. Entra en [vercel.com](https://vercel.com/) y haz clic en **"Add New Project"**.
3. Selecciona el repositorio `sneadex`. Vercel detectará la configuración Vite y las funciones `/api` automáticamente.
4. En el panel de tu proyecto en Vercel, ve a **Storage**:
   - Pulsa **Create Database** -> Selecciona **KV** -> Pulsa **Connect to Project**.
   - Pulsa **Create Database** -> Selecciona **Blob** -> Pulsa **Connect to Project**.
5. ¡Listo! Tu Sneakdex guardará fotos y datos en tiempo real en la nube.

### Opción 2: Despliegue directo mediante Vercel CLI
```bash
# Vincular y desplegar
npx vercel

# Vincular los stores de storage
npx vercel link
npx vercel env pull .env.local
```

---

## 📱 Características de la Interfaz

1. **Header centrado**: La palabra **SNEAKDEX** en tipografía Pixel Art (`Press Start 2P`) con luces LED indicadoras de sincronización (`KV SYNC`).
2. **Rejilla 2 columnas x 2.5 filas**: Visor de altura calculada mostrando 2 filas completas y la mitad superior de la 3ª fila.
3. **Ficha de detalle**:
   - Imagen central con botones direccionales **`<` y `>` a los lados** para navegar entre todas las fotos del par.
   - **Nombre de la zapatilla centrado**.
   - **Pequeña descripción centrada en tipografía pixel art de color gris**.
4. **Alta de zapatillas**:
   - Botón superior `+` y botón inferior central tipo **Pokéball**.
   - Subida de múltiples fotos directamente a **Vercel Blob Storage**.
