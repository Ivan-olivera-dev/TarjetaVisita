# Especificación Funcional: MVP de Tarjeta de Visita Virtual NFC (`TarjetaVisita`)

- **ID de Especificación**: `001-mvp`
- **Estado**: aprobado
- **Fecha**: 2026-10-23
- **Dominio**: `https://card.ivanolivera.dev` (destino NFC: `https://card.ivanolivera.dev/?ref=nfc`)

---

## 1. Propósito y Contexto (QUÉ y POR QUÉ)

### 1.1. Qué se construye
Una tarjeta de presentación virtual ejecutiva e interactiva diseñada con prioridad absoluta para dispositivos móviles (*mobile-first*), concebida como el destino digital inmediato al acercar la tarjeta física NFC de **Iván Olivera González — Software Engineer & Systems Specialist** a un smartphone, o al escanear su código QR en eventos profesionales y reuniones técnicas.

### 1.2. Por qué se construye
- **Inmediatez en interacciones presenciales (NFC / QR)**: Cuando un interlocutor acerca su teléfono a la tarjeta física NFC, necesita identificar en menos de dos segundos quién es Iván Olivera González, cuál es su especialidad técnica real y guardar su contacto profesional en la agenda nativa del teléfono con un solo toque, sin fricción ni formularios intermedios.
- **Enfoque ejecutivo sin ruido visual**: A diferencia del portfolio web completo (`https://ivanolivera.dev`), la tarjeta virtual evita duplicar listados extensos de proyectos, líneas temporales largas o formularios pesados; en su lugar, condensa la identidad profesional en una tarjeta holográfica 3D directa, acciones de conversión inmediata y un único bloque ejecutivo de foco actual con salto directo al portfolio completo.
- **Privacidad y control de datos**: Permite compartir credenciales profesionales verificadas (correo electrónico directo, dominios web, LinkedIn, GitHub y ubicación general en Valencia) garantizando que nunca se expongan datos sensibles privados como el número de teléfono móvil o la dirección postal particular.

---

## 2. Requisitos Funcionales (Formato EARS)

### 2.1. Secuencia de Carga Inicial (`Loader`)
- **RF-001.1 `[EVENT-DRIVEN]`**: Cuando un usuario accede a la tarjeta por primera vez durante una sesión de navegación y su dispositivo no tiene activa la preferencia de reducción de movimiento, el sistema deberá mostrar una secuencia de apertura sobre fondo negro (`#000000`) con una barra de progreso de color verde esmeralda (`#10b981`) con luminiscencia y un texto con efecto de desencriptación progresiva de caracteres que transicione por los mensajes `"Initializing System..."`, `"Decrypting modules..."` y `"Access Granted."`, completándose en un tiempo aproximado de 1,4 segundos antes de revelar la tarjeta.
- **RF-001.2 `[STATE-DRIVEN]`**: Mientras la sesión de navegación actual ya haya completado la secuencia de carga inicial previamente, o mientras el dispositivo del usuario tenga activa la preferencia de accesibilidad de movimiento reducido (`prefers-reduced-motion: reduce`), el sistema deberá omitir por completo la secuencia de carga (`0 ms` de espera) para mostrar directamente el contenido principal sin demora.

### 2.2. Soporte Bilingüe (`ES` / `EN`)
- **RF-002.1 `[EVENT-DRIVEN]`**: Cuando se inicia la aplicación, el sistema deberá comprobar si existe una preferencia de idioma guardada previamente en el almacenamiento local del navegador; si no existe, deberá detectar el idioma configurado en el navegador y establecer Español (`es`) si el código de idioma comienza por `es`, o Inglés (`en`) en cualquier otro caso.
- **RF-002.2 `[EVENT-DRIVEN]`**: Cuando el usuario acciona el selector de idioma situado en la cabecera (`ES` / `EN`), el sistema deberá persistir la selección en el almacenamiento local del navegador (degradando en memoria si el almacenamiento está bloqueado) y actualizar instantáneamente todos los textos visibles de la interfaz, etiquetas de botones, bloque ejecutivo inferior, modal de código QR y atributos de accesibilidad (`aria-label`) al idioma seleccionado sin recargar la página.

### 2.3. Identidad Profesional y Tarjeta 3D Compacta (*Above the Fold*)
- **RF-003.1 `[UBIQUITOUS]`**: El sistema deberá mostrar en la tarjeta principal del primer pantallazo móvil (*above the fold*) la identidad profesional de **Iván Olivera González**, su rol principal **`Software Engineer & Systems Specialist`**, su ubicación y disponibilidad en **Valencia, España**, las 6 tecnologías principales de su stack real (**`Node.js`**, **`Python`**, **`Docker`**, **`Linux`**, **`Bash`**, **`Java`**) y el distintivo compacto de idiomas **`ES · EN · VAL (Fluent)`**.
- **RF-003.2 `[UNWANTED-BEHAVIOR]`**: Si se renderiza la tarjeta de presentación 3D principal, entonces el sistema deberá omitir párrafos de biografía extensa para preservar una jerarquía visual limpia, directa y escaneable en un vistazo.

### 2.4. Interactividad 3D de la Tarjeta (*Hero*)
- **RF-004.1 `[EVENT-DRIVEN]`**: Cuando el usuario desliza el dedo sobre la tarjeta principal en pantallas táctiles o desplaza el puntero sobre ella en escritorio, el sistema deberá aplicar una inclinación tridimensional en perspectiva suave acompañada de un reflejo especular dinámico que simule el acabado físico de una tarjeta ejecutiva de alta gama, retornando suavemente a su posición de reposo al finalizar la interacción.
- **RF-004.2 `[STATE-DRIVEN]`**: Mientras el dispositivo del usuario tenga activa la preferencia de movimiento reducido (`prefers-reduced-motion: reduce`), el sistema deberá mantener la tarjeta de presentación estable sin aplicar rotaciones tridimensionales ni desplazamientos bruscos.

### 2.5. Conversión Primaria en 1 Toque (Descarga de Contacto vCard `.vcf`)
- **RF-005.1 `[EVENT-DRIVEN]`**: Cuando el usuario pulsa el botón de acción primaria **"Guardar Contacto"** (en español) o **"Save Contact"** (en inglés) ubicado en el primer pantallazo, el sistema deberá generar y descargar inmediatamente un archivo con nombre `ivan-olivera.vcf` (especificación estándar vCard 3.0) compatible con la agenda nativa de iOS y Android que contenga exactamente los siguientes datos autorizados:
  - Nombre completo: `Iván Olivera González`
  - Cargo / Rol: `Software Engineer & Systems Specialist`
  - Correo electrónico: `ivanoliveradev@gmail.com`
  - Sitio web principal (Portfolio): `https://ivanolivera.dev`
  - Sitio web de la tarjeta: `https://card.ivanolivera.dev`
  - Perfil de LinkedIn: `https://www.linkedin.com/in/ivan-olivera-gonzalez/`
  - Perfil de GitHub: `https://github.com/Ivan-olivera-dev`
  - Ubicación general: `Valencia, España` (expresada únicamente como localidad y país en `ADR;TYPE=WORK:;;;Valencia;;España` o `NOTE`, dejando vacíos los subcampos de calle, número y código postal)
- **RF-005.2 `[UNWANTED-BEHAVIOR]`**: Si se genera el archivo `.vcf` o se renderiza cualquier vista de datos de contacto en la interfaz, entonces el sistema deberá omitir en todo momento cualquier número de teléfono móvil (`TEL`) o dirección postal privada (calle, portal o código postal).

### 2.6. Acciones Rápidas Secundarias (*Above the Fold*)
- **RF-006.1 `[UBIQUITOUS]`**: El sistema deberá presentar bajo el botón primario una fila o cuadrícula de 4 acciones secundarias de acceso inmediato:
  1. **LinkedIn** (`https://www.linkedin.com/in/ivan-olivera-gonzalez/`)
  2. **GitHub** (`https://github.com/Ivan-olivera-dev`)
  3. **Email directo** (`mailto:ivanoliveradev@gmail.com`)
  4. **Código QR** (apertura de la vista superpuesta de código QR y compartir)
- **RF-006.2 `[UNWANTED-BEHAVIOR]`**: Si el usuario desea contactar por correo electrónico desde la tarjeta, entonces el sistema deberá invocar directamente el cliente de correo nativo mediante `mailto:ivanoliveradev@gmail.com` sin mostrar modales con formularios de contacto intermedios.

### 2.7. Vista de Código QR y Compartir en Persona
- **RF-007.1 `[EVENT-DRIVEN]`**: Cuando el usuario activa la acción de **Código QR**, el sistema deberá desplegar una vista superpuesta (modal) que bloquee el desplazamiento vertical del fondo y muestre un código QR vectorial de alto contraste codificado con la URL `https://card.ivanolivera.dev/?ref=nfc`, junto con el enlace visible y seleccionable y opciones para copiar el enlace al portapapeles o compartirlo mediante el diálogo nativo del sistema operativo.
- **RF-007.2 `[EVENT-DRIVEN]`**: Cuando el usuario pulsa el botón de copiar enlace dentro de la vista de Código QR, el sistema deberá copiar `https://card.ivanolivera.dev/?ref=nfc` al portapapeles y mostrar una confirmación visual temporal en el propio botón.
- **RF-007.3 `[UNWANTED-BEHAVIOR]`**: Si el navegador del dispositivo no soporta el diálogo nativo de compartir del sistema operativo, entonces el sistema deberá degradar la acción de compartir copiando directamente la URL `https://card.ivanolivera.dev/?ref=nfc` al portapapeles y notificando visualmente al usuario; si el usuario cancela manualmente el diálogo nativo de compartir (`AbortError`), el sistema deberá ignorar la cancelación silenciosamente sin mostrar errores ni sobrescribir el portapapeles; y si la escritura en el portapapeles tampoco está permitida por el navegador, el sistema deberá mantener visible y seleccionable el texto de la URL sin lanzar errores no controlados.
- **RF-007.4 `[EVENT-DRIVEN]`**: Cuando el usuario presiona la tecla `Escape`, pulsa el botón de cerrar o hace clic sobre el fondo oscurecido exterior de la vista de Código QR, el sistema deberá cerrar el modal inmediatamente, restaurar el desplazamiento normal de la página y devolver el foco de forma accesible.

### 2.8. Resumen Ejecutivo Inferior y Enlace al Portfolio Completo
- **RF-008.1 `[UBIQUITOUS]`**: El sistema deberá mostrar debajo de las acciones rápidas una única tarjeta ejecutiva de resumen que presente el foco profesional actual de Iván Olivera González en **Yuvod** (integraciones sobre plataforma existente, automatización de procesos e infraestructura) junto con un botón destacado de llamada a la acción hacia `https://ivanolivera.dev` con el texto **"Explorar Portfolio Completo (ivanolivera.dev)"** en español y **"Explore Full Portfolio (ivanolivera.dev)"** en inglés, acompañado de un icono vectorial de apertura externa.
- **RF-008.2 `[UNWANTED-BEHAVIOR]`**: Si se renderiza la vista principal de la tarjeta, entonces el sistema deberá omitir secciones extensas de grillas de competencias, galerías de proyectos, líneas temporales de formación/certificaciones y barras flotantes inferiores, delegando toda esa profundidad documental al portfolio principal (`https://ivanolivera.dev`).

### 2.9. Analítica Respetuosa con la Privacidad y Detección de Escaneo NFC
- **RF-009.1 `[EVENT-DRIVEN]`**: Cuando la página se carga con el parámetro de consulta `?ref=nfc` o `?source=nfc` en la dirección web, el sistema deberá identificar la visita como procedente de un escaneo de tarjeta NFC física y emitir el evento analítico `nfc_scan` una única vez por sesión de navegación (evitando emisiones duplicadas en recargas dentro de la misma sesión).
- **RF-009.2 `[EVENT-DRIVEN]`**: Cuando el usuario realiza una acción clave de conversión, el sistema deberá emitir el evento analítico correspondiente de forma desacoplada y sin emplear cookies de rastreo:
  - Descarga del archivo de contacto `.vcf`: `vcard_download`
  - Clic en enlaces profesionales o de contacto directo (LinkedIn, GitHub, Email directo `mailto:`, Portfolio completo): `social_click`
  - Apertura de la vista de Código QR / Compartir: `qr_open`
- **RF-009.3 `[UNWANTED-BEHAVIOR]`**: Si el servicio de analítica no está configurado en el entorno o es bloqueado por extensiones de privacidad del navegador, entonces el sistema deberá ignorar el fallo de telemetría de forma silenciosa y continuar ejecutando todas las funciones de la tarjeta sin errores visibles ni interrupciones.

### 2.10. Identidad Visual, Accesibilidad y Restricción de Cero Emojis
- **RF-010.1 `[UBIQUITOUS]`**: El sistema deberá aplicar una estética oscura ejecutiva sobre fondo negro (`#000000`) con patrón de rejilla sutil y máscara radial superior, tarjetas translúcidas oscuras (`#0a0a0a`) con bordes sutiles y acento principal en verde esmeralda (`#10b981`).
- **RF-010.2 `[UNWANTED-BEHAVIOR]`**: Si se renderiza cualquier texto, etiqueta, botón, mensaje de estado, metadato o archivo `.vcf` descargable, entonces el sistema deberá garantizar la ausencia absoluta de caracteres emoji o pictográficos Unicode, utilizando exclusivamente iconografía vectorial limpia en la interfaz.
- **RF-010.3 `[UBIQUITOUS]`**: El sistema deberá adaptar su disposición visual sin ningún desbordamiento horizontal (`overflow-x`) en pantallas móviles desde `360px` de ancho en adelante, garantizando un área interactiva mínima de `44x44px` en todos los botones y controles táctiles, y proporcionando etiquetas descriptivas (`aria-label`) traducidas en todos los controles interactivos.

### 2.11. Metadatos de Previsualización y Distribución Multi-Entorno
- **RF-011.1 `[UBIQUITOUS]`**: El sistema deberá incluir metadatos descriptivos de página, título profesional coherente con `Software Engineer & Systems Specialist`, propiedades de previsualización para compartir en redes y mensajería (OpenGraph) y declaración de aplicación web móvil (manifest) bajo el dominio `https://card.ivanolivera.dev`.
- **RF-011.2 `[UBIQUITOUS]`**: El sistema deberá estar preparado para distribuirse y operar de forma idéntica tanto en una red de distribución de contenido estático en el borde (Edge CDN) bajo `card.ivanolivera.dev` como en un entorno de servidor de contenedores autohospedado, sirviendo correctamente los tipos de contenido estáticos y las descargas de contacto `.vcf`.

---

## 3. Criterios de Aceptación Medibles

1. **CA-01 (Cobertura de Identidad y Privacidad en vCard — RF-003, RF-005)**: Al descargar el archivo `ivan-olivera.vcf` desde el botón primario, el contenido incluye `FN:Iván Olivera González`, `TITLE:Software Engineer & Systems Specialist`, `EMAIL:ivanoliveradev@gmail.com`, `URL` de portfolio y tarjeta, perfiles de LinkedIn/GitHub y ubicación general `Valencia, España` (`ADR;TYPE=WORK:;;;Valencia;;España` sin calle ni código postal), y contiene **cero** campos `TEL` o direcciones privadas detalladas.
2. **CA-02 (Bilingüismo Instantáneo y Persistente — RF-002)**: Al alternar entre `ES` y `EN` en la cabecera, la preferencia se guarda en el almacenamiento local del navegador y el 100% de las vistas activas (cabecera, tarjeta 3D, botones de acción rápida, resumen ejecutivo inferior y modal de código QR) cambian de idioma inmediatamente sin recarga de navegador.
3. **CA-03 (Secuencia de Carga y Accesibilidad de Movimiento — RF-001, RF-004)**: En la primera visita estándar se muestra el `Loader` con los 3 textos progresivos (`"Initializing System..."`, `"Decrypting modules..."`, `"Access Granted."`) durante ~1,4 segundos; en una segunda carga dentro de la misma sesión o con `prefers-reduced-motion: reduce` activo, el `Loader` se omite inmediatamente (`0 ms`) mostrando directamente el contenido principal, y la tarjeta 3D desactiva las inclinaciones bruscas.
4. **CA-04 (Ausencia Total de Emojis — RF-010.2)**: Una inspección automatizada sobre todos los textos en español e inglés, el árbol renderizado de la interfaz y el contenido del archivo `.vcf` devuelve **0 coincidencias** de caracteres emoji o pictográficos Unicode.
5. **CA-05 (Tarjeta 3D Directa y Resumen Ejecutivo Único — RF-003, RF-006, RF-008)**:
   - La tarjeta 3D muestra el rol `Software Engineer & Systems Specialist`, las 6 tecnologías (`Node.js`, `Python`, `Docker`, `Linux`, `Bash`, `Java`) y el badge `ES · EN · VAL (Fluent)`, sin párrafos de biografía extensa.
   - Las acciones rápidas muestran el botón primario de guardar contacto (`.vcf`) y los 4 botones secundarios: LinkedIn, GitHub, Email directo (`mailto:ivanoliveradev@gmail.com`) y QR (sin modal de formulario de contacto).
   - La sección inferior consta únicamente del bloque ejecutivo con foco actual en Yuvod (integraciones, automatización e infraestructura) y el botón hacia `https://ivanolivera.dev` (`"Explorar Portfolio Completo (ivanolivera.dev)"` / `"Explore Full Portfolio (ivanolivera.dev)"`).
6. **CA-06 (Resiliencia en Analítica y Modal QR — RF-007, RF-009)**:
   - Al entrar con `?ref=nfc` (o `?source=nfc`), se registra el evento `nfc_scan` una única vez por sesión de navegación.
   - El modal QR muestra el código vectorial para `https://card.ivanolivera.dev/?ref=nfc`, permite copiar/compartir con degradación elegante y se cierra con `Escape` o clic en el fondo.
7. **CA-07 (Diseño Mobile-First y Accesibilidad — RF-010.3)**: En un ancho de ventana de `360px`, ningún contenedor provoca desplazamiento horizontal involuntario y todos los botones y enlaces de acción tienen dimensiones táctiles de al menos `44x44px` y atributos `aria-label` válidos.

---

## 4. Casos Límite y Condiciones de Contorno

1. **Escaneo NFC con bloqueadores de contenido o modo privado estricto**:
   - Si el navegador móvil bloquea el almacenamiento local o de sesión (`localStorage` / `sessionStorage` lanzan excepción por políticas de privacidad estrictas) o bloquea scripts de analítica externa, la aplicación no debe fallar en blanco: debe capturar la excepción silenciosamente, mantener el estado en memoria y renderizar la tarjeta funcional.
2. **Navegadores con idiomas regionales o no contemplados (`ca-ES`, `es-MX`, `fr-FR`, `de-DE`)**:
   - Si el navegador reporta una variante regional de español (ej. `es-ES`, `es-AR`), debe seleccionarse `es`. Si reporta cualquier otro idioma (`ca-ES`, `fr-FR`, `en-US`, etc.), debe seleccionarse `en` como idioma de respaldo universal sin errores de clave inexistente.
3. **Dispositivos sin soporte para Web Share API, cancelación de usuario (`AbortError`) o portapapeles bloqueado**:
   - Cuando el usuario intenta compartir la tarjeta desde un entorno que no implementa `navigator.share`, la acción debe copiar automáticamente `https://card.ivanolivera.dev/?ref=nfc` al portapapeles y mostrar confirmación visual.
   - Si el usuario abre el diálogo nativo de compartir y lo cancela manualmente (`AbortError`), el sistema debe ignorar la cancelación sin mostrar error ni sobrescribir el portapapeles.
   - Si tanto `navigator.share` como la escritura en portapapeles fallan o están bloqueados por permisos del WebView, el enlace `https://card.ivanolivera.dev/?ref=nfc` permanece visible y seleccionable manualmente en el modal sin lanzar excepciones no controladas.
4. **Cierre accesible del Modal QR y restauración de foco/scroll**:
   - Al abrirse el modal de Código QR se bloquea el desplazamiento vertical del documento (`overflow: hidden`) y al cerrarse mediante `Escape`, botón de cierre o clic en el fondo exterior se restaura el desplazamiento del documento y el foco accesible.
5. **Caracteres especiales y acentos en la descarga `.vcf` en iOS Safari y Android Chrome**:
   - El nombre `Iván Olivera González` y la ubicación `Valencia, España` contienen caracteres acentuados y la letra `ñ`. El archivo `ivan-olivera.vcf` generado debe codificarse en UTF-8 con saltos de línea estándar (`CRLF` `\r\n`) para evitar caracteres corruptos al importarse tanto en Contactos de iOS como en Contactos de Google en Android.
6. **Iconografía vectorial frente a caracteres Unicode pictográficos**:
   - Los indicadores de enlace externo (como la flecha noreste del botón de explorar el portfolio completo) deben implementarse mediante iconos vectoriales SVG y nunca mediante caracteres Unicode como `↗` (`U+2197`), ya que el estándar Unicode clasifica `U+2197` como `Extended_Pictographic` y violaría la restricción estricta de cero emojis.
