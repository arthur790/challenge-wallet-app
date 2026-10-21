# Uso de IA

## Fase 0 — Setup

1. Herramienta: Cursor, sobre el scaffold del proyecto.
2. Se aceptó el comando de `create-next-app` del plan (Next.js 16.4.2, Tailwind, `src/`, App Router). El CLI rechazó la raíz porque ya tenía archivos; se generó en un directorio temporal y se movió el scaffold sin pisar `.cursor/`. Se rechazó Vitest 4: su loader exige Node 20.19 o superior y aquí el Node por defecto es 20.16. Quedó Vitest 3.2. El primer `next dev` generó `AGENTS.md`; se borró y se apagó con `agentRules: false`.
3. Qué decidió la persona: Tailwind CSS, una versión reciente de Next.js instalada con el CLI oficial, y ejecutar el challenge por fases.

## Fase 1 — Dominio

1. Herramienta: Cursor, sobre `src/domain`.
2. Se aceptó el contrato de `validateTransfer`, `parseIdentifier` y los cinco status de confirmación, con tests de monto cero, negativo, `NaN`, saldo y destinatario.
3.

## Fase 2 — Atoms y templates

1. Herramienta: Cursor, sobre `src/components` y `globals.css`.
2. Se aceptaron los atoms y los dos templates con tokens de Tailwind 4. Ninguno importa dominio ni servicios.
3.

## Fase 3 — API y services

1. Herramienta: Cursor, sobre `src/server`, `src/app/api` y `src/services`.
2. Se aceptó el store en memoria, los Route Handlers y el cliente tipado. El store vive en `globalThis` para que Home y los handlers compartan el mismo saldo.
3.

## Fase 4 — Login

1. Herramienta: Cursor, sobre login, `LoginForm` y la sesión Zustand.
2. Se aceptó la validación de formato en la page, la carga, el error simulado y la navegación a Home.
3.

## Fase 5 — Home

1. Herramienta: Cursor, sobre la page de Home, la lista de movimientos y el guard de sesión.
2. Se aceptó la lectura en el servidor y los estados vacío, error y carga. El botón de error recarga `/home` en lugar de llamar a `reset()`, porque el query `view=error` volvería a fallar.
3.

## Fase 6 — Nueva transacción

1. Herramienta: Cursor, sobre el compositor, el borrador y `validateNewContact`.
2. Se aceptó bloquear el continue con `validateTransfer` y guardar el contacto en el mock. Se corrigió que, al guardar un contacto, el error de destinatario anterior siguiera visible: ahora se limpia al seleccionarlo.
3.

## Fase 7 — Confirmación

1. Herramienta: Cursor, sobre la page de confirmación, el comprobante y los cinco escenarios.
2. Se aceptó traducir cada status a su UI y ofrecer reintento solo en error de red y timeout. El query `outcome` se consume en el primer intento para que el reintento no repita el mismo error forzado.
3.

## Fase 8 — Tests y documentación

1. Herramienta: Cursor, sobre Vitest, Testing Library, Playwright y estos documentos.
2. Se aceptaron los tests de `AmountInput`, `LoginForm` y `MovementsList`, y los dos e2e. Se rechazó jsdom 30 porque exige un Node más nuevo; quedó jsdom 26. Los e2e quedan fuera del runner de Vitest.
3.

## Fase 9 — Cierre

1. Herramienta: Cursor, sobre `SummaryRow` y el test de `RequireSession`.
2. Se aceptó partir el valor largo dentro de la fila y cubrir el guard de sesión en sus tres estados: sin hidratar, con sesión y sin sesión. Se corrigió que los tests no limpiaban el DOM entre casos, porque Vitest no registra el `afterEach` de Testing Library.
3.

## Fase 10 — Carpeta de tests

1. Herramienta: Cursor, sobre la ubicación de los tests.
2. Se aceptó mover los diez archivos existentes a `tests/` (unitarios espejando `src/`, e2e en `tests/e2e/`) y pasar los imports relativos del código fuente al alias `@/`. No se cambiaron aserciones ni el comportamiento de la app.
3.

## Qué decidió la persona

- Tailwind CSS para la UI.
- Next.js reciente, con el setup inicial hecho mediante los comandos oficiales.
- Ejecutar el desarrollo por fases.
- Implementar el patrón Atomic Design
