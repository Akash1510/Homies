# Product Images Folder

Place your home cleaning product photos directly into this folder (`/public/products/`).

### Suggested Naming Convention:
- `floor-cleaner-citrus.jpg` (or .png, .webp)
- `toilet-cleaner-power.jpg`
- `spin-mop-set.jpg`
- `microfiber-flat-mop.jpg`
- `floor-wiper.jpg`
- `multisurface-spray.jpg`
- `hygiene-combo-kit.jpg`

### How to Link to Products:
In [src/data/products.ts](file:///Users/provakil/Homies/src/data/products.ts), simply set the `image` field to `/products/your-image-name.jpg`:

```typescript
{
  id: 'prod-1',
  name: 'Citrus Fresh Disinfectant Floor Cleaner',
  image: '/products/floor-cleaner-citrus.jpg',
  ...
}
```

Whenever you add or drop photos, you can simply tell Antigravity the filenames or paths and they will be automatically mapped to your products!
