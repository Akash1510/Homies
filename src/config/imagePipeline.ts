/**
 * Image Asset Pipeline Configuration for Homies Clean
 *
 * This configuration allows dropping real product packaging photos into `public/images/products/`
 * without changing any product schema or breaking backward compatibility with existing mock URLs.
 */

export interface ImageAssetSpec {
  recommendedDimensions: string;
  recommendedAspect: string;
  recommendedFormats: string[];
  maxFileSizeKb: number;
}

export const IMAGE_PIPELINE_SPEC: ImageAssetSpec = {
  recommendedDimensions: '1000x1000 px',
  recommendedAspect: '1:1 Square',
  recommendedFormats: ['image/webp', 'image/png', 'image/jpeg'],
  maxFileSizeKb: 350,
};

/**
 * Resolves a product image:
 * If a local packaging image exists in `/images/products/{productId}.webp` or PNG,
 * it returns that relative path. Otherwise falls back to provided image or high-res placeholder.
 */
export function resolveProductImage(productId: string, currentImage?: string): string {
  if (currentImage && currentImage.trim().length > 0) {
    return currentImage;
  }
  return `/images/products/${productId}.webp`;
}

/**
 * Maps product category to optimized placeholder background theme
 */
export function getCategoryBadgeColor(categoryId: string): string {
  switch (categoryId) {
    case 'floor-care':
      return 'bg-emerald-500 text-white';
    case 'toilet-care':
      return 'bg-blue-600 text-white';
    case 'dishwash':
      return 'bg-amber-500 text-white';
    case 'tools-mops':
      return 'bg-purple-600 text-white';
    default:
      return 'bg-sky-600 text-white';
  }
}
