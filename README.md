# 👟 SNEAKDEX - Sneaker Collection Pokédex

Aplicación web interactiva para coleccionismo de zapatillas inspirada fielmente en la **Pokédex de Pokémon**, diseñada para su despliegue inmediato en **Vercel** y optimizada para dispositivos móviles.

![Sneakdex Preview](public/favicon.svg)

---

## ⚡ Características Principales

1. **Diseño Pokédex Auténtico**:
   - Chasis exterior rojo con lente de escaneo azul brillante y reflectante con pulsación luminosa.
   - Trío de luces LED indicadoras (rojo, amarillo, verde).
   - Encabezado centrado con el nombre **SNEAKDEX** en tipografía Pixel Art (`Press Start 2P`).
   - Pantalla LCD retro iluminada con efecto sutil de líneas de escaneo (scanlines).
   - Botón central tipo **Pokéball** táctil para registrar nuevos pares de zapatillas.
   - Sonidos 8-bit sintetizados en tiempo real mediante **Web Audio API** (sin dependencias ni descargas de audio externas, con botón de silenciado).

2. **Rejilla de Zapatillas (2 Columnas x 2.5 Filas)**:
   - Vista principal estructurada estrictamente en **dos columnas**.
   - Altura de la ventana calculada para mostrar exactamente **2 filas completas y la mitad de la 3ª fila (2.5 filas)**, insinuando visualmente al usuario el desplazamiento vertical suave.
   - Miniaturas con número de entrada de catálogo Pokédex (`#001`, `#002`...), etiqueta de categoría/tipo y distintivo de fotos múltiples.

3. **Vista de Detalle con Carrusel y Tipografía Pixel Art**:
   - Al pulsar cualquier zapatilla, se abre la interfaz de ficha técnica.
   - **Imagen central** nítida enmarcada en el visor LCD.
   - Botones direccionales **`<` y `>` a los lados de la imagen** para navegar cómodamente entre todas las fotos registradas de ese par.
   - Soporte para deslizamiento táctil (swipe en móviles) y flechas del teclado (izquierda/derecha).
   - **Nombre de la zapatilla centrado**.
   - **Pequeña descripción centrada en tipografía pixel art de color gris**, tal como fue especificado.
   - Contador de imágenes `FOTO X / Y`, botones de edición y eliminación.

4. **Registro y Alta de Nuevas Zapatillas ("Dar de alta")**:
   - Formulario emergente con estética de terminal Pokédex.
   - Subida de **múltiples fotos** directamente desde la cámara o galería del teléfono (convertidas automáticamente a base64 DataURL).
   - Opción para añadir imágenes pegando URLs web.
   - Vista previa en miniatura con botón para descartar imágenes individuales.
   - Campos para Nombre, N° Pokédex, Tipo/Categoría (Basketball, Skate, Runner, Classic, Heritage, Tech, Grail, Custom), Descripción en pixel art, Marca, Talla, Colorway y Estado (Deadstock, VNDS, Usado, etc.).
   - Animación de confeti de celebración y fanfarria 8-bit al registrar.

5. **Persistencia Total**:
   - Todos los datos y fotos se guardan en el `localStorage` del navegador. Tus zapatillas permanecen guardadas entre visitas y reinicios.
   - Opción de restaurar la colección por defecto con los 6 modelos iniciales emblemáticos (Air Jordan 1 Chicago, Travis Scott SB Dunk, Yeezy Boost 350 Zebra, New Balance 990v3, Air Max 1 Big Bubble, Asics Gel-Kayano 14).

---

## 🚀 Despliegue en Vercel

La aplicación está 100% preparada para Vercel:

### Opción 1: Conectar repositorio GitHub a Vercel (Recomendado)
1. Sube tu código a GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Sneakdex web app"
   git push origin main
   ```
2. Entra en [vercel.com](https://vercel.com/) y pulsa **"Add New Project"**.
3. Selecciona tu repositorio `sneadex`. Vercel detectará automáticamente la configuración Vite y `vercel.json`.
4. Pulsa **"Deploy"**. En 30 segundos tu app estará en línea con dominio `.vercel.app`.

### Opción 2: Despliegue directo mediante Vercel CLI
```bash
npx vercel
```

---

## 🛠️ Ejecución Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Generar bundle de producción
npm run build
```
