# Guía de Agentes SDD — `TarjetaVisita` (`card.ivanolivera.dev`)

Este proyecto sigue la metodología **Spec-Driven Development (SDD)** mediante una arquitectura multiagente en OpenCode. Ninguna funcionalidad se implementa en el código sin contar antes con una especificación (`spec.md`), un plan técnico (`plan.md`) y una lista de tareas verificables (`tasks.md`) aprobadas por el usuario.

## Flujo de Trabajo SDD

```text
coordinator -> planner -> implementer <-> reviewer
```

1. **`coordinator`** (`.opencode/agents/coordinator.md`) — *Agente primario*:
   - Conversa con el usuario, recopila requisitos y coordina las aprobaciones entre fases.
   - Nunca escribe código ni modifica archivos directamente.
   - Modelo asignado: `google/gemini-4-argon#high`.
2. **`planner`** (`.opencode/agents/planner.md`) — *Subagente de arquitectura y diseño SDD*:
   - Redacta `specs/NNN-nombre/spec.md` (requisitos en formato EARS), `plan.md` (arquitectura, decisiones, componentes y estrategia de tests) y `tasks.md` (máximo 10 tareas ordenadas).
   - Solo tiene permiso de escritura dentro de `specs/**`.
   - Modelo asignado: `google/gemini-4-argon#high`.
3. **`implementer`** (`.opencode/agents/implementer.md`) — *Subagente de desarrollo TDD*:
   - Ejecuta **una única tarea** cada vez siguiendo TDD (primero tests con `npm test`, luego implementación y verificación de build con `npm run build`).
   - Aplica las skills de diseño (`design-taste-frontend`, `ui-styling`, `ui-ux-pro-max`) y respeta `docs/constitution.md`.
   - Modelo asignado: `google/gemini-4-argon#high`.
4. **`reviewer`** (`.opencode/agents/reviewer.md`) — *Subagente de QA y auditoría*:
   - Audita las specs en fase de clarificación y valida la implementación requisito por requisito (RF por RF) ejecutando `npm test` y `git diff`, sin modificar ningún archivo.
   - Modelo asignado: `google/gemini-4-argon#high`.

---

## Mapa de Archivos Principales

| Ruta | Propósito | Quién lo mantiene |
| :--- | :--- | :--- |
| `AGENTS.md` | Documentación del sistema multiagente y flujo operativo SDD | `bootstrapper` / Equipo |
| `MEMORY.md` | Bitácora viva del estado del proyecto, decisiones y progreso de specs | `implementer` (al cerrar spec) |
| `docs/constitution.md` | Reglas inquebrantables de producto, diseño, código, testing y restricciones | `bootstrapper` / Usuario |
| `opencode.jsonc` | Configuración raíz de OpenCode (`default_agent` y `model` base) | `bootstrapper` |
| `specs/NNN-nombre/` | Artefactos de cada iteración SDD (`spec.md`, `plan.md`, `tasks.md`) | `planner` / `implementer` |
| `.opencode/agents/` | Prompts de sistema y permisos de `coordinator`, `planner`, `implementer`, `reviewer` | `bootstrapper` |

---

## Stack Técnico del Proyecto

| Capa | Tecnología | Detalles |
| :--- | :--- | :--- |
| **Framework UI** | React 19 + TypeScript | Componentes funcionales con tipado estricto (`.tsx`) |
| **Bundler / Dev** | Vite | Compilación ultrarrápida y optimización de assets para móvil |
| **Estilos** | Tailwind CSS + `clsx` + `tailwind-merge` | Estética dark `#000000` / `#0a0a0a`, acento `emerald-500`, cero emojis |
| **Animaciones y 3D** | Framer Motion + CSS 3D Perspective | Loader con `EncryptedText`, tarjeta 3D interactiva al tacto/puntero, respeto a `prefers-reduced-motion` |
| **Iconografía** | `lucide-react` + `react-icons/si` | Iconos vectoriales limpios (prohibido el uso de emojis) |
| **Testing** | Vitest + React Testing Library (`jsdom`) | Ejecución mediante `npm test` (`vitest run`) |
| **Build** | TypeScript + Vite Build | Ejecución mediante `npm run build` (`tsc -b && vite build`) |
| **Despliegue** | Cloudflare Pages (`card.ivanolivera.dev`) + Docker | Híbrido: estático en Edge CDN (`public/_headers`) y contenedor `Dockerfile` (`nginx:alpine`) |

---

## Pasos del Flujo Operativo

1. **Fase 1 — Especificación (`Spec`)**: El usuario plantea una funcionalidad a `coordinator`, quien solicita a `planner` la creación de `specs/NNN-nombre/spec.md`.
2. **Fase 2 — Clarificación (`QA de Spec`)**: `reviewer` audita `spec.md` buscando ambigüedades, contradicciones o conflictos con `docs/constitution.md`. El usuario aprueba la spec.
3. **Fase 3 — Planificación (`Plan & Tasks`)**: `planner` genera `plan.md` y `tasks.md`. El usuario aprueba el plan antes de escribir código.
4. **Fase 4 — Implementación (`TDD tarea por tarea`)**: `coordinator` invoca a `implementer` de forma secuencial (`T1`, `T2`...). Tras cada tarea, `npm test` y `npm run build` deben estar en verde.
5. **Fase 5 — Validación Final (`Review`)**: `reviewer` audita el código frente a cada RF de `spec.md` y emite `VEREDICTO: APROBADO` o `VEREDICTO: CAMBIOS NECESARIOS`.
