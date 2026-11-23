import json
import logging
from datetime import datetime
from typing import Dict, Any, List
import aio_pika
from backend.app.consumers.base import BaseConsumer
from backend.app.core.config import settings
from backend.app.db.mongodb import db_manager, memory_db

logger = logging.getLogger("homies.dlq_worker")

# In-memory store for DLQ messages if MongoDB is offline
dlq_memory_store: List[Dict[str, Any]] = []

class DeadLetterWorker(BaseConsumer):
    """
    Consumer worker for queue:dead_letter.
    Monitors poisoned or repeatedly failed messages routed by DLX (homies.dlx).
    Logs structured error traces and persists messages to MongoDB / memory
    for manual investigation or admin replay.
    """
    def __init__(self):
        super().__init__(
            queue_name=settings.QUEUE_DEAD_LETTER,
            prefetch_count=10,
            worker_name="DeadLetterWorker",
        )

    async def process_event(
        self,
        event_type: str,
        data: Dict[str, Any],
        raw_message: aio_pika.abc.AbstractIncomingMessage
    ):
        headers = dict(raw_message.headers or {})
        death_header = headers.get("x-death", [])
        last_error = headers.get("x-last-error", "Unknown error")
        retry_count = headers.get("x-retry-count", 0)

        record = {
            "routing_key": raw_message.routing_key,
            "event_type": event_type,
            "correlation_id": raw_message.correlation_id,
            "headers": headers,
            "death_details": death_header,
            "last_error": last_error,
            "retry_count": retry_count,
            "data": data,
            "captured_at": datetime.utcnow().isoformat() + "Z",
        }

        logger.error(
            f"☠️ [DLQ Alert] Dead-lettered event captured! "
            f"Type={event_type} Routing={raw_message.routing_key} Error={last_error}"
        )

        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.dead_letters.insert_one(record)
        else:
            dlq_memory_store.append(record)
            if len(dlq_memory_store) > 1000:
                dlq_memory_store.pop(0)

        logger.info(f"💾 Persisted dead-letter record for correlation_id={raw_message.correlation_id}")
