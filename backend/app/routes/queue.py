import json
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, status
from backend.app.core.config import settings
from backend.app.producers.rabbitmq import mq_producer
from backend.app.consumers.dlq_worker import dlq_memory_store
from backend.app.db.mongodb import db_manager

router = APIRouter(prefix="/queue", tags=["Queue & Message Broker Monitor"])

@router.get("/stats")
async def get_queue_stats():
    """
    Returns real-time RabbitMQ queue depths, message counts, and active worker consumers.
    """
    stats = await mq_producer.get_queue_stats()
    return {
        "broker_url": settings.RABBITMQ_URL.split("@")[-1] if "@" in settings.RABBITMQ_URL else settings.RABBITMQ_URL,
        "exchange": settings.RABBITMQ_EXCHANGE,
        "dlx": settings.RABBITMQ_DLX_EXCHANGE,
        "data": stats,
    }

@router.get("/dead-letter", response_model=List[Dict[str, Any]])
async def list_dead_letters(limit: int = 50):
    """
    Fetch dead-lettered messages that failed after maximum retry attempts.
    """
    if db_manager.is_connected and db_manager.db is not None:
        records = await db_manager.db.dead_letters.find().sort("captured_at", -1).to_list(length=limit)
        for r in records:
            if "_id" in r:
                r["_id"] = str(r["_id"])
        return records
    return dlq_memory_store[:limit]

@router.post("/dead-letter/retry")
async def retry_dead_letter(correlation_id: Optional[str] = None):
    """
    Replay dead-lettered message(s) back into the main topic exchange for reprocessing.
    """
    replayed = 0
    if db_manager.is_connected and db_manager.db is not None:
        query = {"correlation_id": correlation_id} if correlation_id else {}
        records = await db_manager.db.dead_letters.find(query).to_list(length=100)
        for r in records:
            routing_key = r.get("routing_key", "order.created")
            event_type = r.get("event_type", "order.created")
            data = r.get("data", {})
            await mq_producer.publish(
                routing_key=routing_key,
                event_type=event_type,
                payload=data,
                correlation_id=r.get("correlation_id"),
                headers={"x-replayed-from-dlq": True},
            )
            replayed += 1
        if correlation_id:
            await db_manager.db.dead_letters.delete_many(query)
    else:
        for r in list(dlq_memory_store):
            if not correlation_id or r.get("correlation_id") == correlation_id:
                await mq_producer.publish(
                    routing_key=r.get("routing_key", "order.created"),
                    event_type=r.get("event_type", "order.created"),
                    payload=r.get("data", {}),
                    correlation_id=r.get("correlation_id"),
                    headers={"x-replayed-from-dlq": True},
                )
                dlq_memory_store.remove(r)
                replayed += 1

    return {"status": "replayed", "count": replayed}

@router.post("/test-event")
async def publish_test_event(
    routing_key: str = "order.created",
    event_type: str = "order.created",
    payload: Optional[Dict[str, Any]] = None,
):
    """
    Test helper to benchmark event publishing speed and verify pipeline execution.
    """
    sample = payload or {
        "order_id": "HMY-TEST-0001",
        "customer_name": "Akash Test Customer",
        "phone": "+91 7776032964",
        "email": "test@gmail.com",
        "address": "123 Clean Street",
        "city": "Mumbai",
        "pincode": "400001",
        "total": 599.0,
        "items": [{"name": "Citrus Floor Cleaner", "quantity": 1, "price": 299.0}],
    }
    result = await mq_producer.publish(
        routing_key=routing_key,
        event_type=event_type,
        payload=sample,
    )
    return result
