# BEAT ROOM — plantilla de web para beats

## Estructura
- `index.html`
- `css/styles.css`
- `js/beats.js`
- `assets/logo.png` (tu logo)
- `assets/beats/` (tus MP3)
- `assets/covers/` (portadas de cada beat)

## Personalización obligatoria
1. Abre `js/beats.js`.
2. Cambia `CONFIG.whatsappNumber` por tu número con código de país, solo números. Ejemplo: `18095551234`.
3. Edita el arreglo `beats` con nombres, género, BPM, tonalidad y rutas de tus archivos.
4. Coloca los MP3 con los mismos nombres de archivo indicados en `audio`.
5. Coloca las portadas con los mismos nombres indicados en `cover`.
6. Para usar tu logo, guarda la imagen como `assets/logo.png`. Si no existe, aparecerá un monograma temporal.

## Probar
Abre `index.html` en un navegador moderno. Si los audios no se reproducen al abrir el archivo directamente, ejecuta un servidor local, por ejemplo la extensión Live Server de Visual Studio Code.

## Importante
- Los beats y portadas de ejemplo son marcadores de posición: debes añadir tus propios archivos.
- Los botones de compra abren WhatsApp con un mensaje preescrito; no procesan pagos automáticamente.
- Cambia el nombre "BEAT ROOM" por tu marca en `index.html` y `js/beats.js`.
- Usa únicamente audios, portadas y muestras que tengas derecho a publicar.
