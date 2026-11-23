import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query
from backend.app.db.mongodb import db_manager, memory_db
from backend.app.models.order import OrderCreate, OrderResponse, OrderStatusUpdate
from backend.app.producers.events import emit_order_created

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order_in: OrderCreate):
    internal_id = str(uuid.uuid4())
    order_id = f"HMY-{datetime.utcnow().strftime('%y%m%d')}-{str(uuid.uuid4())[:4].upper()}"

    payment_status = "PAID" if order_in.payment_method == "RAZORPAY" and order_in.razorpay_payment_id else "PENDING"
    order_status = "Confirmed" if payment_status == "PAID" else "Pending"

    # User Relationship: Match or link user_id
    linked_user_id = order_in.user_id
    if not linked_user_id and db_manager.is_connected and db_manager.db is not None:
        user = await db_manager.db.users.find_one({
            "$or": [
                {"email": order_in.email.lower() if order_in.email else None},
                {"phone": order_in.phone}
            ]
        })
        if user:
            linked_user_id = user["id"]

    order_dict = {
        "id": internal_id,
        "order_id": order_id,
        "user_id": linked_user_id,
        "customer_name": order_in.customer_name,
        "phone": order_in.phone,
        "email": order_in.email,
        "address": order_in.address,
        "city": order_in.city,
        "pincode": order_in.pincode,
        "items": [item.dict() for item in order_in.items],
        "subtotal": order_in.subtotal,
        "delivery_charge": order_in.delivery_charge,
        "discount": order_in.discount,
        "total": order_in.total,
        "payment_method": order_in.payment_method,
        "payment_status": payment_status,
        "status": order_status,
        "razorpay_payment_id": order_in.razorpay_payment_id,
        "razorpay_order_id": order_in.razorpay_order_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.orders.insert_one(order_dict)
    else:
        memory_db["orders"][internal_id] = order_dict

    # Asynchronously emit lightweight event to RabbitMQ pipeline (< 5ms)
    await emit_order_created(order_dict)

    return OrderResponse(**order_dict)

@router.get("", response_model=List[OrderResponse])
async def list_orders(
    phone: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status")
):
    query = {}
    if phone:
        query["phone"] = phone
    if status_filter and status_filter.lower() != "all":
        query["status"] = {"$regex": f"^{status_filter}$", "$options": "i"}

    if db_manager.is_connected and db_manager.db is not None:
        cursor = db_manager.db.orders.find(query).sort("created_at", -1)
        orders = await cursor.to_list(length=100)
    else:
        orders = list(memory_db["orders"].values())
        if phone:
            orders = [o for o in orders if o["phone"] == phone]
        if status_filter and status_filter.lower() != "all":
            orders = [o for o in orders if o["status"].lower() == status_filter.lower()]
        orders.sort(key=lambda x: x["created_at"], reverse=True)

    return [OrderResponse(**o) for o in orders]

@router.get("/user/{user_id}", response_model=List[OrderResponse])
async def list_orders_by_user(user_id: str):
    """Fetch all orders linked to a specific user_id"""
    if db_manager.is_connected and db_manager.db is not None:
        cursor = db_manager.db.orders.find({"user_id": user_id}).sort("created_at", -1)
        orders = await cursor.to_list(length=100)
    else:
        orders = [o for o in memory_db["orders"].values() if o.get("user_id") == user_id]
        orders.sort(key=lambda x: x["created_at"], reverse=True)

    return [OrderResponse(**o) for o in orders]

@router.get("/stats/summary")
async def get_orders_summary():
    """Aggregated statistics for Akash's Admin Hub"""
    if db_manager.is_connected and db_manager.db is not None:
        all_orders = await db_manager.db.orders.find().to_list(length=1000)
    else:
        all_orders = list(memory_db["orders"].values())

    total_sales = sum(o.get("total", 0) for o in all_orders)
    pending_count = sum(1 for o in all_orders if o.get("status") in ["Pending", "Confirmed"])
    shipped_count = sum(1 for o in all_orders if o.get("status") == "Shipped")
    delivered_count = sum(1 for o in all_orders if o.get("status") == "Delivered")

    return {
        "total_orders": len(all_orders),
        "total_sales": total_sales,
        "pending": pending_count,
        "shipped": shipped_count,
        "delivered": delivered_count,
    }

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    if db_manager.is_connected and db_manager.db is not None:
        order = await db_manager.db.orders.find_one({"$or": [{"order_id": order_id}, {"id": order_id}]})
    else:
        order = next(
            (o for o in memory_db["orders"].values() if o["order_id"] == order_id or o["id"] == order_id),
            None
        )

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return OrderResponse(**order)

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: str, payload: OrderStatusUpdate):
    valid_statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid status. Choose from: {valid_statuses}")

    if db_manager.is_connected and db_manager.db is not None:
        result = await db_manager.db.orders.find_one_and_update(
            {"$or": [{"order_id": order_id}, {"id": order_id}]},
            {
                "$set": {
                    "status": payload.status,
                    "updated_at": datetime.utcnow()
                }
            },
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return OrderResponse(**result)
    else:
        order = next(
            (o for o in memory_db["orders"].values() if o["order_id"] == order_id or o["id"] == order_id),
            None
        )
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        order["status"] = payload.status
        order["updated_at"] = datetime.utcnow()
        return OrderResponse(**order)

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: str):
    if db_manager.is_connected and db_manager.db is not None:
        res = await db_manager.db.orders.delete_one({"$or": [{"order_id": order_id}, {"id": order_id}]})
        if res.deleted_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    else:
        key_to_delete = next(
            (k for k, o in memory_db["orders"].items() if o["order_id"] == order_id or o["id"] == order_id),
            None
        )
        if not key_to_delete:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        del memory_db["orders"][key_to_delete]
