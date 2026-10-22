# Mini wallet

Web app en Next.js y TypeScript que simula el flujo de una wallet: Login, Home, nueva transacción y confirmación. El mock vive en memoria del proceso (`src/server/store.ts`). Home lo lee directo. Login, contactos, páginas siguientes de movimientos y confirmación pasan por Route Handlers. No hay autenticación, pagos ni backends reales.

## Cómo ejecutar

Requiere Node.js 20.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Cualquier email válido o teléfono de 10 dígitos entra y abre la sesión de Ada López. El saldo inicial es $2,500. Hay tres contactos: Ana Ruiz, Luis Mora y Mia Chen. `error@wallet.test` y `0000000000` fallan.

Otros scripts:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

`test:e2e` usa Playwright con Chromium. La primera vez hace falta `npx playwright install chromium`. Si no hay servidor, `npm run test:e2e` arranca `npm run dev` en el puerto 3000 y reutiliza el que ya esté en `http://localhost:3000`.

Para ver los estados de Home sin depender del azar: `/home?view=loading`, `/home?view=empty` y `/home?view=error`. Para forzar el primer envío de la confirmación: `/transaction/confirm?outcome=success|network-error|insufficient-funds|timeout|unknown-error`. La page lee ese query, lo manda como header `x-mock-outcome` y lo borra antes del `POST`. El Route Handler solo obedece ese header. Sin el query, y también en el reintento, la confirmación elige un escenario al azar.

## Librerías

- Next.js 16.4.2 (App Router) y React 19
- TypeScript estricto
- Tailwind CSS 4
- Zustand, para la sesión mock y el borrador de la transacción
- Vitest 3, para dominio, paginación y máscara. El environment por defecto es `node`
- Testing Library y jsdom, para componentes y pages
- Playwright, para el flujo de extremo a extremo

## Limitaciones conocidas

- La sesión es un mock en el navegador. No hay autenticación real.
- Saldo, movimientos y contactos viven en memoria del proceso. Se pierden al reiniciar el servidor. El historial inicial son tres movimientos, de a 10, así que no hay segunda página. Si este proceso de desarrollo arrancó con un seed anterior, hay que reiniciarlo: el estado queda en `globalThis` y no se vuelve a sembrar.
- La confirmación elige un escenario al azar. El query `outcome` solo fija el primer clic en Transferir; el reintento ya va al azar. El API solo obedece el header `x-mock-outcome`.
- No hay pasarelas de pago, bancos ni KYC.

## Tiempo real invertido

- El tiempo real invertido fue alrededor de 7 hrs, desde el análisis hasta llegar a las pruebas y verificar los comportamientos de acuerdo al challenge
