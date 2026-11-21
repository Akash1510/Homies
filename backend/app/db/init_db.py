import asyncio
from datetime import datetime
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.core.config import settings
from backend.app.core.security import get_password_hash

async def init_homies_database():
    print(f"Connecting to MongoDB at: {settings.MONGODB_URL} ...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]

    # Verify connection
    await client.admin.command('ping')
    print(f" Connected! Setting up database '{settings.MONGODB_DB_NAME}'...")

    # 1. SETUP INDEXES
    print("\n--- 1. Creating Collection Indexes ---")
    
    # Users Collection
    await db.users.create_index("email", unique=True)
    await db.users.create_index("phone")
    print("  users: Index on 'email' (unique), 'phone'")

    # Orders Collection
    await db.orders.create_index("order_id", unique=True)
    await db.orders.create_index("user_id")
    await db.orders.create_index("phone")
    await db.orders.create_index([("created_at", -1)])
    print("  orders: Index on 'order_id' (unique), 'user_id', 'phone', 'created_at'")

    # Products Collection
    await db.products.create_index("id", unique=True)
    await db.products.create_index("category")
    print("  products: Index on 'id' (unique), 'category'")

    # 2. SEED USERS (Admin Akash & Test Customer)
    print("\n--- 2. Managing Users Collection ---")
    admin_id = "user-akash-admin"
    admin_user = {
        "id": admin_id,
        "email": settings.ADMIN_EMAIL.lower(),
        "full_name": "Akash (Administrator)",
        "phone": settings.ADMIN_PHONE,
        "role": "admin",
        "hashed_password": get_password_hash(settings.ADMIN_INITIAL_PASSWORD),
        "address": "Admin HQ, Homies Clean Hub",
        "city": "Mumbai",
        "pincode": "400001",
        "created_at": datetime.utcnow()
    }

    await db.users.update_one(
        {"email": admin_user["email"]},
        {"$set": admin_user},
        upsert=True
    )
    print(f"  Admin User: {admin_user['email']} (Phone: {admin_user['phone']}, Role: admin)")

    # Test Customer User (test@gmail.com / akash123456)
    test_customer = {
        "id": "user-test-customer",
        "email": "test@gmail.com",
        "full_name": "Akash Test Customer",
        "phone": "+91 9876543210",
        "role": "customer",
        "hashed_password": get_password_hash("akash123456"),
        "address": "Flat 402, Sunshine Apartments, MG Road",
        "city": "Mumbai",
        "pincode": "400001",
        "created_at": datetime.utcnow()
    }

    await db.users.update_one(
        {"email": test_customer["email"]},
        {"$set": test_customer},
        upsert=True
    )
    print(f"  Test Customer User: {test_customer['email']} (Password: akash123456, Role: customer)")

    # 3. SEED PRODUCTS
    print("\n--- 3. Managing Products Collection ---")
    SEED_PRODUCTS = [
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
            "description": "Hospital grade antibacterial floor cleaning liquid with refreshing citrus aroma. Kills 99.9% germs.",
            "benefits": ["99.9% Germ Protection", "Streak-Free Shine", "Pet Safe once dried"],
            "usage_instructions": "Dilute 1 cap per 4 litres of water.",
            "fragrance_or_type": "Citrus & Lemongrass",
            "created_at": datetime.utcnow()
        },
        {
            "id": "prod-2",
            "name": "Pine & Neem Herbal Surface Cleaner",
            "category": "floor-cleaner",
            "category_label": "Floor Cleaner",
            "price": 185.0,
            "original_price": 230.0,
            "unit": "1 Litre",
            "rating": 4.7,
            "reviews_count": 184,
            "tag": "Natural",
            "in_stock": True,
            "image": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80",
            "description": "Natural pine oil and neem disinfectant that repels flies and mosquitoes naturally.",
            "benefits": ["Mosquito Repellent Formula", "Eco-friendly", "Safe on Marble"],
            "usage_instructions": "Mix 1.5 caps per bucket of water.",
            "fragrance_or_type": "Forest Pine & Neem",
            "created_at": datetime.utcnow()
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
            "description": "High viscosity clinging gel that removes tough hard-water limescale and yellow stains.",
            "benefits": ["Thick Clinging Formula", "Removes Hard Scale", "Ocean Breeze Freshness"],
            "usage_instructions": "Apply around rim, leave 15 mins, brush and flush.",
            "fragrance_or_type": "Ocean Breeze Disinfectant",
            "created_at": datetime.utcnow()
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
            "description": "Heavy-duty spin mop with stainless steel rapid wringer basket.",
            "benefits": ["Stainless Steel Wringer", "Washable Microfiber Heads", "Extendable Handle"],
            "usage_instructions": "Press handle down into bucket to spin-dry.",
            "fragrance_or_type": "Stainless Steel Edition",
            "created_at": datetime.utcnow()
        },
        {
            "id": "prod-9",
            "name": "Complete Home Sparkling Hygiene Combo Pack",
            "category": "combos",
            "category_label": "Value Combo",
            "price": 1199.0,
            "original_price": 1799.0,
            "unit": "Combo Pack (5 Items)",
            "rating": 5.0,
            "reviews_count": 640,
            "tag": "Mega Savings 33% OFF",
            "in_stock": True,
            "image": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
            "description": "Complete household hygiene kit including Floor Cleaner, Toilet Gel, Wiper, and Microfiber Cloths.",
            "benefits": ["Everything for Entire Home", "Save 33%", "Free Delivery Included"],
            "usage_instructions": "Use as per individual item guidelines.",
            "fragrance_or_type": "All-in-One Hygiene Essentials",
            "created_at": datetime.utcnow()
        }
    ]

    for prod in SEED_PRODUCTS:
        await db.products.update_one(
            {"id": prod["id"]},
            {"$set": prod},
            upsert=True
        )
    print(f"  Seeded/updated {len(SEED_PRODUCTS)} core cleaning products.")

    # 4. SEED SAMPLE ORDER LINKED TO USER AND ORDER_ID
    print("\n--- 4. Managing Orders Collection & User Relationship ---")
    sample_order_id = "HMY-261121-DEMO1"
    sample_order = {
        "id": str(uuid.uuid4()),
        "order_id": sample_order_id,
        "user_id": test_customer["id"],       # Links directly to test_customer
        "customer_name": test_customer["full_name"],
        "phone": test_customer["phone"],
        "email": test_customer["email"],
        "address": test_customer["address"],
        "city": test_customer["city"],
        "pincode": test_customer["pincode"],
        "items": [
            {
                "product_id": "prod-1",
                "name": "Citrus Fresh Disinfectant Floor Cleaner",
                "price": 199.0,
                "quantity": 2,
                "unit": "1 Litre"
            },
            {
                "product_id": "prod-3",
                "name": "Ultra Clean Power Toilet Cleaner Gel",
                "price": 149.0,
                "quantity": 1,
                "unit": "750 ml"
            }
        ],
        "subtotal": 547.0,
        "delivery_charge": 0.0,
        "discount": 100.0,
        "total": 547.0,
        "payment_method": "RAZORPAY",
        "payment_status": "PAID",
        "status": "Confirmed",
        "razorpay_order_id": "order_mock_98412918",
        "razorpay_payment_id": "pay_mock_82910481",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    await db.orders.update_one(
        {"order_id": sample_order["order_id"]},
        {"$set": sample_order},
        upsert=True
    )
    print(f"  Order Created: {sample_order_id}")
    print(f"     Linked User: {sample_order['user_id']} ({sample_order['customer_name']})")
    print(f"     Total: ₹{sample_order['total']} | Status: {sample_order['status']}")

    # Verification counts
    users_count = await db.users.count_documents({})
    orders_count = await db.orders.count_documents({})
    prods_count = await db.products.count_documents({})

    print("\n==========================================")
    print("Database 'homies' successfully provisioned!")
    print(f"• Total Users in 'users':       {users_count}")
    print(f"• Total Orders in 'orders':     {orders_count}")
    print(f"• Total Products in 'products': {prods_count}")
    print("==========================================")

    client.close()

if __name__ == "__main__":
    asyncio.run(init_homies_database())
