# Plan Técnico de Implementación: MVP `TarjetaVisita` (`001-mvp`)

- **ID de Especificación**: `001-mvp`
- **Estado de la Spec**: aprobado
- **Fecha**: 2026-10-23
- **Dominio objetivo**: `https://card.ivanolivera.dev` (`https://card.ivanolivera.dev/?ref=nfc`)

---

## 1. Resumen Arquitectónico

`TarjetaVisita` se implementa como una Single Page Application (SPA) estática ultrarrápida y *mobile-first* sobre **React 19 + TypeScript estricto + Vite + Tailwind CSS + Framer Motion**, con batería de pruebas automatizadas en **Vitest + React Testing Library (`jsdom`)**.

La arquitectura se divide en cuatro capas limpias y enfocadas en conversión inmediata por NFC/QR:
1. **Capa de Dominio y Funciones Puras (`src/lib/` y `src/data/`)**:
   - Datos autorizados de **Iván Olivera González — `Software Engineer & Systems Specialist`** (`src/data/profile.ts`), stack real de 6 tecnologías (`Node.js`, `Python`, `Docker`, `Linux`, `Bash`, `Java`), badge compacto de idiomas (`ES · EN · VAL (Fluent)`), foco ejecutivo actual en `Yuvod` y textos bilingües (`ES`/`EN`) con validación de cero emojis.
   - Generador determinista de `ivan-olivera.vcf` (vCard 3.0) en `src/lib/vcard.ts`.
   - Cliente de telemetría privacy-first y detector `?ref=nfc` deduplicado por sesión en `src/lib/analytics.ts`.
2. **Capa de Estado e Interacción (`src/hooks/`)**: Hooks reactivos con degradación segura ante bloqueos de almacenamiento o preferencias de movimiento reducido (`useLanguage`, `useReducedMotion`, `useTilt3D`).
3. **Capa de Presentación (`src/components/ui/` y `src/components/sections/`)**:
   - Primitivas visuales (`encrypted-text.tsx`, `3d-card.tsx`, `qr-sheet.tsx`). Se prescinde de `contact-modal.tsx` al utilizar contacto directo por `mailto:ivanoliveradev@gmail.com`.
   - Secciones enfocadas (`Loader.tsx`, `Header.tsx`, `HeroCard3D.tsx`, `QuickActions.tsx` y la única sección ejecutiva inferior `ExecutiveSnapshot.tsx`). Se eliminan las secciones extensas `StackBento.tsx`, `Highlights.tsx`, `ExperienceCompact.tsx` y `FooterDock.tsx`.
4. **Capa de Entrega Híbrida (`public/`, `Dockerfile`, `nginx.conf`, `docker-compose.yml`)**: Preparada simultáneamente para Cloudflare Pages (Edge CDN con `public/_headers`) y contenedor Docker (`node:20-alpine` -> `nginx:alpine`).

---

## 2. Mapa de Archivos a Crear / Modificar / Eliminar

| Ruta del Archivo | Acción | Propósito Principal | RF / CA Cubiertos |
| :--- | :--- | :--- | :--- |
| `package.json` | Mantener | Dependencias (`react`, `react-dom`, `framer-motion`, `lucide-react`, `react-icons`, `clsx`, `tailwind-merge`, `qrcode`) y scripts (`dev`, `build`, `test`, `preview`) | `RF-011.2` |
| `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js` | Mantener | Configuración estricta de TypeScript, Vite, Tailwind oscuro ejecutivo y Vitest (`jsdom`) | `RF-010.1`, `RF-011.2` |
| `index.html`, `public/manifest.webmanifest` | Modificar | Actualizar metadatos y títulos al rol `Software Engineer & Systems Specialist` | `RF-003.1`, `RF-011.1` |
| `public/_headers`, `Dockerfile`, `nginx.conf`, `docker-compose.yml` | Mantener | Infraestructura híbrida Cloudflare Pages + Docker con soporte `.vcf` | `RF-005.1`, `RF-011.2` |
| `src/lib/utils.ts` | Mantener | Helper `cn()` y validador puro `containsEmoji(text: string): boolean` | `RF-010.2`, `CA-04` |
| `src/data/profile.ts` | Modificar | Rol `Software Engineer & Systems Specialist`, stack `['Node.js', 'Python', 'Docker', 'Linux', 'Bash', 'Java']`, badge `ES · EN · VAL (Fluent)`, foco actual en `Yuvod` y textos de `ExecutiveSnapshot` | `RF-002`, `RF-003`, `RF-005`, `RF-006`, `RF-008`, `CA-01`, `CA-02`, `CA-04`, `CA-05` |
| `src/lib/vcard.ts` | Mantener | Generador puro `generateVCardString(profile)` y descargador `downloadVCard(profile)` con el nuevo rol | `RF-005.1`, `RF-005.2`, `CA-01` |
| `src/lib/analytics.ts` | Modificar | Detección de `?ref=nfc` / `?source=nfc` deduplicada por sesión y emisor `trackEvent()` (`nfc_scan`, `vcard_download`, `social_click`, `qr_open`) | `RF-009.1` a `RF-009.3`, `CA-06` |
| `src/hooks/useReducedMotion.ts`, `src/hooks/useLanguage.ts`, `src/hooks/useTilt3D.ts` | Mantener | Hooks de accesibilidad de movimiento, idioma persistente y perspectiva 3D | `RF-001.2`, `RF-002`, `RF-004`, `CA-02`, `CA-03` |
| `src/components/ui/encrypted-text.tsx`, `src/components/sections/Loader.tsx` | Mantener | Secuencia de apertura ~1.4s con `EncryptedText` y barra `emerald-500` | `RF-001.1`, `RF-001.2`, `CA-03` |
| `src/components/sections/Header.tsx` | Mantener | Cabecera con monograma `I. O.`, estado NFC y selector `ES` / `EN` (`min-h-[44px]`) | `RF-002.2`, `RF-010.3` |
| `src/components/ui/3d-card.tsx`, `src/components/sections/HeroCard3D.tsx` | Modificar | Tarjeta 3D ejecutiva **sin biografía extensa**, mostrando rol `Software Engineer & Systems Specialist`, chips del stack real (`Node.js`, `Python`, `Docker`, `Linux`, `Bash`, `Java`) con iconos vectoriales y badge `ES · EN · VAL (Fluent)` | `RF-003.1`, `RF-003.2`, `RF-004.1`, `RF-004.2`, `CA-05` |
| `src/components/sections/QuickActions.tsx` | Modificar | Botón primario `Guardar Contacto` (`.vcf`) y 4 botones secundarios: `LinkedIn`, `GitHub`, `Email` (`mailto:ivanoliveradev@gmail.com`) y `QR` | `RF-005.1`, `RF-006.1`, `RF-006.2`, `RF-010.3`, `CA-05`, `CA-07` |
| `src/components/sections/ExecutiveSnapshot.tsx` | **Crear** | Única tarjeta ejecutiva inferior con el foco actual en **Yuvod** (integraciones sobre plataforma existente, automatización de procesos e infraestructura) y botón CTA `Explorar Portfolio Completo (ivanolivera.dev)` con icono vectorial `<ArrowUpRight />` | `RF-008.1`, `RF-008.2`, `CA-05` |
| `src/components/ui/qr-sheet.tsx` | Modificar | Modal de Código QR vectorial (`https://card.ivanolivera.dev/?ref=nfc`), copia al portapapeles, `navigator.share` y cierre con `Escape`/backdrop | `RF-007.1` a `RF-007.4`, `CA-06` |
| `src/App.tsx` | Modificar | Orquestador simplificado con `Header`, `HeroCard3D`, `QuickActions`, `ExecutiveSnapshot` y `QrSheet` (eliminando `ContactModal` y las 4 secciones descartadas) | Todos los `RF` |
| `src/components/ui/contact-modal.tsx` | **Eliminar** | Eliminado por decisión de producto (reemplazado por acción `mailto:ivanoliveradev@gmail.com`) | `RF-006.2` |
| `src/components/sections/StackBento.tsx`, `Highlights.tsx`, `ExperienceCompact.tsx`, `FooterDock.tsx` | **Eliminar** | Eliminados por decisión de producto y sustituidos por `ExecutiveSnapshot.tsx` | `RF-008.1`, `RF-008.2` |

---

## 3. Contratos de Tipos y Pseudocódigo de Funciones Puras y Componentes Clave

### 3.1. Perfil Autorizado y Diccionario Bilingüe (`src/data/profile.ts`)

```typescript
export type Language = 'es' | 'en';

export type CoreTechnology =
  | 'Node.js'
  | 'Python'
  | 'Docker'
  | 'Linux'
  | 'Bash'
  | 'Java';

export const CORE_TECHNOLOGIES: readonly CoreTechnology[] = [
  'Node.js',
  'Python',
  'Docker',
  'Linux',
  'Bash',
  'Java',
] as const;

export const LANGUAGES_BADGE = 'ES · EN · VAL (Fluent)' as const;

export interface AuthorizedContactProfile {
  fullName: 'Iván Olivera González';
  firstName: 'Iván';
  lastName: 'Olivera González';
  role: 'Software Engineer & Systems Specialist';
  email: 'ivanoliveradev@gmail.com';
  mailtoUrl: 'mailto:ivanoliveradev@gmail.com';
  portfolioUrl: 'https://ivanolivera.dev';
  cardUrl: 'https://card.ivanolivera.dev';
  nfcUrl: 'https://card.ivanolivera.dev/?ref=nfc';
  linkedinUrl: 'https://www.linkedin.com/in/ivan-olivera-gonzalez/';
  githubUrl: 'https://github.com/Ivan-olivera-dev';
  city: 'Valencia';
  country: 'España';
  locationLabel: 'Valencia, España';
  languagesBadge: typeof LANGUAGES_BADGE;
  stack: readonly CoreTechnology[];
}

export interface ExecutiveFocusPillar {
  id: 'integrations' | 'automation' | 'infrastructure';
  label: string;
  detail: string;
}

export interface TranslationDictionary {
  header: {
    monogram: string;
    statusLabel: string;
    languageSelectorAria: string;
    switchToEsAria: string;
    switchToEnAria: string;
  };
  hero: {
    badge: string;
    fullName: string;
    role: 'Software Engineer & Systems Specialist';
    location: string;
    availability: string;
    stackLabel: string;
    languagesBadge: typeof LANGUAGES_BADGE;
    interactiveHint: string;
    cardAriaLabel: string;
  };
  actions: {
    saveContact: string;
    saveContactSubtitle: string;
    saveContactAria: string;
    linkedin: string;
    linkedinAria: string;
    github: string;
    githubAria: string;
    email: string;
    emailAria: string;
    qrCode: string;
    qrCodeAria: string;
  };
  snapshot: {
    eyebrow: string;
    company: 'Yuvod';
    roleBadge: string;
    headline: string;
    summary: string;
    pillars: readonly ExecutiveFocusPillar[];
    portfolioCtaLabel: string; // ES: "Explorar Portfolio Completo (ivanolivera.dev)" | EN: "Explore Full Portfolio (ivanolivera.dev)"
    portfolioCtaAria: string;
  };
  qrModal: {
    title: string;
    subtitle: string;
    qrAlt: string;
    copyButton: string;
    copiedButton: string;
    shareButton: string;
    shareTitle: string;
    shareText: string;
    manualCopyHint: string;
    closeAria: string;
  };
}
```

### 3.2. Tarjeta 3D Directa (`src/components/sections/HeroCard3D.tsx` — `RF-003.1`, `RF-003.2`, `RF-004`)

```tsx
// Pseudocódigo estructural de HeroCard3D:
// - Sin párrafo de biografía extensa (RF-003.2).
// - Muestra nombre "Iván Olivera González" y rol "Software Engineer & Systems Specialist".
// - Muestra ubicación "Valencia, España" y badge compacto "ES · EN · VAL (Fluent)".
// - Muestra los 6 chips del stack real: Node.js, Python, Docker, Linux, Bash, Java con iconos vectoriales (react-icons/si + lucide-react).
```

### 3.3. Acciones Rápidas (`src/components/sections/QuickActions.tsx` — `RF-005.1`, `RF-006.1`, `RF-006.2`)

```tsx
// Pseudocódigo estructural de QuickActions:
// 1. Botón Primario: "Guardar Contacto" / "Save Contact" -> downloadVCard(profile) + trackEvent('vcard_download')
// 2. Cuadrícula de 4 acciones secundarias (min-h-[44px]):
//    - LinkedIn (<a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">) -> trackEvent('social_click', { target: 'linkedin' })
//    - GitHub (<a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">) -> trackEvent('social_click', { target: 'github' })
//    - Email directo (<a href="mailto:ivanoliveradev@gmail.com">) -> trackEvent('social_click', { target: 'email' })
//    - Código QR (<button type="button" onClick={onOpenQr}>) -> trackEvent('qr_open') + onOpenQr()
```

### 3.4. Tarjeta Ejecutiva Inferior (`src/components/sections/ExecutiveSnapshot.tsx` — `RF-008.1`, `RF-008.2`)

```tsx
// Pseudocódigo estructural de ExecutiveSnapshot:
// - Contenedor bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4.
// - Cabecera con indicador emerald-500, foco actual en "Yuvod" y especialidad en integraciones sobre plataforma existente, automatización de procesos e infraestructura.
// - 3 pilares compactos (Integraciones, Automatización, Infraestructura).
// - Botón/Enlace CTA de ancho completo hacia https://ivanolivera.dev:
//   Texto: t.snapshot.portfolioCtaLabel ("Explorar Portfolio Completo (ivanolivera.dev)" / "Explore Full Portfolio (ivanolivera.dev)")
//   Icono: <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> (vectorial, evitando el carácter Unicode U+2197 que tiene propiedad Extended_Pictographic).
```

---

## 4. Decisiones Arquitectónicas Justificadas

1. **Contacto por `mailto:ivanoliveradev@gmail.com` Directo vs. `ContactModal` con Formulario AJAX**:
   - **Decisión**: Reemplazar el modal de formulario por un enlace directo `mailto:ivanoliveradev@gmail.com` en las acciones secundarias y eliminar `contact-modal.tsx`.
   - **Alternativa descartada**: Mantener un formulario intermedio conectado a FormSubmit. Se descarta porque en el contexto móvil de un escaneo NFC presencial el interlocutor prefiere guardar el `.vcf` o abrir su cliente de correo nativo en un toque sin rellenar campos ni depender de servicios de terceros.
2. **Sección Inferior Única (`ExecutiveSnapshot`) vs. Múltiples Secciones (`StackBento`, `Highlights`, `ExperienceCompact`, `FooterDock`)**:
   - **Decisión**: Consolidar el contenido bajo las acciones rápidas en un único componente ejecutivo `ExecutiveSnapshot.tsx` centrado en el impacto actual en `Yuvod` (integraciones, automatización e infraestructura) con un CTA directo a `https://ivanolivera.dev`.
   - **Alternativa descartada**: Replicar todo el portfolio (bento de competencias, 4 proyectos con fotos, línea temporal de estudios/certificaciones y dock flotante) dentro de la tarjeta. Se descarta porque sobrecarga el scroll móvil y compite con el propósito real de `ivanolivera.dev`.
3. **Flecha Externa Vectorial (`<ArrowUpRight />`) vs. Carácter Unicode `↗` (`U+2197`)**:
   - **Decisión**: Renderizar el indicador de apertura externa del botón `Explorar Portfolio Completo (ivanolivera.dev)` mediante el componente SVG `<ArrowUpRight />` de `lucide-react` junto al texto limpio.
   - **Alternativa descartada**: Incluir el carácter literal `↗` (`U+2197`) en las cadenas de `profile.ts`. Se descarta porque el estándar Unicode asigna la propiedad `Extended_Pictographic` a `U+2197`, lo que haría fallar el validador estricto `containsEmoji()` (`RF-010.2` / `CA-04`).
4. **Tarjeta 3D con CSS 3D Perspective + Framer Motion y QR Vectorial `<svg>`**:
   - **Decisión**: Mantener la perspectiva CSS 3D ligera acelerada por GPU y la generación del QR en `<svg>` vectorial en cliente con almacenamiento defensivo `try/catch`.
   - **Alternativa descartada**: Three.js o APIs externas de QR. Se descartan por peso de bundle y dependencia de red.

---

## 5. Estrategia de Testing (`npm test`) y Verificación de Build (`npm run build`)

Todos los tests se ejecutan en modo no interactivo con `npm test` (`vitest run`) y el chequeo de tipos + empaquetado de producción con `npm run build` (`tsc -b && vite build`).

| Archivo de Test | Tipo | Qué valida | RF / CA Cubiertos |
| :--- | :--- | :--- | :--- |
| `src/lib/__tests__/utils.test.ts` | Unitario | Helper `cn()` y detector `containsEmoji()` | `RF-010.2`, `CA-04` |
| `src/data/__tests__/profile.test.ts` | Unitario | Rol `Software Engineer & Systems Specialist`, stack exacto `['Node.js', 'Python', 'Docker', 'Linux', 'Bash', 'Java']`, badge `ES · EN · VAL (Fluent)`, foco en `Yuvod`, paridad `es`/`en` y **0 emojis** en todo `profile.ts` | `RF-002`, `RF-003`, `RF-005`, `RF-008`, `RF-010.2`, `CA-02`, `CA-04`, `CA-05` |
| `src/lib/__tests__/vcard.test.ts` | Unitario | Formato vCard 3.0 con `\r\n`, `TITLE:Software Engineer & Systems Specialist`, `ADR;TYPE=WORK:;;;Valencia;;España`, ausencia total de `TEL` y de emojis, y descarga de `ivan-olivera.vcf` | `RF-005.1`, `RF-005.2`, `RF-010.2`, `CA-01`, `CA-04` |
| `src/lib/__tests__/analytics.test.ts` | Unitario | Detección de `?ref=nfc` y `?source=nfc`, deduplicación por sesión de `nfc_scan`, emisión de eventos (`vcard_download`, `social_click`, `qr_open`) y degradación silenciosa | `RF-009.1` a `RF-009.3`, `CA-06` |
| `src/hooks/__tests__/useLanguage.test.tsx` | Integración Hook | Detección de `es-ES` -> `es`, `ca-ES`/`fr-FR`/`en-US` -> `en`, persistencia en `localStorage` y fallback en memoria | `RF-002.1`, `RF-002.2`, `CA-02` |
| `src/components/sections/__tests__/Loader.test.tsx` | Componente | Secuencia progresiva (`"Initializing System..."` -> `"Decrypting modules..."` -> `"Access Granted."`) en ~1.4s en primera visita; omisión inmediata (`0 ms`) en segunda visita o con `prefers-reduced-motion: reduce` | `RF-001.1`, `RF-001.2`, `CA-03` |
| `src/components/sections/__tests__/HeroAndActions.test.tsx` | Componente | Renderizado de `HeroCard3D` sin bio extensa, rol `Software Engineer & Systems Specialist`, las 6 tecnologías (`Node.js`, `Python`, `Docker`, `Linux`, `Bash`, `Java`), badge `ES · EN · VAL (Fluent)`, botón primario `.vcf` y 4 secundarios (`LinkedIn`, `GitHub`, `mailto:ivanoliveradev@gmail.com`, `QR`) con `min-h-[44px]` | `RF-003.1`, `RF-003.2`, `RF-004`, `RF-005.1`, `RF-006.1`, `RF-006.2`, `RF-010.3`, `CA-03`, `CA-05`, `CA-07` |
| `src/components/sections/__tests__/ExecutiveSnapshot.test.tsx` | Componente | Renderizado bilingüe (`ES`/`EN`) de `ExecutiveSnapshot` con foco actual en `Yuvod` (integraciones, automatización e infraestructura), botón CTA `Explorar Portfolio Completo (ivanolivera.dev)` hacia `https://ivanolivera.dev` y emisión de `social_click` | `RF-008.1`, `RF-008.2`, `RF-009.2`, `CA-02`, `CA-05` |
| `src/components/ui/__tests__/Modals.test.tsx` | Componente | Modal `QrSheet` (SVG vectorial para `https://card.ivanolivera.dev/?ref=nfc`, copia al portapapeles, `navigator.share` + manejo silencioso de `AbortError`, cierre con `Escape`/backdrop y bloqueo/restauración de scroll) | `RF-007.1` a `RF-007.4`, `CA-06` |
| `src/__tests__/App.test.tsx` | Integración E2E | Flujo completo de la aplicación: cambio instantáneo `ES`/`EN`, presencia exclusiva de `Header` + `HeroCard3D` + `QuickActions` + `ExecutiveSnapshot`, ausencia de las secciones eliminadas y de `ContactModal`, apertura/cierre de `QrSheet` y verificación de 0 emojis en el DOM | `CA-01` a `CA-07` |
