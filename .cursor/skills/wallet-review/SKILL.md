---
name: wallet-review
description: >-
  Revisa el código ya implementado de la wallet, corrige hallazgos con evidencia
  y deja los tests en verde. Cubre SOLID, Atomic Design, código muerto y
  mejoras no vistas en el desarrollo. Usar cuando se pide un review, una
  auditoría de SOLID o Atomic Design, buscar código muerto, o verificar que
  los tests pasen.
---

# Review de la wallet

Revisa lo ya implementado. Corrige solo lo que puedas demostrar. No amplíes el producto.

## Antes de opinar

Lee, sin copiarlos a este archivo:

1. [challenge.md](../senior-web-developer/challenge.md) — alcance permitido.
2. [atomic-design.md](../senior-web-developer/atomic-design.md) — capas y dependencias.
3. `DECISIONS.md` — defaults ya justificados. No los reabras si el código los cumple.

Alcance de la auditoría: `src/` y `tests/`.

## Criterios

### Mejoras no vistas en el desarrollo

Busca fallos que el flujo feliz no enseña:

- Bugs de estado, de navegación o de un escenario de confirmación.
- Carga, vacío o error ausentes en Login o Home.
- Reglas de monto, saldo o destinatario fuera de `src/domain`.
- `any`, contratos de request o response implícitos, y duplicación que ya tiene un segundo uso real en este challenge.

### SOLID

Aplícalo a este corte, no como rediseño:

- Una razón de cambio por módulo. Un componente no mezcla formato, regla de negocio y navegación.
- Variar la UI componiendo props. No bifurques `validateTransfer` ni los cinco escenarios para un caso de pantalla.
- Props del dato que el componente pinta. No pases el store ni el draft entero a un atom o molecule.
- Las pages dependen de funciones de `src/domain` y de `src/services`. Atoms, molecules, organisms y templates no llaman `fetch`.

### Atomic Design

La dependencia apunta hacia abajo: page → template → organism → molecule → atom.

- Un nivel inferior no importa un nivel superior, ni `src/app`, ni `src/services`.
- Atoms y molecules no deciden si la transferencia es válida, no hacen fetch y no navegan.
- Organisms pueden llamar funciones puras de `src/domain`. No navegan ni llaman a la red.
- La page es la única dueña de I/O y de navegación.

`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` y `route.ts` no son código muerto por no tener imports.

### Código muerto

Un símbolo está muerto si ningún archivo de `src/` ni de `tests/` lo referencia, fuera del archivo que lo define.

Revisa exports, archivos y ramas inalcanzables. Si la referencia no es concluyente (registro dinámico, convención de Next.js, uso solo en un test que protege un contrato), infórmalo y no lo borres.

## Qué no es un hallazgo

- Renombres y estilo.
- Pantallas, autenticación real, pagos o persistencia fuera de [challenge.md](../senior-web-developer/challenge.md).
- Una abstracción nueva sin un segundo uso real ya presente.
- Un default de `DECISIONS.md` que el código ya cumple.

## Ciclo

1. Anota cada hallazgo con archivo y evidencia antes de editar.
2. Corrige solo esos hallazgos. El cambio se queda en el alcance del challenge y respeta las capas.
3. Corre `npm test` y `npm run test:e2e`. Vitest usa `tests/`. Playwright usa `tests/e2e` y levanta `npm run dev` en el puerto 3000.
4. Si un comando falla, corrige la causa y vuelve a correr los dos. No des el review por terminado con un fallo.
5. Si el e2e no puede arrancar, dilo en el informe. No declares éxito.
6. Si el cambio toca UI, verifica en el navegador el flujo afectado (Login, Home, nueva transacción o confirmación) antes de cerrar.
7. Actualiza `AI_USAGE.md`. Deja vacío el apartado de lo que decidió la persona. No lo inventes.

## Informe

Entrega esto en español:

```markdown
# Review

## Hallazgos
- `ruta`: evidencia y criterio (mejora, SOLID, Atomic Design o código muerto).

## Corregido
- Qué cambió y por qué.

## Sin tocar
- Hallazgo no concluyente o fuera del challenge, con el motivo.

## Tests
- `npm test`: resultado.
- `npm run test:e2e`: resultado.
```

En `AI_USAGE.md`, agrega un bloque con la herramienta, la parte del proyecto, qué se aceptó y qué se corrigió. El tercer punto queda vacío.
