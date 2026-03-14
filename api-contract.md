# API Contract — Wedding Planner

Documento de referência para o agente de API. Descreve os contratos de **Checklist** e **Orçamento**, seguindo os mesmos padrões já implementados no frontend.

---

## Padrões do frontend (referência)

### Autenticação

Todas as requisições são feitas via `axios` com Bearer token injetado automaticamente pelo interceptor em `src/services/api.ts`:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Em caso de `401`, o frontend redireciona para `/login`.

### Convenção de service

Cada módulo segue o padrão de `src/services/guestService.ts`:

- Uma interface para a **entidade completa** retornada pela API (com `id`, `weddingId`, campos de auditoria `createdAt`/`updatedAt`)
- Uma interface **DTO** para criação (`Create<Entidade>DTO`), com campos opcionais quando aplicável
- Um objeto `<entidade>Service` com métodos async que chamam a instância `api` e retornam `response.data`

```ts
// Exemplo do padrão já estabelecido
export const guestService = {
  async getAll(): Promise<Guest[]> {
    return (await api.get('/guests')).data;
  },
  async create(data: CreateGuestDTO) {
    return (await api.post('/guests', data)).data;
  },
  async update(id, data) {
    return (await api.put(`/guests/${id}`, data)).data;
  },
  async delete(id) {
    await api.delete(`/guests/${id}`);
  },
};
```

### Convenção de hooks

Cada módulo segue o padrão de `src/hooks/useGuests.ts` com **TanStack React Query**:

- `useQuery` para leituras, com `queryKey` fixo por módulo
- `useMutation` para mutações, com `queryClient.invalidateQueries` no `onSuccess` para refetch automático

```ts
// Exemplo do padrão já estabelecido
const GUESTS_QUERY_KEY = ['guests'];

export const useGuests = () =>
  useQuery({
    queryKey: GUESTS_QUERY_KEY,
    queryFn: () => guestService.getAll(),
  });
export const useCreateGuest = () => {
  /* useMutation + invalidateQueries */
};
export const useUpdateGuest = () => {
  /* useMutation + invalidateQueries */
};
export const useDeleteGuest = () => {
  /* useMutation + invalidateQueries */
};
```

---

## Checklist

### Interfaces TypeScript (service)

```ts
// Entidade completa retornada pela API
export interface Task {
  id: string;
  weddingId: string;
  title: string;
  completed: boolean;
  category: string;
  period: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskGroup {
  period: string; // ex: "12+ meses antes"
  description: string; // ex: "Planejamento inicial"
  tasks: Task[];
}

// DTO para criação
export interface CreateTaskDTO {
  title: string;
  category: string;
  period: string; // identifica o grupo destino
  completed?: boolean; // opcional, default false
}
```

### Arquivo esperado: `src/services/checklistService.ts`

```ts
export const checklistService = {
  async getAll(): Promise<TaskGroup[]> {
    return (await api.get('/checklist')).data;
  },
  async create(data: CreateTaskDTO): Promise<Task> {
    return (await api.post('/checklist/tasks', data)).data;
  },
  async update(id: string, data: Partial<CreateTaskDTO>): Promise<Task> {
    return (await api.put(`/checklist/tasks/${id}`, data)).data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/checklist/tasks/${id}`);
  },
};
```

### Arquivo esperado: `src/hooks/useChecklist.ts`

```ts
const CHECKLIST_QUERY_KEY = ['checklist'];

export const useChecklist = () =>
  useQuery({
    queryKey: CHECKLIST_QUERY_KEY,
    queryFn: () => checklistService.getAll(),
  });
export const useCreateTask = () => {
  /* useMutation + invalidateQueries */
};
export const useUpdateTask = () => {
  /* useMutation + invalidateQueries */
};
export const useDeleteTask = () => {
  /* useMutation + invalidateQueries */
};
```

---

### GET `/checklist`

Retorna todos os grupos de tarefas com suas tarefas aninhadas.

**Response `200 OK`:**

```json
[
  {
    "period": "12+ meses antes",
    "description": "Planejamento inicial",
    "tasks": [
      {
        "id": "uuid",
        "weddingId": "uuid",
        "title": "Definir data do casamento",
        "completed": true,
        "category": "Planejamento",
        "period": "12+ meses antes",
        "createdAt": "2025-01-10T10:00:00.000Z",
        "updatedAt": "2025-01-10T10:00:00.000Z"
      }
    ]
  }
]
```

> A ordem dos grupos deve respeitar a sequência temporal (mais distante → mais próximo da data do casamento).

---

### POST `/checklist/tasks`

Cria uma nova tarefa dentro de um grupo existente.

**Request body:**

```json
{
  "title": "Nova tarefa",
  "category": "Cerimônia",
  "period": "6-9 meses antes"
}
```

**Response `201 Created`:** objeto `Task` completo com `id`, `weddingId`, `completed: false`, `createdAt`, `updatedAt`.

**Response `404 Not Found`** se o `period` não existir.

---

### PUT `/checklist/tasks/:id`

Atualiza campos de uma tarefa (equivalente ao `api.put` já usado em guests).

**Request body (campos opcionais):**

```json
{ "completed": true }
```

**Response `200 OK`:** objeto `Task` completo atualizado.

**Response `404 Not Found`** se o `id` não existir.

---

### DELETE `/checklist/tasks/:id`

Remove uma tarefa.

**Response `204 No Content`**.

**Response `404 Not Found`** se o `id` não existir.

---

## Orçamento

### Interfaces TypeScript (service)

```ts
// Entidade completa retornada pela API
export interface BudgetCategory {
  id: string;
  weddingId: string;
  name: string;
  planned: number; // valor em BRL (inteiro)
  spent: number; // valor em BRL (inteiro)
  color: string; // hex, ex: "#8B7355" — usado diretamente no gráfico Recharts
  createdAt: string;
  updatedAt: string;
}

// DTO para criação
export interface CreateBudgetCategoryDTO {
  name: string;
  planned: number;
  color: string;
  spent?: number; // opcional, default 0
}
```

> Os totais (`totalPlanned`, `totalSpent`, `remaining`, `percentUsed`) são **calculados no frontend** — a API não precisa retorná-los.

| Campo          | Cálculo no frontend                             |
| -------------- | ----------------------------------------------- |
| `totalPlanned` | `categories.reduce((s, c) => s + c.planned, 0)` |
| `totalSpent`   | `categories.reduce((s, c) => s + c.spent, 0)`   |
| `remaining`    | `totalPlanned - totalSpent`                     |
| `percentUsed`  | `Math.round((totalSpent / totalPlanned) * 100)` |

### Arquivo esperado: `src/services/budgetService.ts`

```ts
export const budgetService = {
  async getAll(): Promise<BudgetCategory[]> {
    return (await api.get('/budget/categories')).data;
  },
  async create(data: CreateBudgetCategoryDTO): Promise<BudgetCategory> {
    return (await api.post('/budget/categories', data)).data;
  },
  async update(
    id: string,
    data: Partial<CreateBudgetCategoryDTO>,
  ): Promise<BudgetCategory> {
    return (await api.put(`/budget/categories/${id}`, data)).data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/budget/categories/${id}`);
  },
};
```

### Arquivo esperado: `src/hooks/useBudget.ts`

```ts
const BUDGET_QUERY_KEY = ['budget', 'categories'];

export const useBudgetCategories = () =>
  useQuery({
    queryKey: BUDGET_QUERY_KEY,
    queryFn: () => budgetService.getAll(),
  });
export const useCreateBudgetCategory = () => {
  /* useMutation + invalidateQueries */
};
export const useUpdateBudgetCategory = () => {
  /* useMutation + invalidateQueries */
};
export const useDeleteBudgetCategory = () => {
  /* useMutation + invalidateQueries */
};
```

---

### GET `/budget/categories`

Retorna todas as categorias de orçamento.

**Response `200 OK`:**

```json
[
  {
    "id": "uuid",
    "weddingId": "uuid",
    "name": "Local e Buffet",
    "planned": 45000,
    "spent": 42000,
    "color": "#8B7355",
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-02-01T14:30:00.000Z"
  }
]
```

---

### POST `/budget/categories`

**Request body:**

```json
{
  "name": "Flores",
  "planned": 5000,
  "color": "#E8D5C4"
}
```

**Response `201 Created`:** objeto `BudgetCategory` completo com `spent: 0`.

---

### PUT `/budget/categories/:id`

**Request body (campos opcionais):**

```json
{
  "planned": 20000,
  "spent": 16000
}
```

**Response `200 OK`:** objeto `BudgetCategory` completo atualizado.

**Response `404 Not Found`** se o `id` não existir.

---

### DELETE `/budget/categories/:id`

**Response `204 No Content`**.

**Response `404 Not Found`** se o `id` não existir.

---

## Notas gerais

- **IDs** são `string` (UUID), seguindo o padrão da entidade `Guest` já implementada.
- **Valores monetários** são inteiros em BRL (ex: `45000` = R$ 45.000,00). A formatação é feita no frontend via `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
- **`color`** das categorias de orçamento é usado diretamente no Recharts (`<Cell fill={color} />`), deve ser hex válido.
- **Campos de auditoria** (`weddingId`, `createdAt`, `updatedAt`) devem ser incluídos nas respostas, seguindo o padrão de `Guest`.
- O frontend usa **TanStack React Query** — mutações bem-sucedidas disparam `invalidateQueries` para refetch automático, portanto as respostas devem sempre retornar o objeto atualizado (não apenas `{ success: true }`).
