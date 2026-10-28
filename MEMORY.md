# MEMORY.md — Bitácora del Proyecto `TarjetaVisita`

## Estado Actual
- **Fase actual**: Fase 4 completada para `SPEC-001` (`001-mvp` implementada con tareas T1 a T8 en verde; lista para Fase 5 — Revisión Final)
- **Fecha de última actualización**: 2026-10-22
- **Dominio objetivo**: `https://card.ivanolivera.dev` (URL para chip NFC: `https://card.ivanolivera.dev/?ref=nfc`)

---

## Decisiones Tomadas en la Entrevista de Diseño

### 1. Producto y Contenido
- **Identidad profesional**: Iván Olivera González — *Software Architect & Systems Engineer*.
- **Propósito**: Tarjeta de visita virtual mobile-first enlazada desde tarjetas físicas NFC, manteniendo coherencia visual y de contenido con el repositorio de referencia `Ivan-olivera-dev/Portfolio`.
- **Acciones rápidas (*above the fold*)**:
  1. Descarga directa de contacto en formato **vCard 3.0 (`.vcf`)** compatible con iOS y Android.
  2. Enlaces directos a **LinkedIn** (`linkedin.com/in/ivan-olivera-gonzalez`), **GitHub** (`github.com/Ivan-olivera-dev`) y **Portfolio completo** (`https://ivanolivera.dev`).
  3. Botón/Modal de **Contacto directo** integrado con FormSubmit (`ivanoliveradev@gmail.com`).
  4. Vista rápida de **Código QR / Compartir** para mostrar la tarjeta en persona cuando el interlocutor no tenga NFC activo.
- **Privacidad**: No se expone número de teléfono móvil públicamente ni en el archivo `.vcf`.
- **Idiomas**: Interfaz bilingüe **ES / EN** con detección automática del idioma del navegador (`navigator.language`) y selector manual en cabecera. Commits en inglés (Conventional Commits) y documentación SDD en español.

### 2. Identidad Visual y Experiencia de Usuario
- **Estética**: Minimalista, formal, oscura y digital-moderna. **Cero emojis** en toda la aplicación (solo iconos vectoriales `lucide-react` y `react-icons/si`).
- **Paleta y Tipografía**: Fondo `#000000` con rejilla sutil y máscara radial, tarjetas `#0a0a0a` con bordes `white/10`, acento `emerald-500` (`#10b981`) con glow esmeralda, tipografía `Inter` + `Monospace`.
- **Loader**: Reutilización del `Loader` del Portfolio (barra de progreso esmeralda + `EncryptedText`), optimizado a **~1.4s** en la primera visita de la sesión para respuesta rápida en escaneos NFC.
- **Elemento 3D**: Tarjeta de presentación 3D interactiva en el Hero acelerada por GPU (CSS 3D + Framer Motion) con respuesta táctil en móvil y puntero en desktop, respetando `prefers-reduced-motion`.
- **Skills de apoyo**: Uso de `design-taste-frontend`, `ui-styling` y `ui-ux-pro-max`.

### 3. Stack Técnico, Analítica y Despliegue
- **Stack**: React 19 + TypeScript estricto + Vite + Tailwind CSS + Framer Motion + Lucide React + `react-icons` + `clsx` + `tailwind-merge`.
- **Testing**: Vitest + React Testing Library + `jsdom` (`npm test` -> `vitest run`).
- **Analítica**: Módulo `src/lib/analytics.ts` privacy-first (compatible con Umami/Plausible mediante variables de entorno) y detección de `?ref=nfc`.
- **Despliegue Híbrido**: Preparado tanto para **Cloudflare Pages** (`card.ivanolivera.dev` con `public/_headers`) como para contenedor **Docker** (`Dockerfile` multi-stage `node:20-alpine` -> `nginx:alpine`, `nginx.conf` y `docker-compose.yml`).

### 4. Modelos Asignados a los Agentes SDD
- **Modelo base (`opencode.jsonc`)**: `google/gemini-4-argon`
- **`coordinator`**: `google/gemini-4-argon#high`
- **`planner`**: `google/gemini-4-argon#high`
- **`implementer`**: `google/gemini-4-argon#high`
- **`reviewer`**: `google/gemini-4-argon#high`

---

## Registro de Progreso

### Fase 1: Inicialización SDD
- [x] Entrevista de diseño completada (Rondas 1, 2 y 3).
- [x] Creación de `docs/constitution.md`.
- [x] Creación de `AGENTS.md`.
- [x] Creación de `MEMORY.md`.
- [x] Creación de `opencode.jsonc`.
- [x] Creación de `.opencode/agents/coordinator.md`, `planner.md`, `implementer.md` y `reviewer.md`.
- [x] Creación del directorio `specs/`.

### Especificación `001-mvp` (Tarjeta de Visita Ejecutiva Minimalista y Auténtica)
- [x] Rediseño hacia tarjeta ejecutiva ultra-limpia aprobado tras entrevista grill-me.
- [x] **T1**: Scaffolding React 19 + TS estricto + Vite + Tailwind CSS + Vitest (`jsdom`), activos de Portfolio y utilidades (`cn`, `containsEmoji`).
- [x] **T2**: Secuencia de apertura `Loader` (~1.4s con `EncryptedText` y barra `emerald-500`), omitida en `0 ms` en visitas posteriores o con `prefers-reduced-motion: reduce`.
- [x] **T3**: Perfil auténtico actualizado con rol `Software Engineer & Systems Specialist`, stack real de 6 tecnologías (`Node.js`, `Python`, `Docker`, `Linux`, `Bash`, `Java`), badge de idiomas `ES · EN · VAL (Fluent)` y vCard `ivan-olivera.vcf`.
- [x] **T4**: Rediseño de `HeroCard3D` (cero biografía extensa, amplio espacio en blanco y elegancia visual) y `QuickActions` (enlace directo `mailto:ivanoliveradev@gmail.com`, LinkedIn, GitHub y QR, eliminando el modal de formulario).
- [x] **T5**: 
  - Arquitectura **Full-Screen Scroll Snap** (`scroll-snap-type: y mandatory`, `h-[100dvh] snap-start snap-always`):
    - **Pantalla 1**: Tarjeta de visita virtual 100% visible sin scroll (*above the fold*), con Header, Tarjeta 3D interactiva con perspectiva limpia, Spotlight interactivo, BorderBeam vectorial SVG cross-browser y QuickActions con **Shimmer Button**.
    - **Pantalla 2**: Sección dinámica 3D (`DynamicScrollSection`) centrada con tarjeta de trayectoria y logros en Yuvod, HP CodeWars, DAW/SMR y AWS/Cisco que rota en los ejes X/Y en 3D y escala suavemente en el viewport (`whileInView` + `useScroll`), con halo esmeralda difuso y enlace a `ivanolivera.dev`.
  - Configuración de `components.json` con los registros oficiales `@kokonutui` y `@watermelon`.
  - Corrección de visibilidad en el scroll (eliminado bloqueo de opacidad a 0) y resolución de bugs visuales de Safari en BorderBeam y la tarjeta 3D.
  - Suite de tests 100% en verde (10 archivos / 60 tests) y compilación TypeScript limpia.

---

## Comandos Habituales

```bash
# Instalación de dependencias
npm install

# Servidor de desarrollo local
npm run dev

# Ejecución de tests (Vitest en modo no interactivo)
npm test

# Compilación de producción y chequeo estricto de TypeScript
npm run build

# Previsualización local del build de producción
npm run preview

# Construcción y ejecución con Docker
docker compose up -d --build
```
