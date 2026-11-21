import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from backend.app.core.config import settings
from backend.app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token
)
from backend.app.db.mongodb import db_manager, memory_db
from backend.app.models.user import UserCreate, UserLogin, UserResponse, UserUpdate, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if db_manager.is_connected and db_manager.db is not None:
        user = await db_manager.db.users.find_one({"id": user_id})
    else:
        user = memory_db["users"].get(user_id)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate):
    clean_email = user_in.email.lower().strip()
    
    # Check if user already exists
    if db_manager.is_connected and db_manager.db is not None:
        existing = await db_manager.db.users.find_one({"email": clean_email})
    else:
        existing = next((u for u in memory_db["users"].values() if u["email"] == clean_email), None)

    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Auto assign admin role ONLY for Akash
    is_admin = (clean_email == settings.ADMIN_EMAIL.lower()) or (user_in.phone and "7776032964" in user_in.phone)
    role = "admin" if is_admin else "customer"

    user_id = str(uuid.uuid4())
    user_dict = {
        "id": user_id,
        "email": clean_email,
        "full_name": user_in.full_name,
        "phone": user_in.phone,
        "address": user_in.address or "",
        "city": user_in.city or "",
        "pincode": user_in.pincode or "",
        "role": role,
        "hashed_password": get_password_hash(user_in.password),
        "created_at": datetime.utcnow()
    }

    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.users.insert_one(user_dict)
    else:
        memory_db["users"][user_id] = user_dict

    token = create_access_token(subject=user_id)
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=clean_email,
            full_name=user_in.full_name,
            phone=user_in.phone,
            address=user_in.address,
            city=user_in.city,
            pincode=user_in.pincode,
            role=role,
            created_at=user_dict["created_at"]
        )
    )

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    clean_email = credentials.email.lower().strip()

    if db_manager.is_connected and db_manager.db is not None:
        user = await db_manager.db.users.find_one({"email": clean_email})
    else:
        user = next((u for u in memory_db["users"].values() if u["email"] == clean_email), None)

    # 1. Bootstrap Admin Akash
    if not user and clean_email == settings.ADMIN_EMAIL.lower():
        user_id = "admin-akash"
        user = {
            "id": user_id,
            "email": clean_email,
            "full_name": "Akash (Store Owner)",
            "phone": settings.ADMIN_PHONE,
            "address": "Admin Hub, Homies Clean HQ",
            "city": "Mumbai",
            "pincode": "400001",
            "role": "admin",
            "hashed_password": get_password_hash(settings.ADMIN_INITIAL_PASSWORD),
            "created_at": datetime.utcnow()
        }
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.users.insert_one(user)
        else:
            memory_db["users"][user_id] = user

    # 2. Bootstrap Test Customer User (test@gmail.com / akash123456)
    if not user and clean_email == "test@gmail.com":
        user_id = "user-test-customer"
        user = {
            "id": user_id,
            "email": "test@gmail.com",
            "full_name": "Test Customer",
            "phone": "+91 9876543210",
            "address": "Flat 402, Sunshine Apartments, MG Road",
            "city": "Mumbai",
            "pincode": "400001",
            "role": "customer",
            "hashed_password": get_password_hash("akash123456"),
            "created_at": datetime.utcnow()
        }
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.users.insert_one(user)
        else:
            memory_db["users"][user_id] = user

    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(subject=user["id"])
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            phone=user.get("phone"),
            address=user.get("address"),
            city=user.get("city"),
            pincode=user.get("pincode"),
            role=user.get("role", "customer"),
            created_at=user.get("created_at", datetime.utcnow())
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        phone=current_user.get("phone"),
        address=current_user.get("address"),
        city=current_user.get("city"),
        pincode=current_user.get("pincode"),
        role=current_user.get("role", "customer"),
        created_at=current_user.get("created_at", datetime.utcnow())
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    payload: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    if db_manager.is_connected and db_manager.db is not None:
        updated = await db_manager.db.users.find_one_and_update(
            {"id": current_user["id"]},
            {"$set": update_data},
            return_document=True
        )
        return UserResponse(
            id=updated["id"],
            email=updated["email"],
            full_name=updated["full_name"],
            phone=updated.get("phone"),
            address=updated.get("address"),
            city=updated.get("city"),
            pincode=updated.get("pincode"),
            role=updated.get("role", "customer"),
            created_at=updated.get("created_at", datetime.utcnow())
        )
    else:
        current_user.update(update_data)
        return UserResponse(
            id=current_user["id"],
            email=current_user["email"],
            full_name=current_user["full_name"],
            phone=current_user.get("phone"),
            address=current_user.get("address"),
            city=current_user.get("city"),
            pincode=current_user.get("pincode"),
            role=current_user.get("role", "customer"),
            created_at=current_user.get("created_at", datetime.utcnow())
        )
