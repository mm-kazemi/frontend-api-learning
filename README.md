# Frontend API Learning

یک پروژه آموزشی چند فازی برای یادگیری مفاهیم کار با API در React/Next.js.

## هدف پروژه

یادگیری عملی مفاهیم پایه‌ای API در یک محیط واقعی، بدون انتزاع‌های اضافی:

- **GET requests** ساده (لیست و آیتم تکی)
- **Pagination** با `limit` و `skip`
- **Search و Filter** کردن داده
- **مدیریت سه حالت:** loading / error / empty state
- **TypeScript** برای type-safe API responses
- **AbortController** برای cleanup صحیح در `useEffect`
- **Custom Hooks** برای جداسازی data logic از UI

## تکنولوژی‌ها

| ابزار | نسخه | هدف |
|-------|-------|------|
| Next.js | 16.2.9 | Framework — App Router |
| React | 19.2.4 | UI Library |
| TypeScript | ^5 | Type Safety |
| CSS Modules | — | Styling (بدون هیچ کتابخانه‌ای) |
| dummyjson.com | — | Fake REST API |

## ساختار پروژه

```
src/
├── types/
│   └── product.ts            # Product, ProductsResponse, ProductsParams
├── services/
│   └── productService.ts     # fetchProducts(), fetchProductById()
├── hooks/
│   ├── useProducts.ts        # لیست + pagination + search + AbortController
│   └── useProduct.ts         # محصول تکی + AbortController
└── app/
    ├── layout.tsx             # Root layout — system fonts (بدون Google Fonts)
    ├── globals.css            # CSS Variables + reset
    ├── page.tsx               # صفحه خانه (Server Component)
    ├── page.module.css
    ├── products/
    │   ├── page.tsx           # لیست محصولات (Client Component)
    │   └── products.module.css
    └── products/[id]/
        ├── page.tsx           # جزئیات محصول (Client Component)
        └── product.module.css
```

## راه‌اندازی

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. متغیر محیطی (فایل .env.local از قبل موجود است)
# محتوا:
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com

# ۳. اجرا
npm run dev
# → http://localhost:3000

# بررسی type safety
npx tsc --noEmit
```

## مسیرهای برنامه

| Route | توضیح | نوع Component |
|-------|-------|---------------|
| `/` | صفحه خانه | Server Component |
| `/products` | لیست محصولات با جستجو و pagination | Client Component |
| `/products/[id]` | جزئیات یک محصول | Client Component |

## معماری لایه‌ای

```
Component → Custom Hook → Service → API
   (UI)       (state)     (fetch)   (dummyjson)
```

هر لایه فقط با لایه مجاور خود صحبت می‌کند.

## فازهای توسعه

| فاز | موضوع | وضعیت |
|-----|--------|--------|
| ۱ | Native Fetch + Custom Hooks | ✅ کامل |
| ۲ | جایگزینی با Axios در `services/` | ⏳ برنامه‌ریزی‌شده |
| ۳ | جایگزینی Custom Hooks با React Query | ⏳ برنامه‌ریزی‌شده |
| ۴ | افزودن Redux Toolkit برای client state | ⏳ برنامه‌ریزی‌شده |
