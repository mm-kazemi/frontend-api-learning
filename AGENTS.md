# راهنمای Agent — Frontend API Learning

## ⚠️ این Next.js با آنچه می‌دانی فرق دارد

نسخه: **16.2.9** (App Router) — قبل از هر تغییر، مستندات محلی را بخوان:

```
node_modules/next/dist/docs/01-app/03-api-reference/
```

---

## وضعیت فعلی پروژه: فاز ۱ — کامل‌شده

### فایل‌های موجود و وضعیت آن‌ها

| فایل | وضعیت | توضیح |
|------|--------|-------|
| `src/types/product.ts` | ✅ نهایی | Product, ProductsResponse, ProductsParams |
| `src/services/productService.ts` | ✅ نهایی | fetchProducts(), fetchProductById() |
| `src/hooks/useProducts.ts` | ✅ نهایی | query + page + limit → state |
| `src/hooks/useProduct.ts` | ✅ نهایی | id → state |
| `src/app/layout.tsx` | ✅ نهایی | Root layout بدون Google Fonts |
| `src/app/globals.css` | ✅ نهایی | CSS Variables + reset |
| `src/app/page.tsx` | ✅ نهایی | صفحه خانه — Server Component |
| `src/app/products/page.tsx` | ✅ نهایی | لیست — Client Component, LIMIT=15 |
| `src/app/products/[id]/page.tsx` | ✅ نهایی | جزئیات — Client Component |
| `.env.local` | ✅ موجود | NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com |

---

## تفاوت‌های حیاتی Next.js 16

### ۱. params یک Promise است

```tsx
// ❌ روش قدیمی — خطا می‌دهد
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}

// ✅ Server Component
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}

// ✅ Client Component (روش مورد استفاده در این پروژه)
"use client";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
}
```

### ۲. next/font/google — ممنوع

در این محیط crash می‌کند. از system-ui استفاده کن:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### ۳. 'use client' boundary

Client Componentها باید با `"use client"` شروع شوند. تمام صفحات تعاملی این پروژه Client Component هستند چون از hooks استفاده می‌کنند.

---

## توصیف لایه‌های معماری

### Layer 1 — Types (`src/types/`)

**وظیفه:** قرارداد TypeScript برای تمام داده‌های API

**ورودی:** ساختار JSON از `https://dummyjson.com`
**خروجی:** interface و type که در سرتاسر پروژه import می‌شوند

```typescript
// src/types/product.ts
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;   // ⚠️ ممکن است در برخی محصولات undefined باشد — قبل از رندر چک کن
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsParams {
  limit?: number;
  skip?: number;
  q?: string;
}
```

**قانون:** هیچ منطق اجرایی اینجا نیست — فقط type definitions.

---

### Layer 2 — Services (`src/services/`)

**وظیفه:** تمام HTTP requests — بدون state، بدون hooks

**ورودی:** پارامترهای request + اختیاری `AbortSignal`
**خروجی:** `Promise<T>` که resolve یا throw می‌کند

```typescript
// src/services/productService.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

fetchProducts(params: ProductsParams, signal?: AbortSignal): Promise<ProductsResponse>
// URL pattern: /products?limit=15&skip=0
// با query:   /products/search?q=phone&limit=15&skip=0

fetchProductById(id: number, signal?: AbortSignal): Promise<Product>
// URL pattern: /products/{id}
```

**Endpoints واقعی dummyjson.com:**
- `GET /products?limit=N&skip=N` — لیست
- `GET /products/search?q=term&limit=N&skip=N` — جستجو
- `GET /products/{id}` — آیتم تکی

**قانون:** فقط fetch و throw — هرگز useState یا useEffect.

---

### Layer 3 — Hooks (`src/hooks/`)

**وظیفه:** اتصال Service به Component + مدیریت async state

#### useProducts

```typescript
// ورودی
query: string   // رشته جستجو — خالی = بدون جستجو
page: number    // صفحه فعلی (1-indexed)
limit: number   // تعداد در هر صفحه (در حال حاضر 15)

// خروجی
{
  products: Product[];   // لیست محصولات صفحه فعلی
  total: number;         // کل تعداد (برای محاسبه totalPages)
  loading: boolean;      // true در حین fetch
  error: string | null;  // null = بدون خطا
}
```

**منطق داخلی:**
- با تغییر هر dependency، `loading = true` و fetch جدید شروع می‌شود
- `skip = (page - 1) * limit`
- اگر `query` خالی باشد، endpoint بدون search استفاده می‌شود
- `AbortController` cleanup را در بازگشت `useEffect` انجام می‌دهد

#### useProduct

```typescript
// ورودی
id: number   // شناسه محصول (از URL params)

// خروجی
{
  product: Product | null;  // null تا زمان load یا در صورت خطا
  loading: boolean;
  error: string | null;
}
```

**منطق داخلی:**
- اگر `id` نامعتبر باشد (NaN) فوری error set می‌شود
- `AbortController` cleanup را handle می‌کند

**قانون مشترک هر دو hook:**
```typescript
.catch((err: Error) => {
  if (err.name !== "AbortError" && err.name !== "CanceledError") {
    // هر دو نام را بررسی کن
  }
});
```

---

### Layer 4 — Components (`src/app/`)

**وظیفه:** رندر UI + تعامل با کاربر

#### صفحه لیست (`/products`)

```
State: searchInput (string), query (string), page (number)
Hook:  useProducts(query, page, LIMIT=15)

جریان جستجو:
  user types → setSearchInput (local، بلادرنگ)
  user submits form → setQuery(searchInput.trim()), setPage(1)
  query changes → useProducts re-fetches با AbortController

جریان pagination:
  user clicks → setPage(p ± 1)
  page changes → useProducts re-fetches

سه حالت رندر:
  loading=true  → spinner
  error!=null   → error box با دکمه retry
  products=[]   → empty state
  products>0    → grid of cards
```

#### صفحه جزئیات (`/products/[id]`)

```
params: Promise<{ id: string }> → React.use(params) → id
Hook: useProduct(Number(id))

سه حالت رندر:
  loading=true    → full-page spinner
  error!=null     → error + link بازگشت
  product!=null   → detail view با gallery و stats
```

---

## الگوهای مهم برای ادامه کار

### اضافه کردن یک resource جدید (مثلاً cart)

```
۱. src/types/cart.ts           ← interface تعریف کن
۲. src/services/cartService.ts ← fetch functions بنویس
۳. src/hooks/useCart.ts        ← hook با AbortController بساز
۴. src/app/cart/page.tsx       ← component با 'use client'
```

### جایگزینی fetch با axios (فاز ۲)

فقط `src/services/productService.ts` تغییر می‌کند:
```typescript
// قبل:
const response = await fetch(url, { signal });

// بعد:
const response = await axiosInstance.get(url, { signal });
```
Hooks و Components دست نخورده می‌مانند — این هدف اصلی این معماری بود.

### جایگزینی hooks با React Query (فاز ۳)

`useProducts` می‌شود:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['products', query, page, limit],
  queryFn: () => fetchProducts({ q: query, limit, skip: (page-1)*limit }),
});
```

---

## دستورات

```bash
npm run dev          # محیط توسعه روی localhost:3000
npm run build        # بیلد production
npx tsc --noEmit     # بررسی TypeScript — باید بدون خطا باشد
```

## API Reference (dummyjson.com)

```
Base URL: https://dummyjson.com

GET /products?limit=15&skip=0
GET /products/search?q={query}&limit=15&skip=0
GET /products/{id}
```
