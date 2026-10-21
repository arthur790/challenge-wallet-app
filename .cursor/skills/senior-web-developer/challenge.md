# Web Challenge — Mini Wallet

Este archivo es el alcance permitido. Si una idea no está aquí, no entra en el producto.

## Contexto

Web app en Next.js + TypeScript que simula una wallet financiera:

Login → Home → Nueva transacción → Confirmación / comprobante

Los datos son mock. No hay servicios reales. El diseño debe pensar en escala y mantenibilidad (millones de usuarios activos) y resolver el challenge de forma simple y extensible.

La evaluación mira tipado, arquitectura, estado, permisos de UI, errores y componentes reutilizables. La seguridad real y la autenticación real quedan fuera.

## Stack permitido

- Next.js + TypeScript.
- Rendering SSR, CSR o mixto, con la decisión justificada. Default del skill: Server Components para lectura y Client Components para formularios.
- Navegación con App Router o Pages Router, justificada. Default: App Router.
- Estado a elección (Context, Zustand, Redux u otro), justificado. Default: Zustand acotado a sesión y borrador.
- Servicios mediante API Routes (Route Handlers) con datos mockeados.
- Tests unitarios de validaciones, hooks y componentes críticos.
- E2E con Playwright o el motor que se elija, justificado. Default: Playwright.

## Fuera de alcance

- Autenticación, autorización o criptografía reales.
- Pasarelas de pago, bancos, KYC o redes externas.
- Pantallas distintas de Login, Home, Nueva transacción y Confirmación / comprobante.
- Persistencia distinta de la sesión mock y de los contactos guardados en el mock.

## Pantallas

### Login

- Formulario de teléfono o email.
- Validar formato y campos requeridos.
- Estados de carga y de error simulado.
- Persistir una sesión mock simple.
- Navegar a Home tras el login exitoso.

Se evalúa estructura, estado, validación, navegación y separación de responsabilidades.

### Home

- Saldo disponible y nombre del usuario, mockeados.
- Lista de movimientos recientes.
- Estados de carga, vacío y error.
- Acción para iniciar una nueva transacción.
- Layout responsive.

Se evalúa composición, listas, estado, diseño responsive e información asíncrona.

### Nueva transacción

- Ingresar monto.
- Elegir un contacto favorito o escribir uno nuevo y guardarlo en el mock.
- Mostrar resumen antes de confirmar.
- Confirmar contra una respuesta mockeada.
- Mostrar comprobante o pantalla de éxito.

### Confirmación

La respuesta es aleatoria. Implementar los cinco escenarios, no solo el camino feliz.

| Escenario | Comportamiento |
| --- | --- |
| Éxito | Transacción confirmada y comprobante visible |
| Error de red | Estado de error con opción de reintentar |
| Fondos insuficientes | Error descriptivo |
| Timeout | Espera excesiva distinguible de un error de red genérico |
| Error desconocido | Fallback genérico |

Fondos insuficientes existe dos veces: la regla de dominio lo bloquea antes del submit, y el mock también puede devolverlo (saldo desactualizado). La pantalla de confirmación debe manejar esa respuesta del servidor.

## Reglas de negocio

Validar antes de confirmar. El lugar (dominio, no solo UI) forma parte de la evaluación.

1. Monto mínimo: rechazar cero y negativos.
2. Saldo suficiente: el monto no puede superar el saldo disponible.
3. Destinatario obligatorio: no confirmar sin destinatario.

Contrato esperado:

```ts
type TransferViolation =
  | "amount-not-positive"
  | "insufficient-balance"
  | "recipient-required";

type TransferDraft = {
  amount: number;
  recipientId: string | null;
};

function validateTransfer(
  draft: TransferDraft,
  availableBalance: number,
): TransferViolation | null;
```

## Contrato de confirmación

```ts
type ConfirmationOutcome =
  | { status: "success"; receipt: Receipt }
  | { status: "network-error" }
  | { status: "insufficient-funds" }
  | { status: "timeout" }
  | { status: "unknown-error" };
```

El Route Handler elige un escenario al azar. El cliente traduce cada status a su estado de UI. Reintentar solo aplica a error de red y, si el diseño lo deja claro, a timeout.

## Entregables

1. Código en un repositorio Git.
2. `README.md`: cómo ejecutar, librerías usadas, limitaciones conocidas y tiempo real invertido (lo escribe la persona).
3. `DECISIONS.md`: por qué la estructura es así, cómo se separaron UI y lógica, edge cases considerados y qué cambiaría con más tiempo. Incluye rendering, router, estado y motor e2e.
4. `AI_USAGE.md`:
   - Herramientas y en qué partes se usaron.
   - Qué se aceptó directo y qué se corrigió o rechazó.
   - Qué decisiones tomó la persona y no la IA.

Tests, capabilities y manejo de estado extra se valoran según el nivel, dentro de este alcance.

## Qué se valora

- TypeScript con intención: tipos claros, modelos de dominio, sin `any`, contratos definidos.
- Composición React: componentes limpios, hooks, UI separada de la lógica, renderizado condicional.
- Criterio de rendering: SSR, CSR, Server Actions cuando aporten.
- Servicios con API Routes.
- Reglas de negocio en el lugar correcto, no solo en la UI.
- Pragmatismo: simple y extensible.

El plazo del challenge es de 3 días calendario. El link del repo y el acceso, si es privado, los gestiona la persona.
