# Web Performans Optimizasyonu Rehberi

Bu belge, Next.js web uygulaması için performans optimizasyonlarını açıklar.

## Mevcut Optimizasyonlar ✅

### 1. Next.js Image Optimization
- `next/image` kullanımı (otomatik lazy loading, WebP dönüşümü)
- Remote image domains yapılandırıldı

### 2. PWA (Progressive Web App)
- Service Worker ile caching
- Offline destek
- App manifest

### 3. Code Splitting
- Next.js otomatik route-based splitting
- Dynamic imports (`next/dynamic`)

---

## Önerilen Optimizasyonlar

### 1. Bundle Analyzer

```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // diğer config
});
```

### 2. Font Optimization

```javascript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true 
});
```

### 3. Script Optimization

```javascript
import Script from 'next/script';

// Analytics örneği
<Script 
  src="https://example.com/analytics.js" 
  strategy="lazyOnload" 
/>
```

### 4. Image Preloading

```javascript
// Kritik görseller için
<link rel="preload" as="image" href="/hero.webp" />
```

### 5. React Server Components
- Varsayılan olarak Server Components kullanın
- `'use client'` sadece gerektiğinde

### 6. API Route Caching

```javascript
// app/api/data/route.ts
export const revalidate = 3600; // 1 saat cache

export async function GET() {
  // ...
}
```

---

## Lighthouse Hedefleri

| Metrik | Hedef |
|--------|-------|
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 90 |
| SEO | > 95 |
| PWA | ✅ |

---

## Lighthouse Audit Komutu

```bash
# Chrome DevTools'dan veya CLI ile:
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Mobil simülasyon
npx lighthouse http://localhost:3000 --emulated-form-factor=mobile
```

---

## Core Web Vitals

| Metrik | Hedef | Anlamı |
|--------|-------|--------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **TTFB** | < 800ms | Time to First Byte |

---

## Production Checklist

- [x] next/image kullanımı
- [x] PWA yapılandırması
- [x] Gzip/Brotli compression (server)
- [ ] CDN kullanımı
- [ ] Database query optimization
- [ ] Redis cache aktif
- [ ] Bundle size < 200KB (gzipped)
- [ ] Lazy loading için `loading="lazy"`
- [ ] Font display: swap
