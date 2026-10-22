# Decisiones

## Rendering

Home es un Server Component y lee el mock en proceso: saldo, nombre y la primera página de movimientos. Las siguientes páginas dependen del scroll, así que un Client Component de la ruta pide `GET /api/wallet/movements` y las acumula en estado local, no en Zustand. `MovementsList` observa el final de la lista y avisa; no llama a la red. `loading.tsx` y `error.tsx` cubren solo la primera página. La siguiente muestra su spinner y, si falla, un reintento que no quita las filas ya visibles. Los query `view` no se reenvían al pedir más.

`loading.tsx` cubre la carga inicial y `error.tsx` es Client Component porque Next lo exige. `export const dynamic = "force-dynamic"` evita que el saldo quede congelado en un render estático. Login, nueva transacción y confirmación son Client Components: son formularios e interacción, incluido el reintento. No hay Server Actions. El reintento de la confirmación vuelve a llamar al Route Handler.

El error de Home se dispara con `?view=error`. `reset()` volvería a lanzar el mismo error porque el query sigue ahí, así que el botón recarga `/home` sin ese parámetro. El cursor de la lista es el id del último movimiento ya mostrado, porque un envío exitoso se antepone y un offset quedaría desalineado.

## Router

App Router en `src/app`.

- `/` redirige a `/login`
- `/login`
- `/home`
- `/transaction`
- `/transaction/confirm`

## Estado

Zustand con `persist` solo para la sesión mock (`userId` y `name`). La rehidratación se lee con `useSyncExternalStore` para que el primer render del servidor y el del cliente coincidan, y solo después se redirige a `/login` si no hay sesión.

Zustand en memoria para el borrador (`TransferDraft` y el nombre del destinatario). No se persiste: un refresh en la confirmación vuelve a `/transaction`.

Saldo, movimientos y contactos no se copian al store. La página de transacción guarda el saldo en estado local solo para validar antes de enviar.

El borrador también guarda el identificador del destinatario para mostrarlo enmascarado en la confirmación. Si el cargo se confirma, esa page limpia el borrador: una transacción nueva no reutiliza el monto y volver a abrir la confirmación no reenvía el cargo. Si la respuesta es fondos insuficientes o error desconocido, el borrador sigue y la página de transacción lo vuelve a pintar. El comprobante incluye `balanceAfter`, el saldo del store justo después del cargo. Antes de confirmar, la page pide el saldo solo para la fila "Saldo después".

## Tests

Los tests unitarios viven en `tests/` espejando `src/`, y los e2e en `tests/e2e/`, para buscarlos en un solo sitio; Vitest incluye solo `tests/**/*.test.ts(x)` y Playwright usa `testDir: ./tests/e2e`.

## E2E

Playwright, un worker, Chromium. Dos flujos: el camino feliz hasta el comprobante, y un error de red con reintento que termina en comprobante. El test fija `x-mock-outcome` en `POST /api/transfers`. Sin ese header, el handler elige al azar entre los cinco escenarios.

## Datos

Un store en `globalThis` compartido por los Route Handlers y por Home, para que un éxito se vea al volver al inicio dentro del mismo proceso. El seed son los tres movimientos originales, más reciente primero, alineado con el anteponer de un envío exitoso. El cliente habla con los handlers a través de `src/services`. Sin red externa.

`network-error` es un JSON, no un `fetch` cortado. Si `fetch` falla de verdad, la página lo muestra como error de red y ofrece reintento. `timeout` responde a los ~3 s con un texto distinto al de red. El query `outcome` solo aplica a la primera confirmación de esa visita, para que el reintento no quede atrapado en el mismo error.

## CLI

Next.js 16.4.2, creado con `create-next-app` (plantilla `app-tw-empty`). TypeScript, Tailwind CSS 4, ESLint, App Router, directorio `src/` y alias `@/*`. Turbopack queda porque es el default estable del CLI, con `turbopack.root` en este proyecto para que no suba hasta el directorio personal. Cache Components, React Compiler y `AGENTS.md` están apagados: no aportan a este challenge y Cache Components cambia el modelo de rendering que hay que justificar.

Los tests unitarios usan Vitest 3 y jsdom 26. Vitest 4 y jsdom 30 no cargan en Node 20.16, que es el Node por defecto de esta máquina.

## Corte UI / lógica

`AmountInput` formatea y emite el valor. `parseAmountInput` vive en `src/lib` y no compara contra el saldo. `validateTransfer` decide. La page bloquea el submit. El organism muestra el mensaje. Atoms y molecules no importan dominio, servicios ni rutas.

## Edge cases

- Monto 0, negativo y `NaN`.
- Monto igual al saldo: pasa.
- Destinatario vacío o en blanco.
- Fondos insuficientes en el dominio, antes del `POST`, y también como respuesta del mock aunque el cliente ya haya validado.
- Timeout distinto de un error de red.
- Lista de movimientos vacía.
- Cursor de movimientos desconocido: la respuesta trae una página vacía y `nextCursor` null, para cortar y no entrar en bucle.
- Respuesta de una página cuyo cursor ya no es el pendiente: se descarta y el cursor no avanza.
- Formato de login: email simple o teléfono de 10 dígitos.
- Error simulado con `error@wallet.test` y `0000000000`.
- Hidratación de la sesión antes de redirigir.
- Refresh en confirmación sin borrador.
- Contactos y saldo que se pierden al reiniciar el proceso.

## Con más tiempo

Revalidar en el handler con la misma función de dominio, hacer idempotente la confirmación, persistir los contactos fuera de la memoria del proceso y sustituir la sesión mock por autenticación real.
