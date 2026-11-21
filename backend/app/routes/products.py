import uuid
from typing import List
from fastapi import APIRouter, HTTPException, status
from backend.app.db.mongodb import db_manager, memory_db
from backend.app.models.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

# Initial default products
DEFAULT_PRODUCTS = [
    {
        "id": "prod-1",
        "name": "Citrus Fresh Disinfectant Floor Cleaner",
        "category": "floor-cleaner",
        "category_label": "Floor Cleaner",
        "price": 199.0,
        "original_price": 249.0,
        "unit": "1 Litre",
        "rating": 4.8,
        "reviews_count": 320,
        "tag": "Bestseller",
        "in_stock": True,
        "image": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80",
        "additional_images": ["https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80"],
        "description": "Advanced antibacterial floor cleaning formula that kills 99.9% germs, lifts tough stains, and leaves your rooms smelling like freshly squeezed citrus all day.",
        "benefits": ["Kills 99.9% of germs & bacteria", "Removes tough grease & grime without sticky residue", "Safe on marble and tiles"],
        "usage_instructions": "Add 1 cap (approx. 20ml) into half a bucket of water (4 Litres). Gently mop the surface.",
        "fragrance_or_type": "Citrus & Lemongrass"
    },
    {
        "id": "prod-3",
        "name": "Ultra Clean Power Toilet Cleaner Gel",
        "category": "toilet-cleaner",
        "category_label": "Toilet Cleaner",
        "price": 149.0,
        "original_price": 180.0,
        "unit": "750 ml",
        "rating": 4.9,
        "reviews_count": 512,
        "tag": "Most Loved",
        "in_stock": True,
        "image": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
        "additional_images": [],
        "description": "Thick blue gel formula clings to the bowl to dissolve tough limescale, yellow water stains, and 99.9% toilet germs in under 15 minutes.",
        "benefits": ["Thick clinging gel", "Dissolves tough yellow stains", "Eliminates foul odors"],
        "usage_instructions": "Squeeze nozzle under the bowl rim and around. Leave for 15-20 minutes. Brush lightly and flush.",
        "fragrance_or_type": "Ocean Breeze Disinfectant"
    },
    {
        "id": "prod-5",
        "name": "360° Spin Mop with Dual Bucket & Microfiber Refills",
        "category": "mops-tools",
        "category_label": "Mop & Tools",
        "price": 899.0,
        "original_price": 1299.0,
        "unit": "Set (Bucket + Mop + 2 Refills)",
        "rating": 4.9,
        "reviews_count": 840,
        "tag": "Bestseller",
        "in_stock": True,
        "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
        "additional_images": [],
        "description": "Ergonomic 360-degree rotating spin mop with stainless steel wringer bucket.",
        "benefits": ["Stainless steel rapid spin wringer", "Super-absorbent microfibers", "Includes 2 extra washable refills"],
        "usage_instructions": "Insert mop into basket to wet, place in spinner basket and press handle to spin-dry.",
        "fragrance_or_type": "Heavy Duty Stainless Steel"
    }
]

@router.get("", response_model=List[ProductResponse])
async def list_products():
    if db_manager.is_connected and db_manager.db is not None:
        cursor = db_manager.db.products.find()
        products = await cursor.to_list(length=100)
        if not products:
            # Seed default products
            await db_manager.db.products.insert_many(DEFAULT_PRODUCTS)
            products = DEFAULT_PRODUCTS
    else:
        if not memory_db["products"]:
            for p in DEFAULT_PRODUCTS:
                memory_db["products"][p["id"]] = p
        products = list(memory_db["products"].values())

    return [ProductResponse(**p) for p in products]

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product_in: ProductCreate):
    prod_id = f"prod-{str(uuid.uuid4())[:8]}"
    product_dict = product_in.dict()
    product_dict["id"] = prod_id

    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.products.insert_one(product_dict)
    else:
        memory_db["products"][prod_id] = product_dict

    return ProductResponse(**product_dict)

@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, payload: ProductUpdate):
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided to update")

    if db_manager.is_connected and db_manager.db is not None:
        updated = await db_manager.db.products.find_one_and_update(
            {"id": product_id},
            {"$set": update_data},
            return_document=True
        )
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return ProductResponse(**updated)
    else:
        product = memory_db["products"].get(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        product.update(update_data)
        return ProductResponse(**product)
