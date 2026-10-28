# Constitución del Proyecto: TarjetaVisita (`card.ivanolivera.dev`)

## 1. Visión del Producto y Dominio
`TarjetaVisita` es la tarjeta de presentación virtual e interactiva de **Iván Olivera González — Software Engineer & Systems Specialist**, diseñada específicamente como destino mobile-first de sus tarjetas físicas NFC (`https://card.ivanolivera.dev/?ref=nfc`).

### Reglas de Negocio del Dominio
1. **Experiencia Mobile-First para NFC**: El 90%+ del tráfico proviene de escaneos NFC desde smartphones (iOS Safari y Android Chrome). El primer pantallazo (*above the fold*) debe mostrar la identidad profesional, la tarjeta 3D interactiva y las acciones de contacto inmediato sin necesidad de hacer scroll.
2. **Conversión en 1 toque (vCard `.vcf`)**: El botón primario debe generar/descargar un archivo estándar `.vcf` (vCard 3.0) válido en iOS y Android con los datos profesionales autorizados de Iván Olivera González.
3. **Privacidad de Datos Personales**:
   - Datos autorizados en UI y vCard:
     - Nombre completo: `Iván Olivera González`
     - Rol principal: `Software Engineer & Systems Specialist`
     - Email: `ivanoliveradev@gmail.com`
     - Web principal (Portfolio): `https://ivanolivera.dev`
     - Tarjeta virtual: `https://card.ivanolivera.dev`
     - LinkedIn: `https://www.linkedin.com/in/ivan-olivera-gonzalez/`
     - GitHub: `https://github.com/Ivan-olivera-dev`
     - Ubicación: `Valencia, España`
   - **Nunca** exponer número de teléfono móvil ni dirección postal privada en la UI ni en el archivo `.vcf`.
4. **Coherencia con el repositorio `Ivan-olivera-dev/Portfolio`**:
   - Mantener la misma identidad cromática, tipográfica y el componente `Loader` con barra de progreso `emerald-500` y efecto `EncryptedText`, optimizado a **~1.4 segundos** en la primera carga de sesión (`sessionStorage`) para no penalizar la inmediatez del escaneo NFC.
5. **Soporte Bilingüe (`es` / `en`)**:
   - Detección automática inicial según `navigator.language` (`es` si comienza por `es`, `en` por defecto en el resto) con selector persistente en cabecera.
6. **Analítica Privacy-First**:
   - Detección del parámetro `?ref=nfc` y registro desacoplado de eventos (`nfc_scan`, `vcard_download`, `social_click`, `project_click`, `contact_submit`, `qr_open`) compatible con Umami/Plausible sin cookies ni banners intrusivos.

---

## 2. Identidad Visual y Sistema de Diseño
- **Estética**: Minimalismo ejecutivo, formal, oscuro, técnico y digital-moderno.
- **Paleta de Colores**:
  - Fondo principal: `#000000` (`bg-black`) con patrón de rejilla sutil (`linear-gradient` `#4f4f4f2e` `14px x 24px`) y máscara radial superior.
  - Superficies y tarjetas: `#0a0a0a` / `bg-neutral-900/60` con `backdrop-blur-md` y bordes `border-white/10` (hover `border-emerald-500/40`).
  - Acento primario: Emerald (`#10b981` / `emerald-500`, texto `emerald-400`, glow `shadow-[0_0_15px_rgba(16,185,129,0.4)]`).
  - Acentos secundarios (solo en línea temporal de educación/certificaciones, en coherencia con el Portfolio): `blue-500` (educación) y `purple-500` (certificaciones).
  - Texto: primario `#ffffff` (`text-white`), secundario `#a3a3a3` (`text-neutral-400`), técnico/metadatos `#737373` (`text-neutral-500`).
- **Tipografía**:
  - Sans-serif principal: `Inter`, `-apple-system`, `sans-serif`.
  - Monospace (etiquetas de arquitectura, loader, `EncryptedText`, metadatos): `JetBrains Mono` / `ui-monospace`, `monospace`.
- **Interactividad 3D y Microinteracciones**:
  - Tarjeta 3D interactiva en el Hero construida con CSS 3D Perspective + `framer-motion` (`useMotionValue`, `useSpring`, `useTransform`), respondiendo a gestos táctiles (`pointermove` / `touchmove`), orientación del dispositivo (opcional/suave) y puntero en desktop, con reflejo especular dinámico.
  - Respeto obligatorio a `prefers-reduced-motion: reduce`: si está activo, las animaciones 3D y el loader se simplifican sin movimiento brusco.
- **Skills de Diseño de Referencia**:
  - Durante la planificación e implementación de UI, aplicar los criterios de las skills `design-taste-frontend`, `ui-styling` y `ui-ux-pro-max`.

---

## 3. Árbol de Directorios del Proyecto
```text
TarjetaVisita/
├── .opencode/
│   └── agents/                 # Definición de los 4 agentes SDD
├── docs/
│   └── constitution.md         # Principios arquitectónicos y reglas del proyecto
├── specs/                      # Especificaciones SDD (NNN-nombre/spec.md, plan.md, tasks.md)
├── public/
│   ├── _headers                # Cabeceras para Cloudflare Pages (caché y MIME types)
│   └── manifest.webmanifest    # Metadatos PWA mobile-first
├── src/
│   ├── assets/                 # Activos gráficos (.webp, logo-io.svg)
│   ├── components/
│   │   ├── ui/                 # Primitivas UI (encrypted-text, 3d-card, border-beam, shimmer-button, spotlight, error-page, qr-sheet)
│   │   └── sections/           # Bloques ejecutivos (Header, HeroCard3D, QuickActions, ExecutiveSnapshot, Loader)
│   ├── data/
│   │   └── profile.ts          # Datos tipados de Iván Olivera e internacionalización (ES/EN)
│   ├── hooks/                  # Hooks personalizados (useLanguage, useReducedMotion, useTilt3D)
│   ├── lib/
│   │   ├── analytics.ts        # Cliente de telemetría privacy-first y detector ?ref=nfc
│   │   ├── utils.ts            # Helper cn() (clsx + tailwind-merge) y detector containsEmoji()
│   │   └── vcard.ts            # Generador puro y descargador de archivo ivan-olivera.vcf (vCard 3.0)
│   ├── test/                   # Configuración de Vitest (setup.ts)
│   ├── App.tsx                 # Orquestador principal de la tarjeta de visita
│   ├── index.css               # Directivas Tailwind y variables CSS
│   └── main.tsx                # Punto de entrada React 19
├── Dockerfile                  # Build multi-etapa (node:20-alpine -> nginx:alpine)
├── docker-compose.yml          # Servicio io_card para despliegue en contenedor
├── nginx.conf                  # Configuración Nginx con gzip, caché y soporte .vcf
├── index.html                  # HTML base con meta tags mobile, OpenGraph y fuentes
├── opencode.jsonc              # Configuración de agente por defecto y modelo base
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Convenciones de Nombres
- **Componentes React**: `PascalCase` en archivos `.tsx` para secciones (`HeroCard3D.tsx`, `QuickActions.tsx`) y `kebab-case.tsx` en `src/components/ui/` para mantener simetría con el repositorio `Portfolio` (`encrypted-text.tsx`, `3d-card.tsx`, `contact-modal.tsx`).
- **Funciones y utilidades**: `camelCase` (`generateVCardString`, `trackEvent`, `detectInitialLanguage`).
- **Tipos e Interfaces TypeScript**: `PascalCase` sin prefijo `I` (`ProfileData`, `Language`, `ProjectHighlight`, `AnalyticsEvent`).
- **Constantes globales**: `UPPER_SNAKE_CASE` (`LOADER_DURATION_MS`, `DEFAULT_LANGUAGE`).
- **Tests**: ubicados junto al módulo o en `src/**/__tests__/*.test.ts(x)` con sufijo `.test.ts` o `.test.tsx`.

---

## 5. Reglas de Código
1. **TypeScript Estricto**: Prohibido el uso de `any`. Todo componente, prop, diccionario de traducción y payload de evento debe estar explícitamente tipado.
2. **Funciones Puras en `src/lib/`**: La generación del contenido `.vcf` (`generateVCardString`), la resolución de traducciones y el parseo de parámetros URL (`?ref=nfc`) deben ser funciones puras 100% testables sin depender del DOM.
3. **Accesibilidad (WCAG 2.1 AA)**:
   - Todos los botones de solo icono deben incluir `aria-label` traducido al idioma activo.
   - Los objetivos táctiles en móvil deben tener un área mínima de `44x44px`.
   - Los modales (Contacto y QR) deben cerrarse con tecla `Escape`, clic en el backdrop y bloquear el scroll de fondo.
4. **Manejo de Errores**: El envío del formulario de contacto (FormSubmit) y la telemetría nunca deben romper la interfaz si fallan por red o bloqueadores de anuncios; deben degradarse de forma elegante.

---

## 6. Estrategia de Testing y Comandos
- **Runner**: Vitest + React Testing Library + `@testing-library/jest-dom` sobre entorno `jsdom`.
- **Comando de ejecución de tests**: `npm test` (ejecuta `vitest run`).
- **Comando de build y verificación de tipos**: `npm run build` (ejecuta `tsc -b && vite build`).
- **Cobertura mínima exigida en cada tarea**:
  - Tests unitarios para toda lógica pura (`vcard.ts`, `analytics.ts`, `profile.ts`).
  - Tests de integración de componentes para verificar renderizado bilingüe (`ES`/`EN`), acciones de descarga/contacto, ausencia total de emojis y atributos de accesibilidad.

---

## 7. Formato de Commits en Git
Se utiliza **Conventional Commits en inglés**:
- `feat: add interactive 3d business card hero component`
- `fix: adjust vcard mime type for ios safari compatibility`
- `docs: initialize sdd constitution and agent definitions`
- `test: add unit tests for vcard generator and nfc ref tracking`

---

## 8. Lista de Restricciones Estrictas (Qué NO hacer y qué mantener siempre)
- **PROHIBIDO usar emojis** en cualquier parte de la interfaz de usuario, textos de traducción, placeholders, comentarios visibles o metadatos. Usar exclusivamente iconos vectoriales (`lucide-react` o `react-icons/si`).
- **PROHIBIDO usar CSS anticuado o plantillas genéricas**: nada de sombras grises pesadas sobre fondo claro, gradientes estridentes tipo neón multipaleta ni bordes gruesos sin refinamiento.
- **PROHIBIDO incluir librerías 3D pesadas** (como Three.js / `@react-three/fiber`) que penalicen el tiempo de carga en redes móviles al escanear la tarjeta NFC.
- **PROHIBIDO romper el layout en pantallas pequeñas (`360px` a `430px`)**: nunca debe existir `overflow-x` involuntario en móvil.
- **MANTENER SIEMPRE** la coherencia visual y de datos con `Ivan-olivera-dev/Portfolio` y la velocidad de carga ultrarrápida.
