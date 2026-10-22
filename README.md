# Mini wallet

Web app en Next.js y TypeScript que simula el flujo de una wallet: Login, Home, nueva transacción y confirmación. Los datos son mock y viven en Route Handlers. No hay autenticación, pagos ni backends reales.

## Cómo ejecutar

Requiere Node.js 20.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros scripts:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

`test:e2e` usa Playwright con Chromium. La primera vez hace falta `npx playwright install chromium`.

Para ver los estados de Home sin depender del azar: `/home?view=loading`, `/home?view=empty` y `/home?view=error`. Para forzar un escenario de confirmación: `/transaction/confirm?outcome=success|network-error|insufficient-funds|timeout|unknown-error`. Sin ese parámetro, la confirmación elige un escenario al azar. El login `error@wallet.test` o el teléfono `0000000000` simulan un error.

## Librerías

- Next.js 16.4.2 (App Router) y React 19
- TypeScript estricto
- Tailwind CSS 4
- Zustand, para la sesión mock y el borrador de la transacción
- Vitest 3 y Testing Library, para reglas de dominio y componentes
- Playwright, para el flujo de extremo a extremo

## Limitaciones conocidas

- La sesión es un mock en el navegador. No hay autenticación real.
- Saldo, movimientos y contactos viven en memoria del proceso. Se pierden al reiniciar el servidor. El historial inicial son tres movimientos y se leen de a 10; el scroll pide otra página cuando hay más de 10. Si el proceso ya tenía el seed de 32, hay que reiniciarlo para ver solo esos tres.
- La confirmación elige un escenario al azar, salvo que se fuerce con el header `x-mock-outcome` o el query `outcome`.
- No hay pasarelas de pago, bancos ni KYC.

## Tiempo real invertido

_
