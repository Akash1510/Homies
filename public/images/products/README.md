# Homies Clean - Real Product Images Pipeline

When you have your actual packaging and bottle photos ready, follow this drop-in convention:

## 1. Specifications for Packaging Photos
- **Dimensions**: 1000 x 1000 px (1:1 square ratio)
- **Background**: Pure white `#FFFFFF` or transparent PNG / WebP
- **Format**: `.webp` (strongly recommended for ultra-fast loading under 100KB) or `.png` / `.jpg`
- **Location**: Put all photos into this directory: `public/images/products/`

## 2. Naming Convention
Name the file by the product's ID or slug:
- Floor Cleaner 5L: `floor-cleaner-5l.webp`
- Spin Mop: `spin-mop.webp`
- Toilet Cleaner 1L: `toilet-cleaner-1l.webp`
- Dishwash Gel 500ml: `dishwash-gel-500ml.webp`
- Glass & Surface Spray: `glass-surface-spray.webp`
- Microfiber Pack: `microfiber-pack.webp`

## 3. Live Updating
Once files are placed here, Next.js serves them at `/images/products/<filename>`.
You can update `src/data/initialProducts.ts` or edit the image URL directly in the **Admin Hub** (`/admin`).
