import { Product, Coupon } from '@/types/product';

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'Sparkles' },
  { id: 'floor-cleaner', label: 'Floor Cleaners', icon: 'Sparkle' },
  { id: 'toilet-cleaner', label: 'Toilet Cleaners', icon: 'ShieldCheck' },
  { id: 'mops-tools', label: 'Mops & Tools', icon: 'Brush' },
  { id: 'bathroom-kitchen', label: 'Bathroom & Kitchen', icon: 'SprayCan' },
  { id: 'combos', label: 'Value Combos', icon: 'Package' },
] as const;

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'HOMIES50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 399,
    description: 'Flat ₹50 OFF on orders above ₹399',
  },
  {
    code: 'CLEAN20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 599,
    description: '20% Mega Savings on orders above ₹599',
  },
  {
    code: 'FIRST10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 199,
    description: '10% OFF on your first home cleaning kit',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Citrus Fresh Disinfectant Floor Cleaner',
    category: 'floor-cleaner',
    categoryLabel: 'Floor Cleaner',
    price: 199,
    originalPrice: 249,
    unit: '1 Litre',
    rating: 4.8,
    reviewsCount: 324,
    tag: 'Bestseller',
    inStock: true,
    stockCount: 15,
    fragranceOrType: 'Citrus & Lemongrass',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Advanced antibacterial floor cleaning formula that kills 99.9% germs, lifts tough stains, and leaves your rooms smelling like freshly squeezed citrus all day.',
    benefits: [
      'Kills 99.9% of germs & bacteria',
      'Removes tough grease & grime without sticky residue',
      'Safe on marble, granite, ceramic tiles, and wooden floors',
      'Child & pet safe formulation once dried'
    ],
    usageInstructions: 'Add 1 cap (approx. 20ml) into half a bucket of water (4 Litres). Gently mop the surface. No need to rinse.',
    reviews: [
      {
        id: 'rev-1',
        userName: 'Priya Sharma',
        rating: 5,
        date: '2 days ago',
        comment: 'Fragrance lasts the entire day and leaves marble sparkling clean without any stickiness!',
        verifiedBuyer: true,
      },
      {
        id: 'rev-2',
        userName: 'Vikram Joshi',
        rating: 5,
        date: '1 week ago',
        comment: 'Best floor cleaner I have used. Removes kitchen grease spots effortlessly.',
        verifiedBuyer: true,
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Pine & Neem Herbal Surface Cleaner',
    category: 'floor-cleaner',
    categoryLabel: 'Floor Cleaner',
    price: 185,
    originalPrice: 230,
    unit: '1 Litre',
    rating: 4.7,
    reviewsCount: 184,
    tag: 'Natural',
    inStock: true,
    stockCount: 4, // LOW STOCK WARNING (triggers urgency badge)
    fragranceOrType: 'Forest Pine & Neem',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80',
    description: 'Enriched with natural pine oil and neem extracts. Naturally repels insects, flies, and mosquitoes while giving a sparkling floor finish.',
    benefits: [
      'Natural fly & mosquito repelling formula',
      '100% biodegradable active agents',
      'Deep gloss shine for tiles and marble',
      'Free from harsh toxic fumes'
    ],
    usageInstructions: 'Mix 1.5 caps per 4 litres of clean water. For greasy kitchen floors, use undiluted and wipe off after 2 minutes.',
    reviews: [
      {
        id: 'rev-3',
        userName: 'Sunita Menon',
        rating: 5,
        date: '3 days ago',
        comment: 'Very effective at keeping mosquitoes away in evenings. Smells fresh and herbal.',
        verifiedBuyer: true,
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Ultra Clean Power Toilet Cleaner Gel',
    category: 'toilet-cleaner',
    categoryLabel: 'Toilet Cleaner',
    price: 149,
    originalPrice: 180,
    unit: '750 ml',
    rating: 4.9,
    reviewsCount: 512,
    tag: 'Most Loved',
    inStock: true,
    stockCount: 22,
    fragranceOrType: 'Ocean Breeze Disinfectant',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
    description: 'Thick blue gel formula clings to the bowl to dissolve tough limescale, yellow water stains, and 99.9% toilet germs in under 15 minutes.',
    benefits: [
      'Thick clinging gel for maximum surface contact',
      'Dissolves tough yellow stains and hard water scale',
      'Curved angled nozzle for under-the-rim application',
      'Eliminates foul odors instantly with ocean scent'
    ],
    usageInstructions: 'Squeeze nozzle under the bowl rim and around. Leave for 15-20 minutes. Brush lightly and flush for a sparkling clean toilet.',
    reviews: [
      {
        id: 'rev-4',
        userName: 'Rajesh Nair',
        rating: 5,
        date: '5 days ago',
        comment: 'Dissolved 2-year old hard water deposits in 20 minutes! Incredible product.',
        verifiedBuyer: true,
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Eco-Active Scale & Grout Stain Remover',
    category: 'toilet-cleaner',
    categoryLabel: 'Toilet Cleaner',
    price: 165,
    originalPrice: 210,
    unit: '500 ml',
    rating: 4.6,
    reviewsCount: 95,
    tag: 'Save 21%',
    inStock: true,
    stockCount: 3, // LOW STOCK WARNING
    fragranceOrType: 'Lime & Mint',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    description: 'Targeted acid-safe cleaner for bathroom tiles, grouting, washbasins, and toilet bowls affected by hard water minerals.',
    benefits: [
      'Lifts stubborn hard water rust & mineral deposits',
      'Restores bright white grout between tiles',
      'Non-abrasive on porcelain and sanitaryware'
    ],
    usageInstructions: 'Apply onto stains or grout lines. Allow 5-10 minutes to penetrate. Scrub with tile brush and wash with water.',
  },
  {
    id: 'prod-5',
    name: '360° Spin Mop with Dual Bucket & Microfiber Refills',
    category: 'mops-tools',
    categoryLabel: 'Mop & Tools',
    price: 899,
    originalPrice: 1299,
    unit: 'Set (Bucket + Mop + 2 Refills)',
    rating: 4.9,
    reviewsCount: 840,
    tag: 'Bestseller',
    inStock: true,
    stockCount: 8,
    fragranceOrType: 'Heavy Duty Stainless Steel',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    description: 'Ergonomic 360-degree rotating spin mop with stainless steel wringer bucket. Easily wrings out water with minimal effort and keeps hands clean and dry.',
    benefits: [
      'Stainless steel rapid spin wringer',
      'Super-absorbent microfibers trap dust and liquid',
      'Extendable stainless steel handle with lock',
      'Includes 2 extra washable microfiber mop heads'
    ],
    usageInstructions: 'Insert mop head into the water basket to wet, then place in the spinner basket. Press handle up and down to spin-dry to desired dampness.',
    reviews: [
      {
        id: 'rev-5',
        userName: 'Meera Patel',
        rating: 5,
        date: 'Yesterday',
        comment: 'Stainless steel wringer is top quality. Makes cleaning a breeze for my 3BHK flat.',
        verifiedBuyer: true,
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'Flat Microfiber Floor Mop with 360 Head',
    category: 'mops-tools',
    categoryLabel: 'Mop & Tools',
    price: 499,
    originalPrice: 699,
    unit: '1 Mop + 2 Microfiber Pads',
    rating: 4.7,
    reviewsCount: 210,
    tag: 'Quick Clean',
    inStock: true,
    stockCount: 12,
    fragranceOrType: 'Slim Reach Design',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-slim flat mop designed to slide seamlessly under sofas, beds, and tight spaces. Use wet for deep floor wash or dry for pet hair dusting.',
    benefits: [
      'Flat 180° low profile reach under furniture',
      'Washable and reusable heavy-density pads',
      'Dual use: Wet mopping and dry static dusting',
      'Hands-free scraper slide to remove hair & lint'
    ],
    usageInstructions: 'Attach microfiber pad to Velcro base. Mop freely in S-shape motions. Use built-in scraper to clean pad under running tap.',
  },
  {
    id: 'prod-7',
    name: 'Heavy-Duty Silicone Floor Squeegee Wiper',
    category: 'mops-tools',
    categoryLabel: 'Mop & Tools',
    price: 279,
    originalPrice: 399,
    unit: '1 Piece (45cm Blade)',
    rating: 4.8,
    reviewsCount: 160,
    inStock: true,
    stockCount: 5, // LOW STOCK WARNING
    fragranceOrType: 'Soft Rubber Blade',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
    description: 'Commercial grade bathroom and floor wiper with high-elasticity rubber blade. Dries water in one single glide without water trails or streaks.',
    benefits: [
      'Leaves zero water marks or streaks on tiles',
      'Durable rust-proof aluminium handle',
      'Lightweight and comfortable grip'
    ],
    usageInstructions: 'Pull wiper towards drain at a 45-degree angle for quickest water clearing in bathrooms and balconies.',
  },
  {
    id: 'prod-8',
    name: 'Sparkle Multi-Surface & Glass Spray Cleaner',
    category: 'bathroom-kitchen',
    categoryLabel: 'Bathroom & Kitchen',
    price: 175,
    originalPrice: 220,
    unit: '500 ml Spray Bottle',
    rating: 4.7,
    reviewsCount: 190,
    tag: 'Streak-Free',
    inStock: true,
    stockCount: 18,
    fragranceOrType: 'Crisp Aqua Fresh',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    description: 'Instant streak-free shine for mirrors, glass windows, kitchen countertops, tabletops, and bathroom faucets. Cuts through oil, fingerprints, and soap scum.',
    benefits: [
      'Quick evaporation with zero streaks or cloudy haze',
      'Anti-fog & anti-dust repellent coating',
      'Dual trigger nozzle (Spray & Foam modes)'
    ],
    usageInstructions: 'Turn nozzle to SPRAY. Mist onto glass or surface from 15-20 cm distance. Wipe down immediately with clean microfiber cloth.',
  },
  {
    id: 'prod-9',
    name: 'Complete Home Sparkling Hygiene Combo Pack',
    category: 'combos',
    categoryLabel: 'Value Combo',
    price: 1199,
    originalPrice: 1799,
    unit: 'Combo Pack (5 Items)',
    rating: 5.0,
    reviewsCount: 640,
    tag: 'Mega Savings 33% OFF',
    inStock: true,
    stockCount: 10,
    fragranceOrType: 'All-in-One Hygiene Essentials',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
    description: 'The ultimate cleaning kit for your home! Includes 1L Citrus Floor Cleaner, 750ml Power Toilet Cleaner, 500ml Glass Spray, 1 Heavy Duty Wiper, and 2 Microfiber Cloths.',
    benefits: [
      'Complete cleaning solution for bedroom, hall, kitchen & bathroom',
      'Saves over 33% compared to buying items separately',
      'Free express home delivery included',
      'High-grade professional strength formulas'
    ],
    usageInstructions: 'Use each item as per individual bottle guidelines. Perfect for monthly household replenishment.',
    reviews: [
      {
        id: 'rev-6',
        userName: 'Kavita Das',
        rating: 5,
        date: '4 days ago',
        comment: 'Amazing value combo pack. Solved all our house cleaning supplies for the month.',
        verifiedBuyer: true,
      }
    ]
  },
  {
    id: 'prod-10',
    name: 'Bathroom Refresh Duo: Toilet Gel + Tile Cleaner',
    category: 'combos',
    categoryLabel: 'Value Combo',
    price: 289,
    originalPrice: 390,
    unit: '2 Pack (750ml + 500ml)',
    rating: 4.9,
    reviewsCount: 380,
    tag: 'Super Saver',
    inStock: true,
    stockCount: 14,
    fragranceOrType: 'Disinfectant Duo',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80',
    description: 'Keep your bathroom germ-free and spotless. High-viscosity toilet cleaner gel combined with deep scale grout remover for sparkling sanitaryware.',
    benefits: [
      'Tackles both toilet bowl and surrounding tiles/grout',
      'Total germ protection and persistent fresh scent',
      'Exceptional value for daily bathroom care'
    ],
    usageInstructions: 'Use Toilet Gel inside bowl and Scale Remover on basin and tiles. Flush and rinse clean.',
  }
];

export const STORE_SETTINGS = {
  storeName: 'Homies Clean',
  tagline: 'Sparkling Clean Homes Made Effortless',
  whatsappNumber: '917776032964', // Admin WhatsApp number: +91 7776032964
  adminPhone: '+91 7776032964',
  adminEmail: 'akashgj777@gmail.com',
  currencySymbol: '₹',
  freeDeliveryThreshold: 499,
  deliveryFee: 49,
  supportHours: 'Mon-Sun: 9 AM - 8 PM',
  deliveryPromise: 'Same-day or next-day doorstep delivery',
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_HomiesDefaultKey',
  gstNumber: '27AABCH1234F1Z8', // For official invoice printing
};
