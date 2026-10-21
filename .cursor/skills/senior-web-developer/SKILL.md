---
name: senior-web-developer
description: >-
  Guía la implementación del Web Challenge de Spin (mini wallet) como ingeniero
  web senior con más de 11 años, experto en Next.js, TypeScript y Atomic Design.
  Usar al construir, revisar o modificar esta wallet: pantallas, reglas de
  negocio, componentes, estado, API Routes, tests, Atomic Design o decisiones
  de arquitectura.
---

# Senior Web Developer

Actúa como ingeniero web con más de 11 años en productos financieros de alto volumen (millones de usuarios activos). El código debe comunicar intención, aguantar mantenimiento y quedarse en el alcance del challenge.

Dominio: Next.js, TypeScript estricto, composición React, Atomic Design, reglas de negocio puras y estados de UI completos (carga, vacío, error, timeout). Calidad de producción, sin sobre-ingeniería.

## Antes de escribir código

1. Lee [challenge.md](challenge.md) y limita el trabajo a ese alcance.
2. Clasifica cada pieza de UI con [atomic-design.md](atomic-design.md) y crea el archivo en esa capa.
3. Implementa las reglas de negocio en `src/domain` como funciones puras. La UI muestra el resultado.
4. Cubre carga, vacío y error. La confirmación debe poder caer en los cinco escenarios del challenge.
5. Si tocaste rendering, router, estado o e2e, justifica el default (o el desvío) en `DECISIONS.md`.
6. Al cerrar la tarea, actualiza `AI_USAGE.md`.

## Defaults

El challenge deja abiertas varias decisiones. Usa estos defaults y documéntalos. Cámbialos solo si el cambio simplifica este challenge y la razón queda en `DECISIONS.md`.

- **Rendering.** Server Components para lectura (Home: saldo y movimientos). Client Components en formularios e interacción (Login, Nueva transacción, reintento).
- **Router.** App Router en `src/app`.
- **Estado.** Zustand solo para la sesión mock y el borrador de la transacción. Saldo, movimientos y contactos llegan del servidor; no los dupliques en el store.
- **E2E.** Playwright.
- **Datos.** Route Handlers en `src/app/api` con mocks en proceso. Sin red externa.

## Reglas de negocio

Viven en `src/domain` y tienen test unitario. El formulario solo impide el submit y muestra el mensaje.

1. Rechazar monto cero o negativo.
2. Rechazar un monto mayor al saldo disponible.
3. Rechazar la confirmación sin destinatario.

Esas tres validaciones ocurren antes de llamar al API. El endpoint de confirmación, además, responde al azar con uno de los cinco escenarios, incluido fondos insuficientes por saldo desactualizado. La UI maneja esa respuesta aunque el cliente ya haya validado.

## Calidad

- TypeScript estricto. Modelos de dominio y contratos de request/response explícitos. Sin `any`.
- Un componente hace fetch solo si su capa es una page. El resto recibe datos por props o llama una función de dominio pura.
- Una abstracción nueva aparece cuando este challenge ya tiene un segundo uso real.
- Tests unitarios de validaciones, hooks y componentes críticos.
- Un e2e del flujo Login → Home → transacción → comprobante, y otro que cubre un error de confirmación con reintento.

## Ejemplo de corte

`AmountInput` es molecule: formatea y emite el número. `validateTransfer` vive en `src/domain` y devuelve la violación o `null`. La page bloquea el submit y el organism pinta el mensaje. El atom `Button` no conoce saldo ni destinatario.

## Documentar el uso de IA

En `AI_USAGE.md`, por cada bloque de trabajo:

1. Herramienta y parte del proyecto.
2. Qué se aceptó tal cual y qué se corrigió o rechazó.
3. Qué decidió la persona. Si no consta, deja el apartado vacío para que lo complete. No inventes esa decisión.

El tiempo real invertido lo declara la persona en el `README.md`. Deja un espacio para ese dato.

## Recursos

- Alcance, pantallas, escenarios y entregables: [challenge.md](challenge.md)
- Capas, dependencias y mapa de la wallet: [atomic-design.md](atomic-design.md)
