import { Product } from '@/types/product';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1', name: 'Citrus Fresh Disinfectant Floor Cleaner', category: 'floor-cleaner', categoryLabel: 'Floor Cleaner',
    price: 199, originalPrice: 249, unit: '1 Litre', rating: 4.8, reviewsCount: 324, tag: 'Bestseller', inStock: true, stockCount: 15,
    fragranceOrType: 'Citrus & Lemongrass', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    additionalImages: ['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80'],
    description: 'Advanced antibacterial floor cleaning formula that kills 99.9% germs, lifts tough stains, and leaves rooms smelling like freshly squeezed citrus all day.',
    benefits: ['Kills 99.9% germs & bacteria', 'Removes tough grease & grime', 'Safe on marble, tiles & wood', 'Child & pet safe when dried'],
    usageInstructions: 'Add 1 cap (20ml) into 4L water. Mop surface. No rinsing needed.',
    reviews: [
      { id: 'rev-1', userName: 'Priya Sharma', rating: 5, date: '2 days ago', comment: 'Leaves marble sparkling clean!', verifiedBuyer: true },
      { id: 'rev-2', userName: 'Vikram Joshi', rating: 5, date: '1 week ago', comment: 'Removes kitchen grease spots effortlessly.', verifiedBuyer: true }
    ]
  },
  {
    id: 'prod-2', name: 'Pine & Neem Herbal Surface Cleaner', category: 'floor-cleaner', categoryLabel: 'Floor Cleaner',
    price: 185, originalPrice: 230, unit: '1 Litre', rating: 4.7, reviewsCount: 184, tag: 'Natural', inStock: true, stockCount: 4,
    fragranceOrType: 'Forest Pine & Neem', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80',
    description: 'Natural pine oil and neem extracts. Naturally repels insects, flies, and mosquitoes while giving a sparkling floor finish.',
    benefits: ['Natural fly & mosquito repellent', '100% biodegradable active agents', 'Deep gloss shine', 'Free from toxic fumes'],
    usageInstructions: 'Mix 1.5 caps per 4 litres of water. Wipe clean.',
    reviews: [{ id: 'rev-3', userName: 'Sunita Menon', rating: 5, date: '3 days ago', comment: 'Keeps mosquitoes away in the evening!', verifiedBuyer: true }]
  },
  {
    id: 'prod-3', name: 'Ultra Clean Power Toilet Cleaner Gel', category: 'toilet-cleaner', categoryLabel: 'Toilet Cleaner',
    price: 149, originalPrice: 180, unit: '750 ml', rating: 4.9, reviewsCount: 512, tag: 'Most Loved', inStock: true, stockCount: 22,
    fragranceOrType: 'Ocean Breeze Disinfectant', image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
    description: 'Thick blue gel clings to bowl to dissolve tough limescale, yellow stains, and 99.9% toilet germs in under 15 minutes.',
    benefits: ['Thick clinging gel', 'Dissolves limescale & stains', 'Curved nozzle for rim access', 'Ocean breeze scent'],
    usageInstructions: 'Squeeze nozzle under rim. Leave 15 mins. Brush and flush.',
    reviews: [{ id: 'rev-4', userName: 'Rajesh Nair', rating: 5, date: '5 days ago', comment: 'Dissolved 2-year old deposits in 20 minutes!', verifiedBuyer: true }]
  },
  {
    id: 'prod-4', name: 'Eco-Active Scale & Grout Stain Remover', category: 'toilet-cleaner', categoryLabel: 'Toilet Cleaner',
    price: 165, originalPrice: 210, unit: '500 ml', rating: 4.6, reviewsCount: 95, tag: 'Save 21%', inStock: true, stockCount: 3,
    fragranceOrType: 'Lime & Mint', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    description: 'Targeted acid-safe cleaner for bathroom tiles, grouting, washbasins, and toilet bowls affected by hard water minerals.',
    benefits: ['Lifts hard water deposits', 'Restores bright white grout', 'Porcelain safe'],
    usageInstructions: 'Apply onto grout. Wait 5 mins. Scrub and rinse with water.'
  },
  {
    id: 'prod-5', name: '360° Spin Mop with Dual Bucket & Microfiber Refills', category: 'mops-tools', categoryLabel: 'Mop & Tools',
    price: 899, originalPrice: 1299, unit: 'Set (Bucket + Mop + 2 Refills)', rating: 4.9, reviewsCount: 840, tag: 'Bestseller', inStock: true, stockCount: 8,
    fragranceOrType: 'Heavy Duty Stainless Steel', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    description: 'Ergonomic 360-degree rotating spin mop with stainless steel wringer bucket. Easily wrings out water with minimal effort.',
    benefits: ['Stainless steel wringer', 'Absorbent microfiber traps dust', 'Extendable handle', '2 extra washable heads'],
    usageInstructions: 'Wet in bucket, place in spinner basket, press handle down to spin-dry.',
    reviews: [{ id: 'rev-5', userName: 'Meera Patel', rating: 5, date: 'Yesterday', comment: 'Top quality stainless steel wringer.', verifiedBuyer: true }]
  },
  {
    id: 'prod-6', name: 'Flat Microfiber Floor Mop with 360 Head', category: 'mops-tools', categoryLabel: 'Mop & Tools',
    price: 499, originalPrice: 699, unit: '1 Mop + 2 Microfiber Pads', rating: 4.7, reviewsCount: 210, tag: 'Quick Clean', inStock: true, stockCount: 12,
    fragranceOrType: 'Slim Reach Design', image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-slim flat mop designed to slide under sofas, beds, and tight spaces. Use wet for deep wash or dry for pet hair dusting.',
    benefits: ['Flat 180° low profile reach', 'Washable reusable pads', 'Wet mopping and dry dusting', 'Hands-free scraper'],
    usageInstructions: 'Attach pad to Velcro. Mop in S-shape motions. Clean pad with built-in scraper.'
  },
  {
    id: 'prod-7', name: 'Heavy-Duty Silicone Floor Squeegee Wiper', category: 'mops-tools', categoryLabel: 'Mop & Tools',
    price: 279, originalPrice: 399, unit: '1 Piece (45cm Blade)', rating: 4.8, reviewsCount: 160, inStock: true, stockCount: 5,
    fragranceOrType: 'Soft Rubber Blade', image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
    description: 'Commercial grade bathroom floor wiper with high-elasticity rubber blade. Dries water in one single glide without trails.',
    benefits: ['Zero water streaks on tiles', 'Rust-proof aluminium handle', 'Lightweight comfortable grip'],
    usageInstructions: 'Pull wiper towards drain at a 45-degree angle.'
  },
  {
    id: 'prod-8', name: 'Sparkle Multi-Surface & Glass Spray Cleaner', category: 'bathroom-kitchen', categoryLabel: 'Bathroom & Kitchen',
    price: 175, originalPrice: 220, unit: '500 ml Spray Bottle', rating: 4.7, reviewsCount: 190, tag: 'Streak-Free', inStock: true, stockCount: 18,
    fragranceOrType: 'Crisp Aqua Fresh', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    description: 'Instant streak-free shine for mirrors, windows, countertops, and faucets. Cuts through oil, fingerprints, and soap scum.',
    benefits: ['Evaporates with zero streaks', 'Anti-fog repellent coating', 'Dual spray/foam nozzle'],
    usageInstructions: 'Spray from 15cm distance. Wipe immediately with clean microfiber cloth.'
  },
  {
    id: 'prod-9', name: 'Complete Home Sparkling Hygiene Combo Pack', category: 'combos', categoryLabel: 'Value Combo',
    price: 1199, originalPrice: 1799, unit: 'Combo Pack (5 Items)', rating: 5.0, reviewsCount: 640, tag: 'Mega Savings 33% OFF', inStock: true, stockCount: 10,
    fragranceOrType: 'All-in-One Hygiene Essentials', image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
    description: 'The ultimate cleaning kit! 1L Citrus Floor Cleaner, 750ml Toilet Cleaner, 500ml Glass Spray, 1 Heavy Duty Wiper, and 2 Microfiber Cloths.',
    benefits: ['Complete home solution', 'Saves over 33%', 'Free express delivery', 'Professional strength'],
    usageInstructions: 'Use as per individual bottle guidelines.',
    reviews: [{ id: 'rev-6', userName: 'Kavita Das', rating: 5, date: '4 days ago', comment: 'Amazing value combo pack. Highly recommended!', verifiedBuyer: true }]
  },
  {
    id: 'prod-10', name: 'Bathroom Refresh Duo: Toilet Gel + Tile Cleaner', category: 'combos', categoryLabel: 'Value Combo',
    price: 289, originalPrice: 390, unit: '2 Pack (750ml + 500ml)', rating: 4.9, reviewsCount: 380, tag: 'Super Saver', inStock: true, stockCount: 14,
    fragranceOrType: 'Disinfectant Duo', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80',
    description: 'Keep your bathroom spotless. High-viscosity toilet cleaner gel combined with deep scale grout remover.',
    benefits: ['Tackles toilet bowl & tiles', 'Total germ protection', 'Persistent fresh scent'],
    usageInstructions: 'Use Toilet Gel inside bowl and Scale Remover on tiles. Flush and rinse.'
  }
];
