# Lista de Tareas de Implementación: MVP `TarjetaVisita` (`001-mvp`)

- **ID de Especificación**: `001-mvp`
- **Plan de Referencia**: `specs/001-mvp/plan.md`
- **Metodología**: TDD estricto (`npm test` -> `vitest run` y `npm run build` -> `tsc -b && vite build` en cada tarea)
- **Total de Tareas**: 5 (T1 y T2 completadas; T3, T4 y T5 para aplicar las decisiones ejecutivas aprobadas)

---

## T1 — Scaffolding Base, Configuración Híbrida (Cloudflare + Docker) y Utilidades (`cn`, `containsEmoji`)
- [x] **Estado**: Completada
- **RF / CA cubiertos**: `RF-010.1`, `RF-010.2`, `RF-011.1`, `RF-011.2`, `CA-04`
- **Archivos**:
  - `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`
  - `public/_headers`, `public/manifest.webmanifest`, `Dockerfile`, `nginx.conf`, `docker-compose.yml`
  - `src/test/setup.ts`, `src/lib/utils.ts`, `src/lib/__tests__/utils.test.ts`
- **Descripción**:
  Base del proyecto React 19 + TypeScript estricto + Vite + Tailwind CSS + Framer Motion + Vitest (`jsdom`), infraestructura de despliegue híbrido y función pura `containsEmoji()`.
- **Hecho cuando**:
  `npm test` aprueba `src/lib/__tests__/utils.test.ts` y `npm run build` compila sin errores.

---

## T2 — Secuencia de Carga Inicial (`Loader`), Primitiva `EncryptedText` y Hooks Base (`useLanguage`, `useReducedMotion`, `useTilt3D`)
- [x] **Estado**: Completada
- **RF / CA cubiertos**: `RF-001.1`, `RF-001.2`, `RF-002.1`, `RF-002.2`, `RF-004.1`, `RF-004.2`, `CA-02`, `CA-03`
- **Archivos**:
  - `src/components/ui/encrypted-text.tsx`, `src/components/sections/Loader.tsx`, `src/components/sections/__tests__/Loader.test.tsx`
  - `src/hooks/useLanguage.ts`, `src/hooks/useReducedMotion.ts`, `src/hooks/useTilt3D.ts`, `src/hooks/__tests__/useLanguage.test.tsx`
- **Descripción**:
  Secuencia de apertura (~1,4s) con `EncryptedText` y barra `emerald-500`, omisión inmediata (`0 ms`) en recargas de sesión o con `prefers-reduced-motion: reduce`, y persistencia bilingüe `ES`/`EN`.
- **Hecho cuando**:
  `npm test` aprueba `Loader.test.tsx` y `useLanguage.test.tsx`, y `npm run build` finaliza en verde.

---

## T3 — Actualización de Datos del Perfil (`Software Engineer & Systems Specialist`), Stack Real, Badge de Idiomas, Snapshot `Yuvod` y vCard `.vcf`
- [x] **Estado**: Completada
- **RF / CA cubiertos**: `RF-002.1`, `RF-002.2`, `RF-003.1`, `RF-005.1`, `RF-005.2`, `RF-008.1`, `RF-009.1`, `RF-009.2`, `RF-009.3`, `RF-010.2`, `RF-011.1`, `CA-01`, `CA-02`, `CA-04`, `CA-05`, `CA-06`
- **Archivos a modificar**:
  - `src/data/profile.ts`
  - `src/lib/vcard.ts`
  - `src/lib/analytics.ts`
  - `index.html`
  - `public/manifest.webmanifest`
  - `src/data/__tests__/profile.test.ts`
  - `src/lib/__tests__/vcard.test.ts`
  - `src/lib/__tests__/analytics.test.ts`
- **Descripción**:
  1. Actualizar `AUTHORIZED_PROFILE` en `src/data/profile.ts` con el rol `Software Engineer & Systems Specialist`, `mailtoUrl: 'mailto:ivanoliveradev@gmail.com'`, stack real `CORE_TECHNOLOGIES = ['Node.js', 'Python', 'Docker', 'Linux', 'Bash', 'Java']` y badge de idiomas `LANGUAGES_BADGE = 'ES · EN · VAL (Fluent)'`.
  2. Definir en `translations` (`es` / `en`) los textos del bloque `snapshot` (foco actual en `Yuvod`: integraciones sobre plataforma existente, automatización de procesos e infraestructura, y botón CTA `"Explorar Portfolio Completo (ivanolivera.dev)"` / `"Explore Full Portfolio (ivanolivera.dev)"` sin caracteres Unicode pictográficos como `↗`).
  3. Actualizar `index.html` y `public/manifest.webmanifest` con el rol `Software Engineer & Systems Specialist`.
  4. Actualizar `profile.test.ts`, `vcard.test.ts` y `analytics.test.ts` validando el nuevo rol en `ivan-olivera.vcf`, el stack de 6 tecnologías, el badge `ES · EN · VAL (Fluent)` y **0 emojis** en todo el diccionario.
- **Hecho cuando**:
  `npm test` aprueba `profile.test.ts`, `vcard.test.ts` y `analytics.test.ts` en verde, y `npm run build` compila limpiamente sin errores de tipos.

---

## T4 — Rediseño de `HeroCard3D` (Sin Biografía Extensa, con Stack Real y Badge) y `QuickActions` (Email Directo `mailto:` sin Modal de Contacto)
- [x] **Estado**: Completada
- **RF / CA cubiertos**: `RF-003.1`, `RF-003.2`, `RF-004.1`, `RF-004.2`, `RF-005.1`, `RF-006.1`, `RF-006.2`, `RF-009.2`, `RF-010.1`, `RF-010.3`, `CA-01`, `CA-03`, `CA-05`, `CA-07`
- **Archivos a modificar**:
  - `src/components/sections/HeroCard3D.tsx`
  - `src/components/sections/QuickActions.tsx`
  - `src/components/sections/__tests__/HeroAndActions.test.tsx`
- **Descripción**:
  1. Actualizar `HeroCard3D.tsx` para eliminar el párrafo de biografía extensa y mostrar de forma ejecutiva y escaneable: nombre `Iván Olivera González`, rol `Software Engineer & Systems Specialist`, ubicación `Valencia, España`, badge compacto `ES · EN · VAL (Fluent)` y los 6 chips del stack real (`Node.js`, `Python`, `Docker`, `Linux`, `Bash`, `Java`) con iconos vectoriales.
  2. Actualizar `QuickActions.tsx` para mantener el botón primario **Guardar Contacto** (`.vcf`) y presentar debajo exactamente los 4 botones secundarios con área táctil `min-h-[44px]`: **LinkedIn**, **GitHub**, **Email directo** (`href="mailto:ivanoliveradev@gmail.com"`) y **Código QR** (eliminando el disparador del modal de contacto).
  3. Actualizar `HeroAndActions.test.tsx` para verificar la ausencia de biografía extensa, la presencia de las 6 tecnologías y del badge `ES · EN · VAL (Fluent)`, el enlace `mailto:ivanoliveradev@gmail.com` y la descarga `.vcf`.
- **Hecho cuando**:
  `npm test` aprueba todos los casos de `HeroAndActions.test.tsx` y `npm run build` compila sin errores.

---

## T5 — Creación de `ExecutiveSnapshot`, Eliminación de Secciones Antiguas y `ContactModal`, y Orquestación Final en `App.tsx`
- [x] **Estado**: Completada
- **RF / CA cubiertos**: `RF-007.1` a `RF-007.4`, `RF-008.1`, `RF-008.2`, `RF-009.2`, `RF-010.1` a `RF-010.3`, `CA-01` a `CA-07`
- **Archivos a crear/modificar/eliminar**:
  - **Crear**: `src/components/sections/ExecutiveSnapshot.tsx`, `src/components/sections/__tests__/ExecutiveSnapshot.test.tsx`
  - **Eliminar**: `src/components/sections/StackBento.tsx`, `src/components/sections/Highlights.tsx`, `src/components/sections/ExperienceCompact.tsx`, `src/components/sections/FooterDock.tsx`, `src/components/sections/__tests__/ProfileSections.test.tsx`, `src/components/ui/contact-modal.tsx`
  - **Modificar**: `src/App.tsx`, `src/data/profile.ts` (limpieza de tipos/datos obsoletos de las secciones eliminadas), `src/components/ui/__tests__/Modals.test.tsx`, `src/__tests__/App.test.tsx`, `MEMORY.md`
- **Descripción**:
  1. Crear `ExecutiveSnapshot.tsx` mostrando la tarjeta ejecutiva inferior con el foco actual en **Yuvod** (integraciones sobre plataforma existente, automatización de procesos e infraestructura) y el botón CTA **`Explorar Portfolio Completo (ivanolivera.dev)`** / **`Explore Full Portfolio (ivanolivera.dev)`** acompañado del icono vectorial `<ArrowUpRight />` enlazando a `https://ivanolivera.dev`.
  2. Eliminar los archivos `StackBento.tsx`, `Highlights.tsx`, `ExperienceCompact.tsx`, `FooterDock.tsx`, `ProfileSections.test.tsx` y `contact-modal.tsx`, y limpiar en `src/data/profile.ts` las estructuras que solo daban soporte a esos componentes eliminados.
  3. Actualizar `src/App.tsx` para renderizar exclusivamente `Loader`, `Header`, `HeroCard3D`, `QuickActions`, `ExecutiveSnapshot` y `QrSheet`.
  4. Actualizar `Modals.test.tsx` (centrado en `QrSheet`), crear `ExecutiveSnapshot.test.tsx`, actualizar `src/__tests__/App.test.tsx` validando de extremo a extremo `CA-01` a `CA-07` (incluyendo 0 emojis y ausencia de las secciones eliminadas) y registrar el estado final en `MEMORY.md`.
- **Hecho cuando**:
  `npm test` ejecuta toda la suite de tests con 100% en verde, no existen referencias ni archivos de los componentes eliminados, `npm run build` genera `dist/` sin errores, y `MEMORY.md` refleja la actualización completada.
