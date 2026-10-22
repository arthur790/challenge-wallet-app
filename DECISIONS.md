# Decisiones

## Rendering

Home es un Server Component y lee el mock en proceso: saldo, nombre y la primera página de movimientos. Las siguientes páginas dependen del scroll, así que un Client Component de la ruta pide `GET /api/wallet/movements` y las acumula en estado local, no en Zustand. `MovementsList` observa el final de la lista y avisa; no llama a la red. `loading.tsx` y `error.tsx` cubren solo la primera página. La siguiente muestra su spinner y, si falla, un reintento que no quita las filas ya visibles. Los query `view` no se reenvían al pedir más.

`loading.tsx` cubre la carga inicial y `error.tsx` es Client Component porque Next lo exige. `export const dynamic = "force-dynamic"` evita que el saldo quede congelado en un render estático. Login, nueva transacción y confirmación son Client Components: son formularios e interacción, incluido el reintento. No hay Server Actions. El reintento de la confirmación vuelve a llamar al Route Handler.

El error de Home se dispara con `?view=error`. `reset()` volvería a lanzar el mismo error porque el query sigue ahí, así que el botón recarga `/home` sin ese parámetro. El cursor de la lista es el id del último movimiento ya mostrado, porque un envío exitoso se antepone y un offset quedaría desalineado.

## Router

App Router en `src/app`. Es el default del challenge. No hay Pages Router.

- `/` redirige a `/login`
- `/login`
- `/home`
- `/transaction`
- `/transaction/confirm`

## Estado

Zustand con `persist` solo para la sesión mock (`userId` y `name`). La rehidratación se lee con `useSyncExternalStore` para que el primer render del servidor y el del cliente coincidan, y solo después se redirige a `/login` si no hay sesión.

Zustand en memoria para el borrador (`TransferDraft`, el nombre del destinatario y su identificador). No se persiste: un refresh en la confirmación vuelve a `/transaction`. En `/transaction` el borrador se lee con `useSyncExternalStore` y el snapshot de servidor es `null`, así que monto y contacto se vuelven a pintar al hidratar.

Saldo, movimientos y contactos no se copian al store. `/transaction` los pide y los guarda en estado local, con skeleton y reintento propios; no usa `loading.tsx` ni `error.tsx`. El saldo local solo sirve para validar antes de enviar. `validateNewContact` vive en `src/domain/contact.ts` y `POST /api/contacts` la vuelve a aplicar.

El identificador del destinatario se muestra enmascarado en la confirmación. `clearDraft()` corre solo si el status es `success`: una transacción nueva no reutiliza el monto y volver a abrir la confirmación no reenvía el cargo. En `network-error` y `timeout` el borrador sigue, porque el reintento está en la misma page. En fondos insuficientes y error desconocido también sigue, y la página de transacción lo vuelve a pintar. Reintentar solo aplica a `network-error` y `timeout`. Fondos insuficientes lleva a «Corregir monto». El error desconocido ofrece volver a la transacción o a Home.

Antes de confirmar, la page pide el saldo fresco. Si `saldo - monto` es mayor o igual a cero muestra la fila «Saldo después»; si no, «Saldo disponible», y el botón Transferir sigue habilitado. El comprobante incluye `balanceAfter`, el saldo del store justo después del cargo. `settleTransfer` no llama a `validateTransfer`, así que un éxito aleatorio puede dejar el saldo en negativo. Un HTTP de error o un cuerpo inválido se muestran como error desconocido. Un éxito cuyo destinatario ya no está en los contactos responde `unknown-error` y no descuenta.

## Tests

Los tests unitarios viven en `tests/` espejando `src/`, y los e2e en `tests/e2e/`, para buscarlos en un solo sitio; Vitest incluye solo `tests/**/*.test.ts(x)` y Playwright usa `testDir: ./tests/e2e`.

## E2E

Playwright, un worker, Chromium. `webServer` ejecuta `npm run dev` y reutiliza el servidor de `http://localhost:3000`. Dos flujos: el camino feliz hasta el comprobante, y un error de red con reintento que termina en comprobante. El test fija `x-mock-outcome` en `POST /api/transfers`. Sin ese header, el handler elige al azar entre los cinco escenarios.

## Datos

Un store en `globalThis` compartido por los Route Handlers y por Home, para que un éxito se vea al volver al inicio dentro del mismo proceso. El seed son los tres movimientos originales, más reciente primero, alineado con el anteponer de un envío exitoso. El cliente habla con los handlers a través de `src/services`. Sin red externa.

`network-error` es un JSON, no un `fetch` cortado. Si `fetch` falla de verdad, la página lo muestra como error de red y ofrece reintento. `timeout` responde a los ~3 s con un texto distinto al de red. `POST /api/transfers` solo lee el header `x-mock-outcome`. La page copia `?outcome=` a ese header y hace `history.replaceState` a `/transaction/confirm` antes del primer envío, así el reintento no queda fijo en el mismo error.

## CLI

Next.js 16.4.2, creado con `create-next-app` (plantilla `app-tw-empty`). TypeScript, Tailwind CSS 4, ESLint, App Router, directorio `src/` y alias `@/*`. Turbopack queda porque es el default estable del CLI, con `turbopack.root` en este proyecto para que no suba hasta el directorio personal. Cache Components, React Compiler y `AGENTS.md` están apagados: no aportan a este challenge y Cache Components cambia el modelo de rendering que hay que justificar.

Los tests unitarios usan Vitest 3. El environment por defecto es `node`. jsdom 26 entra solo con `@vitest-environment jsdom` en los tests de UI. Vitest 4 y jsdom 30 no cargan en Node 20.16.

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
- Teléfono con espacios.
- Error simulado con `error@wallet.test` y `0000000000`.
- Hidratación de la sesión antes de redirigir.
- Carga o error al abrir Nueva transacción.
- Refresh en confirmación sin borrador.
- Éxito forzado con un contacto que ya no está.
- Contactos y saldo que se pierden al reiniciar el proceso.

## Con más tiempo

Revalidar en el handler con la misma función de dominio, hacer idempotente la confirmación, persistir los contactos fuera de la memoria del proceso y sustituir la sesión mock por autenticación real.
