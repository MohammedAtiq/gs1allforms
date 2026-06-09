# API Layer — Simple Guide

## Flow

```
Component
    ↓
services/userService.ts       ← Step 2: domain hooks
    ↓
hooks/api/useApiQuery.ts      ← GET
hooks/api/useApiMutation.ts   ← POST / PUT / DELETE
    ↓
lib/api/endpoints.ts          ← Step 1: saari URLs yahan
    ↓
lib/api/client.ts             ← axios instance (auth, baseURL)
    ↓
Backend API
```

---

## 3 Rules

1. **Component** → sirf `services/` se import karo
2. **Services** → sirf `hooks/api/` use karo
3. **URLs** → sirf `endpoints.ts` mein likho

---

## Naya API Add Karna — 3 Steps

---

### Step 1 — URL likho `lib/api/endpoints.ts`

```ts
export const ENDPOINTS = {
  users: {
    list:   "/users",
    detail: (id: number) => `/users/${id}`,
    create: "/users",
    update: (id: number) => `/users/${id}`,
    delete: (id: number) => `/users/${id}`,
  },
};
```

> Agar URL change ho to sirf yahan update karo — poori app mein reflect hoga.

---

### Step 2 — Service banao `services/userService.ts`

```ts
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useCreate, useUpdate, useDelete } from "@/hooks/api/useApiMutation";
import { ENDPOINTS } from "@/lib/api/endpoints";

// GET — list
export function useUsers() {
  return useApiQuery(["users"], ENDPOINTS.users.list);
}

// GET — single
export function useUser(id: number) {
  return useApiQuery(["users", id], ENDPOINTS.users.detail(id));
}

// POST
export function useCreateUser() {
  return useCreate(ENDPOINTS.users.create, {
    invalidateKeys: [["users"]],   // create hone ke baad list refresh hogi
  });
}

// PUT
export function useUpdateUser(id: number) {
  return useUpdate(ENDPOINTS.users.update(id), {
    invalidateKeys: [["users"]],
  });
}

// DELETE
export function useDeleteUser(id: number) {
  return useDelete(ENDPOINTS.users.delete(id), {
    invalidateKeys: [["users"]],
  });
}
```

---

### Step 3 — Component mein use karo

```tsx
"use client";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/services/userService";

export default function Users() {
  const { data, isLoading, error } = useUsers();
  const { mutate: create, isPending: creating } = useCreateUser();
  const { mutate: update } = useUpdateUser(1);
  const { mutate: remove } = useDeleteUser(1);

  if (isLoading) return <p>Loading...</p>;
  if (error)     return <p>Error aaya!</p>;

  return (
    <div>
      {/* List */}
      {data?.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}

      {/* Create */}
      <button
        disabled={creating}
        onClick={() => create({ name: "Ali", email: "ali@test.com" })}
      >
        {creating ? "Saving..." : "Add User"}
      </button>

      {/* Update */}
      <button onClick={() => update({ name: "New Name" })}>
        Update User 1
      </button>

      {/* Delete */}
      <button onClick={() => remove()}>
        Delete User 1
      </button>
    </div>
  );
}
```

---

## Files Ka Kaam

| File | Kaam |
|---|---|
| `lib/api/client.ts` | Axios instance — baseURL, auth token, error handling |
| `lib/api/endpoints.ts` | Saari API URLs ek jagah |
| `hooks/api/useApiQuery.ts` | Generic GET hook |
| `hooks/api/useApiMutation.ts` | Generic POST/PUT/PATCH/DELETE hooks |
| `providers/QueryProvider.tsx` | React Query setup — `app/layout.tsx` mein wrap hai |
| `services/xyzService.ts` | Domain-specific hooks — components yahan se import karte hain |

---

## Hook States

```ts
const { data, isLoading, error } = useUsers();
//      ↑       ↑          ↑
//   response  true/false  error object

const { mutate, isPending, isSuccess, isError } = useCreateUser();
//       ↑         ↑           ↑          ↑
//     call karo  loading    success     failed
```

---

## Environment Variable

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

---

## Naya Domain Add Karna (Summary)

```
1. endpoints.ts  → URLs likho
2. services/     → naya xyzService.ts banao (userService.ts copy karo)
3. Component     → service se import karo
```
