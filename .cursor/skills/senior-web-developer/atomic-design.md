# Atomic Design

Cada componente de esta wallet tiene un solo nivel. La dependencia apunta hacia abajo:

page → template → organism → molecule → atom

Un nivel inferior no importa un nivel superior, ni `src/app`, ni `src/services`.

## Estructura

```text
src/
  app/                          # pages: rutas, datos, navegación
    login/page.tsx
    home/page.tsx
    transaction/page.tsx
    transaction/confirm/page.tsx
    api/                        # Route Handlers mock
  components/
    atoms/
    molecules/
    organisms/
    templates/
  domain/                       # tipos y reglas puras
  services/                     # cliente de los Route Handlers
```

Un componente vive en su carpeta:

```text
src/components/molecules/AmountInput/AmountInput.tsx
src/components/molecules/AmountInput/AmountInput.test.tsx
```

## Contrato por capa

### Atom

Primitivo visual. Ejemplos: `Button`, `TextInput`, `Spinner`, `AmountText`, `Icon`, `Badge`.

- Recibe props de presentación y emite eventos DOM.
- No conoce saldo, usuario, transacción ni rutas.
- No hace fetch, no usa el store, no importa domain ni services.

### Molecule

Composición de atoms con una sola responsabilidad de UI. Ejemplos: `FormField`, `AmountInput`, `ContactRow`, `MovementItem`, `SummaryRow`.

- Puede formatear y validar forma (email, teléfono, número).
- Puede mostrar un mensaje de error que le llega por props.
- No decide si el monto cabe en el saldo ni si la transacción puede confirmarse.

### Organism

Sección de una pantalla. Ejemplos: `LoginForm`, `BalanceHeader`, `MovementsList`, `TransactionComposer`, `ReceiptCard`.

- Compone molecules y atoms.
- Puede usar un hook de interacción local.
- Puede llamar funciones puras de `src/domain` para saber qué mensaje mostrar.
- No navega, no llama `fetch` ni `src/services`.

### Template

Esqueleto de layout con slots. Ejemplos: `AuthTemplate`, `WalletTemplate`.

- Define regiones (cabecera, contenido, acción primaria).
- No carga datos ni conoce el resultado de una transacción.

### Page

Ruta en `src/app`. Única dueña de I/O y de navegación.

- Carga datos (Server Component o llamada al service desde un Client Component de la ruta).
- Compone un template y organisms.
- Aplica `validateTransfer` antes de confirmar y envía el draft al Route Handler.
- Traduce `ConfirmationOutcome` al organism que corresponda.

`src/domain` no importa React. `src/services` habla con los Route Handlers y devuelve los tipos de dominio.

## Mapa de la wallet

| Pieza | Capa | Responsabilidad |
| --- | --- | --- |
| `Button`, `TextInput`, `Spinner`, `AmountText` | atom | Apariencia y eventos |
| `FormField` | molecule | Label, control y mensaje |
| `AmountInput` | molecule | Formato de monto y valor emitido |
| `ContactRow`, `MovementItem` | molecule | Una fila presentacional |
| `LoginForm` | organism | Teléfono o email, submit, error de formato |
| `BalanceHeader` | organism | Nombre y saldo ya cargados |
| `MovementsList` | organism | Lista, vacío o error ya resueltos |
| `TransactionComposer` | organism | Monto, contacto, resumen |
| `ReceiptCard` | organism | Comprobante |
| `AuthTemplate`, `WalletTemplate` | template | Layout |
| `app/login`, `app/home`, `app/transaction` | page | Datos, sesión, navegación, confirmación |

## Dónde vive cada responsabilidad

| Responsabilidad | Lugar |
| --- | --- |
| Formato de moneda y de teléfono | molecule o util de UI |
| Monto > 0, monto ≤ saldo, destinatario presente | `src/domain` |
| Elegir escenario aleatorio de confirmación | Route Handler |
| Reintentar tras error de red | page, disparando de nuevo el service |
| Persistir la sesión mock | page o módulo de sesión usado por la page |
| Guardar un contacto nuevo | Route Handler mock, invocado desde la page |

## Ejemplos

Molecule. Emite el valor y deja la regla afuera:

```tsx
type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function AmountInput({ value, onChange, error }: AmountInputProps) {
  return (
    <FormField label="Monto" error={error}>
      <TextInput
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}
```

Dominio. La page y el organism consumen este resultado:

```ts
export function validateTransfer(
  draft: TransferDraft,
  availableBalance: number,
): TransferViolation | null {
  if (draft.amount <= 0) return "amount-not-positive";
  if (draft.amount > availableBalance) return "insufficient-balance";
  if (!draft.recipientId) return "recipient-required";
  return null;
}
```

Page. Orquesta y no reimplementa la regla:

```tsx
const violation = validateTransfer(draft, balance);
if (violation) {
  setError(violation);
  return;
}
const outcome = await confirmTransfer(draft);
```

## Checklist al crear un componente

- Tiene un solo nivel y un solo motivo de cambio.
- Sus imports solo apuntan hacia abajo.
- Si decide si una transferencia es válida, no es atom ni molecule.
- Si llama a la red o hace `router.push`, es una page.
- El estado vacío, de carga y de error de una lista vive en el organism que la renderiza, con datos que ya trajo la page.
