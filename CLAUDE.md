@AGENTS.md

---

## قوانین کدنویسی این پروژه

### محدودیت‌های فاز ۱ — اجباری

- **ممنوع:** `axios`، `React Query`، `SWR`، `Redux`، یا هر state management library
- **ممنوع:** فراخوانی مستقیم API داخل component — همه fetch callها باید در `src/services/` باشند
- **ممنوع:** استفاده از `any` در TypeScript — همیشه interface یا type صریح تعریف کن
- **ممنوع:** `next/font/google` — در این محیط crash می‌کند (از `system-ui` استفاده کن)
- **ممنوع:** کتابخانه styling (Tailwind، styled-components و ...) — فقط CSS Modules

### معماری اجباری

```
types/  →  services/  →  hooks/  →  app/ (components)
```

| پوشه | مسئولیت | چه چیزی نباید داشته باشد |
|------|---------|--------------------------|
| `types/` | فقط interface و type | هیچ منطقی |
| `services/` | فقط fetch + error throw | useState، useEffect، JSX |
| `hooks/` | فقط state + useEffect + AbortController | JSX، fetch مستقیم |
| `app/` | فقط UI + استفاده از hooks | fetch مستقیم، business logic |

### TypeScript

- هر API response باید interface مشخص داشته باشد
- از `as any` یا `@ts-ignore` پرهیز کن
- پارامترهای اختیاری را با `?` علامت‌گذاری کن
- قبل از ادامه کار، `npx tsc --noEmit` را اجرا کن — باید بدون خطا pass شود

### CSS

- فقط CSS Modules (`.module.css`)
- CSS Variables در `globals.css` تعریف شده‌اند — با `var(--name)` استفاده کن
- هیچ inline style اضافه نکن مگر برای مقادیر dynamic

### AbortController — الگوی اجباری

هر `useEffect` که fetch دارد باید این ساختار را داشته باشد:

```typescript
useEffect(() => {
  const controller = new AbortController();

  fetchSomething(controller.signal)
    .then(data => { /* setState */ })
    .catch((err: Error) => {
      // هر دو نام را بررسی کن
      if (err.name !== "AbortError" && err.name !== "CanceledError") {
        // setState error
      }
    });

  return () => controller.abort(); // cleanup اجباری
}, [deps]);
```

### Next.js 16 — نکات حیاتی

قبل از نوشتن هر کد جدید، مستندات مربوطه را بخوان:
```
node_modules/next/dist/docs/01-app/
```

- `params` و `searchParams` در صفحات **Promise** هستند
- در Client Component از `React.use(params)` استفاده کن
- در Server Component از `await params` استفاده کن
- هر component که از `useState`، `useEffect`، یا event handler استفاده می‌کند باید `'use client'` داشته باشد

### هنگام اضافه کردن feature جدید

۱. ابتدا type را در `src/types/` تعریف کن
۲. سپس service function را در `src/services/` بنویس
۳. سپس custom hook را در `src/hooks/` بساز
۴. در آخر component را در `src/app/` بنویس
۵. `npx tsc --noEmit` را اجرا و خطاها را برطرف کن
